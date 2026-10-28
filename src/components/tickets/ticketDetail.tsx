import { HistoryRounded, LaptopOutlined } from "@mui/icons-material";
import { Button } from "@mui/material";
import type { TicketDetails, TicketState } from "../../models/ticketModels";
import { formatTicketDate, stateOrder } from "../../utils/ticketWorkflow";

interface TicketDetailProps {
  ticket: TicketDetails;
  states: TicketState[];
  allowedStates: TicketState[];
  canChangeState: boolean;
  onChangeState: () => void;
}

const TicketDetail = ({
  ticket,
  states,
  allowedStates,
  canChangeState,
  onChangeState,
}: TicketDetailProps) => {
  const state = states.find((item) => item.id === ticket.stateId);
  const history = [...ticket.history].sort(
    (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
  );
  return (
    <div className="ticket-detail">
      <div className="ticket-detail-badges">
        <span
          className={`ticket-state-badge ticket-badge-${stateOrder(state?.name ?? "")}`}
        >
          {state?.name ?? ticket.stateId}
        </span>
        {ticket.deletedAt !== null && (
          <span className="ticket-deleted-badge">Eliminado</span>
        )}
      </div>
      <h3 className="ticket-detail-title">{ticket.title}</h3>
      <p className="ticket-detail-equipment">
        <LaptopOutlined fontSize="small" />
        {ticket.equipment}
      </p>
      <div className="ticket-detail-description">
        <h4>Descripción</h4>
        <p>{ticket.description}</p>
      </div>
      <dl className="ticket-detail-meta">
        <div>
          <dt>Creado</dt>
          <dd>{formatTicketDate(ticket.createdAt)}</dd>
        </div>
        <div>
          <dt>Última actualización</dt>
          <dd>{formatTicketDate(ticket.updatedAt)}</dd>
        </div>
        <div>
          <dt>ID del ticket</dt>
          <dd>{ticket.id}</dd>
        </div>
        <div>
          <dt>Creado por · ID de usuario</dt>
          <dd>{ticket.userId}</dd>
        </div>
        {ticket.deletedAt !== null && (
          <div>
            <dt>Fecha de borrado</dt>
            <dd>{formatTicketDate(ticket.deletedAt)}</dd>
          </div>
        )}
      </dl>
      {canChangeState &&
        ticket.deletedAt === null &&
        allowedStates.length > 0 && (
          <div className="ticket-detail-next">
            <div>
              <strong>Gestionar estado</strong>
              <span>Avanza un paso o vuelve a un estado anterior.</span>
            </div>
            <Button
              className="ticket-primary-button"
              variant="contained"
              onClick={onChangeState}
            >
              Cambiar estado
            </Button>
          </div>
        )}
      <section
        className="ticket-history"
        aria-labelledby="ticket-history-title"
      >
        <div className="ticket-history-heading">
          <HistoryRounded fontSize="small" />
          <h4 id="ticket-history-title">Historial de cambios</h4>
          <span>{history.length}</span>
        </div>
        <p className="ticket-history-caption">
          Del más reciente al más antiguo.
        </p>
        {history.length === 0 ? (
          <p className="ticket-history-empty">
            Este ticket aún no tiene cambios registrados.
          </p>
        ) : (
          <ol>
            {history.map((entry) => (
              <li key={entry.id}>
                <div className="ticket-history-top">
                  <strong>
                    {entry.prevState === entry.newState
                      ? entry.newState
                      : `${entry.prevState} → ${entry.newState}`}
                  </strong>
                  <time dateTime={entry.createdAt}>
                    {formatTicketDate(entry.createdAt)}
                  </time>
                </div>
                <p>{entry.comment || "Sin comentario."}</p>
                <small>Usuario: {entry.userId}</small>
                {entry.updatedAt !== entry.createdAt && (
                  <small>
                    Actualizado: {formatTicketDate(entry.updatedAt)}
                  </small>
                )}
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
};

export default TicketDetail;
