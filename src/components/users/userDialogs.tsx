import { CloseRounded } from "@mui/icons-material";
import {
  Alert,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import type { useUserBoard } from "../../hooks/useUserBoard";
import RegisterForm from "../auth/registerForm";
import UserEditForm from "./userEditForm";
import UserRoleForm from "./userRoleForm";

type UserDialogsProps = Pick<
  ReturnType<typeof useUserBoard>,
  | "modal"
  | "modalError"
  | "busy"
  | "registration"
  | "editFormik"
  | "roles"
  | "loading"
  | "rolesError"
  | "selectedRoleId"
  | "roleUnchanged"
  | "currentRoleUser"
  | "closeModal"
  | "selectRole"
  | "saveRole"
  | "reload"
>;

const UserDialogs = ({
  modal,
  modalError,
  busy,
  registration,
  editFormik,
  roles,
  loading,
  rolesError,
  selectedRoleId,
  roleUnchanged,
  currentRoleUser,
  closeModal,
  selectRole,
  saveRole,
  reload,
}: UserDialogsProps) => {
  const creating = modal?.kind === "create";
  const title = creating
    ? "Crear usuario"
    : modal?.kind === "edit"
      ? "Editar usuario"
      : "Editar roles";
  return (
    <Dialog
      open={modal !== null}
      onClose={closeModal}
      fullWidth
      maxWidth="sm"
      className="ticket-dialog user-dialog"
      aria-labelledby="user-dialog-title"
    >
      <DialogTitle id="user-dialog-title" className="ticket-dialog-title">
        <span>{title}</span>
        <IconButton
          aria-label="Cerrar modal"
          onClick={closeModal}
          disabled={busy || registration.loading}
        >
          <CloseRounded fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {modalError && (
          <Alert severity="error" className="ticket-modal-error">
            {modalError}
          </Alert>
        )}
        {creating && (
          <>
            <p className="ticket-dialog-description">
              Completa los datos para crear un usuario.
            </p>
            <RegisterForm
              formik={registration.formik}
              loading={busy || registration.loading}
              showPassword={registration.showPassword}
              setShowPassword={registration.setShowPassword}
              showConfirmPassword={registration.showConfirmPassword}
              setShowConfirmPassword={registration.setShowConfirmPassword}
              submitLabel="Crear usuario"
            />
          </>
        )}
        {modal?.kind === "edit" && (
          <>
            <p className="ticket-dialog-description">
              Actualiza la información de <strong>{modal.user.username}</strong>
              .
            </p>
            <UserEditForm
              formik={editFormik}
              user={modal.user}
              busy={busy}
              onCancel={closeModal}
            />
          </>
        )}
        {modal?.kind === "roles" && (
          <>
            <p className="ticket-dialog-description">
              Selecciona el rol de <strong>{currentRoleUser?.username}</strong>.
            </p>
            <UserRoleForm
              roles={roles}
              selectedRoleId={selectedRoleId}
              currentRoles={currentRoleUser?.roles ?? []}
              loading={loading}
              busy={busy || registration.loading}
              error={rolesError}
              unchanged={Boolean(roleUnchanged)}
              onSelect={selectRole}
              onSave={() => void saveRole()}
              onCancel={closeModal}
              onRetry={() => void reload()}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserDialogs;
