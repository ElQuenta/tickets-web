import { useCallback, useEffect, useState } from "react";
import { useFormik } from "formik";
import type { Role } from "../models/roleModels";
import type { User } from "../models/userModels";
import type { EditUserValues, UserModal } from "../models/userBoardModels";
import { editUserSchema } from "../schemas/userSchema";
import { getRoles } from "../services/roleService";
import {
  assignRoleToUser,
  editUser,
  getUsers,
  removeRoleFromUser,
} from "../services/userService";
import {
  getUserErrorMessage,
  toLocalDateTime,
  userHasRole,
} from "../utils/userWorkflow";
import { useRegister } from "./useRegister";

const emptyUser: EditUserValues = {
  username: "",
  email: "",
  phoneNumber: "",
  emailConfirmed: false,
  phoneNumberConfirmed: false,
  lockoutEnabled: true,
  lockoutEnd: "",
  password: "",
};

export const useUserBoard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rolesError, setRolesError] = useState("");
  const [modalError, setModalError] = useState("");
  const [modal, setModal] = useState<UserModal>(null);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{
    message: string;
    severity: "success" | "error";
  } | null>(null);
  const loadBoard = useCallback((signal?: AbortSignal) => {
    return Promise.allSettled([getUsers(signal), getRoles(signal)]).then(
      ([usersResult, rolesResult]) => {
        if (signal?.aborted) return;
        if (usersResult.status === "fulfilled") {
          setUsers(usersResult.value);
          setError("");
        } else {
          setError(
            getUserErrorMessage(
              usersResult.reason,
              "No se pudieron cargar los usuarios.",
            ),
          );
        }
        if (rolesResult.status === "fulfilled") {
          setRoles(rolesResult.value);
          setRolesError("");
        } else {
          setRolesError(
            getUserErrorMessage(
              rolesResult.reason,
              "No se pudieron cargar los roles.",
            ),
          );
        }
        setLoading(false);
      },
    );
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void loadBoard(controller.signal);
    return () => controller.abort();
  }, [loadBoard]);

  const reload = async () => {
    if (loading) return;
    setLoading(true);
    await loadBoard();
  };

  const registration = useRegister((error) => {
    setModal(null);
    setNotice(
      error
        ? {
            message: getUserErrorMessage(error, "No se pudo crear el usuario."),
            severity: "error",
          }
        : { message: "Usuario creado correctamente.", severity: "success" },
    );
    void reload();
  });

  const resetRegistration = () => {
    registration.formik.resetForm();
    registration.setShowPassword(false);
    registration.setShowConfirmPassword(false);
  };

  const mutate = async (action: () => Promise<unknown>, message: string) => {
    if (busy || loading) return;
    setBusy(true);
    setModalError("");
    try {
      await action();
      setModal(null);
      editFormik.resetForm();
      setNotice({ message, severity: "success" });
    } catch (error) {
      setModalError(
        getUserErrorMessage(
          error,
          "No se pudo completar el cambio. Intenta nuevamente.",
        ),
      );
    } finally {
      // Reflect any assignments that succeeded before a subsequent request failed.
      await reload();
      setBusy(false);
    }
  };

  const editFormik = useFormik<EditUserValues>({
    initialValues: emptyUser,
    validationSchema: editUserSchema,
    onSubmit: async (values) => {
      if (modal?.kind !== "edit") return;
      await mutate(
        () =>
          editUser(modal.user.id, {
            username: values.username.trim(),
            email: values.email.trim(),
            phoneNumber: values.phoneNumber.trim() || null,
            emailConfirmed: values.emailConfirmed,
            phoneNumberConfirmed:
              Boolean(values.phoneNumber.trim()) && values.phoneNumberConfirmed,
            lockoutEnabled: values.lockoutEnabled,
            lockoutEnd: values.lockoutEnd
              ? new Date(values.lockoutEnd).toISOString()
              : null,
            ...(values.password ? { password: values.password } : {}),
          }),
        "Usuario actualizado correctamente.",
      );
    },
  });

  const closeModal = () => {
    if (busy || registration.loading) return;
    setModal(null);
    setModalError("");
    resetRegistration();
    editFormik.resetForm();
  };

  const openCreate = () => {
    if (busy || loading || modal) return;
    resetRegistration();
    setSelectedRoleId("");
    setModalError("");
    setModal({ kind: "create" });
  };

  const openEdit = (user: User) => {
    if (busy || loading || modal) return;
    editFormik.resetForm({
      values: {
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber ?? "",
        emailConfirmed: user.emailConfirmed,
        phoneNumberConfirmed: user.phoneNumberConfirmed,
        lockoutEnabled: user.lockoutEnabled,
        lockoutEnd: toLocalDateTime(user.lockoutEnd),
        password: "",
      },
    });
    setModalError("");
    setModal({ kind: "edit", user });
  };

  const openRoles = (user: User) => {
    if (busy || loading || modal) return;
    setSelectedRoleId(
      user.roles.length === 1
        ? (roles.find((role) => userHasRole(user, role))?.id ?? "")
        : "",
    );
    setModalError("");
    setModal({ kind: "roles", user });
  };

  const currentRoleUser =
    modal?.kind === "roles"
      ? (users.find((user) => user.id === modal.user.id) ?? modal.user)
      : null;
  const roleUnchanged =
    currentRoleUser?.roles.length === 1 &&
    roles.some(
      (role) =>
        role.id === selectedRoleId && userHasRole(currentRoleUser, role),
    );

  const saveRole = async () => {
    const role = roles.find((item) => item.id === selectedRoleId);
    if (!currentRoleUser || !role || rolesError || roleUnchanged)
      return;
    await mutate(async () => {
      // Assign first so the user always keeps at least one role.
      if (!userHasRole(currentRoleUser, role)) {
        await assignRoleToUser({ userId: currentRoleUser.id, roleId: role.id });
      }
      for (const previousRole of roles.filter(
        (item) => item.id !== role.id && userHasRole(currentRoleUser, item),
      )) {
        await removeRoleFromUser({
          userId: currentRoleUser.id,
          roleId: previousRole.id,
        });
      }
    }, "Rol actualizado correctamente.");
  };

  return {
    users,
    roles,
    loading,
    error,
    rolesError,
    modalError,
    modal,
    selectedRoleId,
    busy,
    notice,
    registration,
    editFormik,
    roleUnchanged,
    currentRoleUser,
    reload,
    closeModal,
    openCreate,
    openEdit,
    openRoles,
    saveRole,
    selectRole: (roleId: string) => {
      if (!busy && !loading) setSelectedRoleId(roleId);
    },
    clearNotice: () => setNotice(null),
  };
};
