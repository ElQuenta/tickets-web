import { ArrowOutwardRounded, DeleteOutlineRounded } from "@mui/icons-material";
import { Alert, Button } from "@mui/material";
import type { Ticket } from "../../models/ticketModels";
import { formatTicketDate } from "../../utils/ticketWorkflow";

interface DeletedTicketListProps {
  tickets: Ticket[];
  error: string;
  loading: boolean;
  onOpen: (id: string) => void;
  onRetry: () => void;
}

const DeletedTicketList = ({
  tickets,
  error,
  loading,
  onOpen,
  onRetry,
}: DeletedTicketListProps) => (
  <section
    className="deleted-tickets"
    aria-labelledby="deleted-tickets-title"
    aria-busy={loading}
  >
    <div className="deleted-tickets-heading">
      <div className="deleted-tickets-title">
        <span className="deleted-tickets-icon">
          <DeleteOutlineRounded />
        </span>
        <div>
          <h2 id="deleted-tickets-title">
            Tickets eliminados <span>{tickets.length}</span>
          </h2>
          <p>Consulta sus detalles y conserva el contexto de cada cambio.</p>
        </div>
      </div>
      <span className="ticket-admin-label">Solo administradores</span>
    </div>
    {error ? (
      <Alert
        severity="error"
        action={
          <Button color="inherit" onClick={onRetry} disabled={loading}>
            Reintentar
          </Button>
        }
      >
        {error}
      </Alert>
    ) : tickets.length === 0 ? (
      <p className="deleted-tickets-empty">
        {loading
          ? "Cargando tickets eliminados…"
          : "No hay tickets eliminados."}
      </p>
    ) : (
      <div className="deleted-tickets-scroll">
        <table>
          <thead>
            <tr>
              <th scope="col">Título</th>
              <th scope="col">Equipo</th>
              <th scope="col">Fecha de borrado</th>
              <th scope="col">
                <span className="ticket-sr-only">Detalles</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id} onClick={() => onOpen(ticket.id)}>
                <td>
                  <button
                    type="button"
                    className="deleted-ticket-link"
                    onClick={(event) => {
                      event.stopPropagation();
                      onOpen(ticket.id);
                    }}
                  >
                    {ticket.title}
                  </button>
                </td>
                <td>{ticket.equipment}</td>
                <td>
                  <time dateTime={ticket.deletedAt ?? undefined}>
                    {formatTicketDate(ticket.deletedAt)}
                  </time>
                </td>
                <td aria-hidden="true">
                  <ArrowOutwardRounded fontSize="small" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </section>
);

export default DeletedTicketList;
