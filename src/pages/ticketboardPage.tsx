import {
  AddRounded,
  DashboardOutlined,
  PeopleOutlineRounded,
  RefreshRounded,
  SwapHorizRounded,
} from "@mui/icons-material";
import {
  Alert,
  Button,
  CircularProgress,
  Skeleton,
  Snackbar,
} from "@mui/material";
import { Link } from "react-router-dom";
import TicketBoard from "../components/tickets/ticketBoard";
import DeletedTicketList from "../components/tickets/deletedTicketList";
import TicketDialogs from "../components/tickets/ticketDialogs";
import { useTicketBoard } from "../hooks/useTicketBoard";
import "./ticketboardPage.css";

const TicketBoardPage = () => {
  const {
    isAdmin,
    canChangeState,
    columns,
    states,
    deletedTickets,
    loading,
    boardError,
    deletedError,
    modal,
    details,
    detailsLoading,
    modalError,
    busy,
    notice,
    ticketFormik,
    commentFormik,
    reload,
    closeModal,
    openCreate,
    openEdit,
    openDelete,
    openStateChange,
    selectTargetState,
    openDetails,
    onDragEnd,
    clearNotice,
  } = useTicketBoard();
  const total = columns.reduce(
    (count, column) => count + column.tickets.length,
    0,
  );

  return (
    <div className="tickets-page">
      <div className="tickets-main">
        <div className="tickets-page-heading">
          <div>
            <span className="tickets-eyebrow">
              <span /> TU ESPACIO DE TRABAJO
            </span>
            <h1>Tablero de tickets</h1>
            <p>Organiza, avanza y resuelve. Todo en un mismo lugar.</p>
          </div>
          <div className="tickets-page-actions">
            {isAdmin && (
              <Button
                component={Link}
                to="/dashboard"
                variant="outlined"
                className="ticket-secondary-button"
                startIcon={<PeopleOutlineRounded />}
              >
                Usuarios
              </Button>
            )}
            <Button
              onClick={openCreate}
              variant="contained"
              className="ticket-primary-button"
              startIcon={<AddRounded />}
              disabled={busy}
            >
              Crear ticket
            </Button>
          </div>
        </div>
        <section
          className="tickets-board-section"
          aria-labelledby="tickets-board-title"
          aria-busy={loading}
        >
          <div className="tickets-board-toolbar">
            <div className="tickets-board-view">
              <DashboardOutlined fontSize="small" />
              <h2 id="tickets-board-title">Vista general</h2>
              <span>
                {total} {total === 1 ? "ticket" : "tickets"}
              </span>
            </div>
            <div className="tickets-board-tools">
              {canChangeState && (
                <span className="tickets-drag-hint">
                  <SwapHorizRounded fontSize="small" />
                  Arrastra un ticket para cambiar su estado
                </span>
              )}
              <Button
                className="ticket-refresh-button"
                aria-label="Actualizar tablero"
                onClick={() => void reload()}
                disabled={loading || busy || modal !== null}
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
          {boardError && (
            <Alert
              severity="error"
              className="tickets-board-alert"
              action={
                <Button
                  color="inherit"
                  onClick={() => void reload()}
                  disabled={loading}
                >
                  Reintentar
                </Button>
              }
            >
              {boardError}
            </Alert>
          )}
          {loading && columns.length === 0 ? (
            <div
              className="ticket-board ticket-board-skeleton"
              role="status"
              aria-label="Cargando tablero"
            >
              {[0, 1, 2].map((column) => (
                <div key={column} className="ticket-column">
                  <Skeleton width="55%" height={30} />
                  {[0, 1].map((card) => (
                    <Skeleton key={card} variant="rounded" height={100} />
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <TicketBoard
              columns={columns}
              isAdmin={isAdmin}
              canDrag={canChangeState && !busy && !loading && !boardError}
              onDragEnd={onDragEnd}
              onOpen={openDetails}
              onEdit={openEdit}
              onDelete={openDelete}
            />
          )}
          {!loading && !boardError && columns.length === 0 && (
            <Alert severity="info">
              No hay estados configurados para mostrar el tablero.
            </Alert>
          )}
          <p className="tickets-board-footnote">
            Abre un ticket para ver todos sus detalles y su historial.
            {canChangeState &&
              " Los cambios de estado requieren un comentario."}
          </p>
        </section>
        {isAdmin && (
          <DeletedTicketList
            tickets={deletedTickets}
            error={deletedError}
            loading={loading}
            onOpen={openDetails}
            onRetry={() => void reload()}
          />
        )}
        <footer className="tickets-page-footer">
          <span className="tickets-footer-dot" />
          Un espacio para que todo siga funcionando.
        </footer>
      </div>
      <TicketDialogs
        modal={modal}
        details={details}
        detailsLoading={detailsLoading}
        states={states}
        canChangeState={canChangeState && !loading && !boardError}
        error={modalError}
        busy={busy}
        ticketFormik={ticketFormik}
        commentFormik={commentFormik}
        onClose={closeModal}
        onChangeState={openStateChange}
        onSelectState={selectTargetState}
        onRetryDetails={openDetails}
      />
      <Snackbar
        open={notice !== null}
        autoHideDuration={6000}
        onClose={clearNotice}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={notice?.severity ?? "success"}
          onClose={clearNotice}
          variant="filled"
        >
          {notice?.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default TicketBoardPage;
