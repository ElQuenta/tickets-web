import {
  Alert,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import type { Role } from "../../models/roleModels";

interface UserRoleFormProps {
  roles: Role[];
  selectedRoleId: string;
  currentRoles: string[];
  loading: boolean;
  busy: boolean;
  error: string;
  unchanged: boolean;
  onSelect: (id: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onRetry: () => void;
}

const UserRoleForm = ({
  roles,
  selectedRoleId,
  currentRoles,
  loading,
  busy,
  error,
  unchanged,
  onSelect,
  onSave,
  onCancel,
  onRetry,
}: UserRoleFormProps) => (
  <form
    className="ticket-form"
    onSubmit={(event) => {
      event.preventDefault();
      onSave();
    }}
    aria-busy={busy || loading}
  >
    {currentRoles.length > 0 && (
      <p className="user-current-roles">
        Roles actuales: <strong>{currentRoles.join(", ")}</strong>
      </p>
    )}
    {error ? (
      <Alert
        severity="error"
        action={
          <Button color="inherit" onClick={onRetry} disabled={busy || loading}>
            Reintentar
          </Button>
        }
      >
        {error}
      </Alert>
    ) : loading ? (
      <div className="user-roles-loading" role="status">
        <CircularProgress size={22} />
        <span>Cargando roles…</span>
      </div>
    ) : roles.length === 0 ? (
      <Alert
        severity="warning"
        action={
          <Button color="inherit" onClick={onRetry} disabled={busy}>
            Actualizar
          </Button>
        }
      >
        No hay roles disponibles. Configura al menos uno para continuar.
      </Alert>
    ) : (
      <FormControl disabled={busy}>
        <FormLabel id="user-role-label">Selecciona un rol</FormLabel>
        <RadioGroup
          aria-labelledby="user-role-label"
          name="user-role"
          value={selectedRoleId}
          onChange={(_, value) => onSelect(value)}
          className="user-role-options"
        >
          {roles.map((role) => (
            <FormControlLabel
              key={role.id}
              value={role.id}
              className={`user-role-card ${selectedRoleId === role.id ? "user-role-card-selected" : ""}`}
              control={<Radio required />}
              label={role.name}
            />
          ))}
        </RadioGroup>
      </FormControl>
    )}
    <p className="user-role-help">
      Cada usuario debe tener al menos un rol. Al guardar, el rol seleccionado
      reemplazará los anteriores.
    </p>
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
        className="ticket-primary-button"
        variant="contained"
        disabled={
          busy ||
          loading ||
          Boolean(error) ||
          !selectedRoleId ||
          !roles.some((role) => role.id === selectedRoleId) ||
          unchanged
        }
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

export default UserRoleForm;
