import { Button, CircularProgress, MenuItem, TextField } from "@mui/material";
import type { FormikProps } from "formik";
import type { TicketState } from "../../models/ticketModels";

interface TicketCommentFormProps {
  formik: FormikProps<{ comment: string }>;
  deleting: boolean;
  busy: boolean;
  onCancel: () => void;
  transition?: {
    states: TicketState[];
    targetStateId: string;
    onSelectState: (stateId: string) => void;
  };
}

const TicketCommentForm = ({
  formik,
  deleting,
  busy,
  onCancel,
  transition,
}: TicketCommentFormProps) => (
  <form onSubmit={formik.handleSubmit} className="ticket-form" noValidate>
    {transition && (
      <TextField
        select
        required
        fullWidth
        id="ticket-target-state"
        label="Nuevo estado"
        value={transition.targetStateId}
        onChange={(event) => transition.onSelectState(event.target.value)}
        disabled={busy}
        helperText="Puedes avanzar un paso o retroceder a cualquier estado anterior."
      >
        {transition.states.map((state) => (
          <MenuItem key={state.id} value={state.id}>
            {state.name}
          </MenuItem>
        ))}
      </TextField>
    )}
    <TextField
      autoFocus
      required
      fullWidth
      multiline
      minRows={3}
      id="ticket-comment"
      name="comment"
      label={deleting ? "Razón de borrado" : "Comentario del cambio"}
      placeholder={
        deleting
          ? "Explica por qué se elimina este ticket."
          : "Explica el motivo del cambio de estado."
      }
      value={formik.values.comment}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      error={formik.touched.comment && Boolean(formik.errors.comment)}
      helperText={
        (formik.touched.comment && formik.errors.comment) ||
        "Este comentario quedará registrado en el historial."
      }
      disabled={busy}
    />
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
        className={deleting ? "ticket-danger-button" : "ticket-primary-button"}
        disabled={busy}
        endIcon={
          busy ? <CircularProgress size={16} color="inherit" /> : undefined
        }
      >
        {busy
          ? "Guardando…"
          : deleting
            ? "Eliminar ticket"
            : "Confirmar cambio"}
      </Button>
    </div>
  </form>
);

export default TicketCommentForm;
