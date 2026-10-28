import * as yup from "yup";

export const ticketSchema = yup.object({
  title: yup.string().trim().required("Ingresa el título del ticket."),
  equipment: yup.string().trim().required("Indica el equipo relacionado."),
  description: yup.string().trim().required("Describe el problema."),
});

export const ticketCommentSchema = yup.object({
  comment: yup
    .string()
    .trim()
    .required("Escribe un comentario para continuar."),
});
