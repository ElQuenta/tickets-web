import { ArrowForwardRounded } from "@mui/icons-material";
import { Button, CircularProgress, TextField } from "@mui/material";
import type { FormikProps } from "formik";
import type { CreateTicketRequest } from "../../models/ticketModels";

interface TicketFormProps {
  formik: FormikProps<CreateTicketRequest>;
  editing: boolean;
  busy: boolean;
  onCancel: () => void;
}

const TicketForm = ({ formik, editing, busy, onCancel }: TicketFormProps) => (
  <form onSubmit={formik.handleSubmit} className="ticket-form" noValidate>
    <TextField
      autoFocus
      fullWidth
      required
      id="ticket-title"
      label="Título"
      name="title"
      placeholder="¿Qué necesita atención?"
      value={formik.values.title}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      error={formik.touched.title && Boolean(formik.errors.title)}
      helperText={formik.touched.title && formik.errors.title}
      disabled={busy}
    />
    <TextField
      fullWidth
      required
      id="ticket-equipment"
      label="Equipo"
      name="equipment"
      placeholder="Nombre o identificador del equipo"
      value={formik.values.equipment}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      error={formik.touched.equipment && Boolean(formik.errors.equipment)}
      helperText={formik.touched.equipment && formik.errors.equipment}
      disabled={busy}
    />
    <TextField
      fullWidth
      required
      multiline
      minRows={4}
      id="ticket-description"
      label="Descripción"
      name="description"
      placeholder="Cuéntanos qué ocurre y los detalles que pueden ayudar."
      value={formik.values.description}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      error={formik.touched.description && Boolean(formik.errors.description)}
      helperText={formik.touched.description && formik.errors.description}
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
        className="ticket-primary-button"
        type="submit"
        variant="contained"
        disabled={busy}
        endIcon={
          busy ? (
            <CircularProgress size={16} color="inherit" />
          ) : (
            <ArrowForwardRounded />
          )
        }
      >
        {busy ? "Guardando…" : editing ? "Guardar cambios" : "Crear ticket"}
      </Button>
    </div>
  </form>
);

export default TicketForm;
