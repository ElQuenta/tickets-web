import {
  EditOutlined,
  ManageAccountsOutlined,
  PeopleOutlineRounded,
  RefreshRounded,
} from "@mui/icons-material";
import { Alert, Button, CircularProgress } from "@mui/material";
import type { User } from "../../models/userModels";
import { formatTicketDate } from "../../utils/ticketWorkflow";

interface UserListProps {
  users: User[];
  loading: boolean;
  busy: boolean;
  error: string;
  onRetry: () => void;
  onEdit: (user: User) => void;
  onRoles: (user: User) => void;
}

const UserList = ({
  users,
  loading,
  busy,
  error,
  onRetry,
  onEdit,
  onRoles,
}: UserListProps) => (
  <section
    className="deleted-tickets users-list"
    aria-labelledby="users-list-title"
    aria-busy={loading}
  >
    <div className="deleted-tickets-heading">
      <div className="deleted-tickets-title">
        <span className="deleted-tickets-icon">
          <PeopleOutlineRounded />
        </span>
        <div>
          <h2 id="users-list-title">
            Usuarios registrados <span>{users.length}</span>
          </h2>
          <p>Administra los datos y el acceso de cada persona.</p>
        </div>
      </div>
      <div className="users-list-tools">
        <span className="ticket-admin-label">Solo administradores</span>
        <Button
          className="ticket-refresh-button"
          onClick={onRetry}
          disabled={loading || busy}
          startIcon={
            loading ? (
              <CircularProgress size={14} color="inherit" />
            ) : (
              <RefreshRounded fontSize="small" />
            )
          }
        >
          Actualizar
        </Button>
      </div>
    </div>
    {error && (
      <Alert
        severity="error"
        action={
          <Button color="inherit" onClick={onRetry} disabled={loading || busy}>
            Reintentar
          </Button>
        }
      >
        {error}
      </Alert>
    )}
    {users.length === 0 ? (
      <p className="deleted-tickets-empty" role="status">
        {loading
          ? "Cargando usuarios…"
          : error
            ? "La lista de usuarios no está disponible."
            : "Todavía no hay usuarios registrados."}
      </p>
    ) : (
      <div
        className="deleted-tickets-scroll"
        role="region"
        aria-label="Tabla de usuarios"
        tabIndex={0}
      >
        <table>
          <thead>
            <tr>
              <th scope="col">Usuario</th>
              <th scope="col">Contacto</th>
              <th scope="col">Roles</th>
              <th scope="col">Seguridad</th>
              <th scope="col">Actividad</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <strong className="user-name">{user.username}</strong>
                  <span className="user-secondary">{user.email}</span>
                  <span
                    className={`user-badge ${user.emailConfirmed ? "user-badge-success" : ""}`}
                  >
                    {user.emailConfirmed
                      ? "Correo confirmado"
                      : "Correo sin confirmar"}
                  </span>
                </td>
                <td>
                  <span>{user.phoneNumber || "Sin teléfono"}</span>
                  {user.phoneNumber && (
                    <span className="user-secondary">
                      {user.phoneNumberConfirmed
                        ? "Teléfono confirmado"
                        : "Teléfono sin confirmar"}
                    </span>
                  )}
                </td>
                <td>
                  <div className="user-role-badges">
                    {user.roles.length ? (
                      user.roles.map((role) => (
                        <span className="user-badge" key={role}>
                          {role}
                        </span>
                      ))
                    ) : (
                      <span className="user-badge user-badge-warning">
                        Sin rol asignado
                      </span>
                    )}
                  </div>
                </td>
                <td>
                  <span className="user-secondary">
                    Bloqueo{" "}
                    {user.lockoutEnabled ? "habilitado" : "deshabilitado"}
                  </span>
                  <span className="user-secondary">
                    Fin del bloqueo:{" "}
                    <time dateTime={user.lockoutEnd ?? undefined}>
                      {formatTicketDate(user.lockoutEnd)}
                    </time>
                  </span>
                  <span className="user-secondary">
                    Intentos fallidos: {user.accessFailedCount}
                  </span>
                </td>
                <td>
                  <span className="user-secondary">
                    Creado:{" "}
                    <time dateTime={user.createdAt}>
                      {formatTicketDate(user.createdAt)}
                    </time>
                  </span>
                  <span className="user-secondary">
                    Actualizado:{" "}
                    <time dateTime={user.updatedAt}>
                      {formatTicketDate(user.updatedAt)}
                    </time>
                  </span>
                </td>
                <td>
                  <div className="user-row-actions">
                    <Button
                      size="small"
                      className="ticket-secondary-button"
                      startIcon={<EditOutlined fontSize="small" />}
                      disabled={busy || loading || Boolean(error)}
                      onClick={() => onEdit(user)}
                      aria-label={`Editar usuario ${user.username}`}
                    >
                      Editar
                    </Button>
                    <Button
                      size="small"
                      className="ticket-secondary-button"
                      startIcon={<ManageAccountsOutlined fontSize="small" />}
                      disabled={busy || loading || Boolean(error)}
                      onClick={() => onRoles(user)}
                      aria-label={`Editar roles de ${user.username}`}
                    >
                      Roles
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </section>
);

export default UserList;
