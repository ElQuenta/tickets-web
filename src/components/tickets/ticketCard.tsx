import {
  DeleteOutlineRounded,
  EditOutlined,
  LaptopOutlined,
} from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import type {
  DraggableProvided,
  DraggableStateSnapshot,
} from "@hello-pangea/dnd";
import type { Ticket } from "../../models/ticketModels";

interface TicketCardProps {
  ticket: Ticket;
  isAdmin: boolean;
  canDrag: boolean;
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
  onOpen: (id: string) => void;
  onEdit: (ticket: Ticket) => void;
  onDelete: (ticket: Ticket) => void;
}

const TicketCard = ({
  ticket,
  isAdmin,
  canDrag,
  provided: { innerRef, draggableProps, dragHandleProps },
  snapshot,
  onOpen,
  onEdit,
  onDelete,
}: TicketCardProps) => (
  <article
    ref={innerRef}
    {...draggableProps}
    {...dragHandleProps}
    className={`ticket-card${snapshot.isDragging ? " ticket-card-dragging" : ""}`}
    role="button"
    tabIndex={0}
    aria-label={`Ver detalles de ${ticket.title}`}
    onClick={() => onOpen(ticket.id)}
    onKeyDown={(event) => {
      if (event.defaultPrevented || event.target !== event.currentTarget) return;
      if (event.key === "Enter" || (!canDrag && event.key === " ")) {
        event.preventDefault();
        onOpen(ticket.id);
      }
    }}
  >
    <div className="ticket-card-top">
      <h3>{ticket.title}</h3>
      {isAdmin && (
        <div className="ticket-card-actions">
          <Tooltip title="Editar ticket">
            <IconButton
              size="small"
              aria-label={`Editar ${ticket.title}`}
              onClick={(event) => {
                event.stopPropagation();
                onEdit(ticket);
              }}
            >
              <EditOutlined fontSize="inherit" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar ticket">
            <IconButton
              size="small"
              className="ticket-delete-action"
              aria-label={`Eliminar ${ticket.title}`}
              onClick={(event) => {
                event.stopPropagation();
                onDelete(ticket);
              }}
            >
              <DeleteOutlineRounded fontSize="inherit" />
            </IconButton>
          </Tooltip>
        </div>
      )}
    </div>
    <p className="ticket-equipment">
      <LaptopOutlined fontSize="inherit" />
      <span>{ticket.equipment}</span>
    </p>
  </article>
);

export default TicketCard;
