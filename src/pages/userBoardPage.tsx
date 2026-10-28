import { AddRounded, ArrowBackRounded } from "@mui/icons-material";
import { Alert, Button, Snackbar } from "@mui/material";
import { Link } from "react-router-dom";
import UserDialogs from "../components/users/userDialogs";
import UserList from "../components/users/userList";
import { useUserBoard } from "../hooks/useUserBoard";
import "./ticketboardPage.css";
import "./userBoardPage.css";

const UserBoardPage = () => {
  const board = useUserBoard();
  return (
    <div className="tickets-page users-page">
      <div className="tickets-main">
        <div className="tickets-page-heading">
          <div>
            <span className="tickets-eyebrow">
              <span /> ADMINISTRACIÓN
            </span>
            <h1>Usuarios</h1>
            <p>Gestiona las personas y sus roles en un mismo lugar.</p>
          </div>
          <div className="tickets-page-actions">
            <Button
              component={Link}
              to="/tickets"
              variant="outlined"
              className="ticket-secondary-button"
              startIcon={<ArrowBackRounded />}
              disabled={board.busy || board.registration.loading}
            >
              Tickets
            </Button>
            <Button
              onClick={board.openCreate}
              variant="contained"
              className="ticket-primary-button"
              startIcon={<AddRounded />}
              disabled={board.busy || board.loading || board.modal !== null}
            >
              Crear usuario
            </Button>
          </div>
        </div>
        <UserList
          users={board.users}
          loading={board.loading}
          busy={board.busy || board.modal !== null}
          error={board.error}
          onRetry={() => void board.reload()}
          onEdit={board.openEdit}
          onRoles={board.openRoles}
        />
        <footer className="tickets-page-footer">
          <span className="tickets-footer-dot" />
          Un espacio para que todo siga funcionando.
        </footer>
      </div>
      <UserDialogs {...board} />
      <Snackbar
        open={Boolean(board.notice)}
        autoHideDuration={6000}
        onClose={board.clearNotice}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={board.notice?.severity ?? "success"}
          variant="filled"
          onClose={board.clearNotice}
        >
          {board.notice?.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default UserBoardPage;
