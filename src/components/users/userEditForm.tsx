import {
  Button,
  CircularProgress,
  FormControlLabel,
  Switch,
  TextField,
} from "@mui/material";
import type { FormikProps } from "formik";
import type { EditUserValues } from "../../models/userBoardModels";
import type { User } from "../../models/userModels";
import { formatTicketDate } from "../../utils/ticketWorkflow";

interface UserEditFormProps {
  formik: FormikProps<EditUserValues>;
  user: User;
  busy: boolean;
  onCancel: () => void;
}

const UserEditForm = ({ formik, user, busy, onCancel }: UserEditFormProps) => {
  const field = (name: keyof EditUserValues) => ({
    ...formik.getFieldProps(name),
    id: `edit-user-${name}`,
    error: Boolean(formik.touched[name] && formik.errors[name]),
    helperText: formik.touched[name] && formik.errors[name],
    disabled: busy,
    fullWidth: true,
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="ticket-form user-edit-form"
      noValidate
      aria-busy={busy}
    >
      <TextField
        {...field("username")}
        autoFocus
        label="Nombre de usuario"
        required
        autoComplete="off"
      />
      <TextField
        {...field("email")}
        label="Correo electrónico"
        type="email"
        required
        autoComplete="off"
      />
      <TextField {...field("phoneNumber")} label="Teléfono" type="tel" />
      <TextField
        {...field("password")}
        label="Nueva contraseña (opcional)"
        type="password"
        autoComplete="new-password"
        helperText={
          (formik.touched.password && formik.errors.password) ||
          "Deja el campo vacío para conservar la contraseña actual."
        }
      />
      <div className="user-edit-switches">
        <FormControlLabel
          label="Correo confirmado"
          control={
            <Switch
              name="emailConfirmed"
              checked={formik.values.emailConfirmed}
              onChange={formik.handleChange}
              disabled={busy}
            />
          }
        />
        <FormControlLabel
          label="Teléfono confirmado"
          control={
            <Switch
              name="phoneNumberConfirmed"
              checked={
                Boolean(formik.values.phoneNumber.trim()) &&
                formik.values.phoneNumberConfirmed
              }
              onChange={formik.handleChange}
              disabled={busy || !formik.values.phoneNumber.trim()}
            />
          }
        />
        <FormControlLabel
          label="Habilitar bloqueo por intentos fallidos"
          control={
            <Switch
              name="lockoutEnabled"
              checked={formik.values.lockoutEnabled}
              onChange={formik.handleChange}
              disabled={busy}
            />
          }
        />
      </div>
      <TextField
        {...field("lockoutEnd")}
        label="Fin del bloqueo"
        type="datetime-local"
        slotProps={{ inputLabel: { shrink: true }, htmlInput: { step: 1 } }}
        helperText={
          (formik.touched.lockoutEnd && formik.errors.lockoutEnd) ||
          "Hora local. Deja el campo vacío para quitar la fecha de bloqueo."
        }
      />
      <dl className="user-readonly-data">
        <div>
          <dt>ID del usuario</dt>
          <dd>{user.id}</dd>
        </div>
        <div>
          <dt>Intentos fallidos</dt>
          <dd>{user.accessFailedCount}</dd>
        </div>
        <div>
          <dt>Fecha de creación</dt>
          <dd>{formatTicketDate(user.createdAt)}</dd>
        </div>
        <div>
          <dt>Última actualización</dt>
          <dd>{formatTicketDate(user.updatedAt)}</dd>
        </div>
      </dl>
      <div className="ticket-dialog-actions">
        <Button
          className="ticket-secondary-button"
          onClick={onCancel}
          disabled={busy}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="contained"
          className="ticket-primary-button"
          disabled={busy}
        >
          {busy ? (
            <>
              <CircularProgress size={18} color="inherit" /> Guardando…
            </>
          ) : (
            "Guardar cambios"
          )}
        </Button>
      </div>
    </form>
  );
};

export default UserEditForm;
