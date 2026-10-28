import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import {
  CheckRounded,
  MoreHorizRounded,
  ScheduleRounded,
} from "@mui/icons-material";
import type { Ticket, TicketByState } from "../../models/ticketModels";
import { stateOrder } from "../../utils/ticketWorkflow";
import TicketCard from "./ticketCard";

interface TicketBoardProps {
  columns: TicketByState[];
  isAdmin: boolean;
  canDrag: boolean;
  onDragEnd: (result: DropResult) => void;
  onOpen: (id: string) => void;
  onEdit: (ticket: Ticket) => void;
  onDelete: (ticket: Ticket) => void;
}

const TicketBoard = ({
  columns,
  isAdmin,
  canDrag,
  onDragEnd,
  onOpen,
  onEdit,
  onDelete,
}: TicketBoardProps) => (
  <DragDropContext
    onDragEnd={onDragEnd}
    dragHandleUsageInstructions="Presiona espacio para tomar el ticket, usa las flechas para moverlo y espacio para soltarlo. Presiona Enter para ver sus detalles."
  >
    <div className="ticket-board" aria-label="Tablero de tickets por estado">
      {columns.map((column) => {
        const order = stateOrder(column.name);
        return (
          <section
            key={column.id}
            className={`ticket-column ticket-column-${order}`}
            aria-label={column.name}
          >
            <header className="ticket-column-heading">
              <span className="ticket-state-icon">
                {order === 0 ? (
                  <ScheduleRounded />
                ) : order === 2 ? (
                  <CheckRounded />
                ) : (
                  <MoreHorizRounded />
                )}
              </span>
              <h2>{column.name}</h2>
              <span className="ticket-column-count">
                {column.tickets.length}
              </span>
            </header>
            <Droppable droppableId={column.id} isDropDisabled={!canDrag}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`ticket-column-body${snapshot.isDraggingOver ? " ticket-column-over" : ""}`}
                >
                  {column.tickets.map((ticket, index) => (
                    <Draggable
                      key={ticket.id}
                      draggableId={ticket.id}
                      index={index}
                      isDragDisabled={!canDrag}
                    >
                      {(dragProvided, dragSnapshot) => (
                        <TicketCard
                          ticket={ticket}
                          isAdmin={isAdmin}
                          canDrag={canDrag}
                          provided={dragProvided}
                          snapshot={dragSnapshot}
                          onOpen={onOpen}
                          onEdit={onEdit}
                          onDelete={onDelete}
                        />
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  {column.tickets.length === 0 && (
                    <div className="ticket-column-empty">
                      <span>Todo despejado por aquí</span>
                      <small>Los tickets en este estado aparecerán aquí.</small>
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          </section>
        );
      })}
    </div>
  </DragDropContext>
);

export default TicketBoard;
