import * as yup from "yup";

export const editUserSchema = yup.object({
  username: yup
    .string()
    .trim()
    .max(256, "Máximo 256 caracteres")
    .required("El nombre de usuario es obligatorio"),
  email: yup
    .string()
    .trim()
    .email("Debes ingresar un correo electrónico válido")
    .max(256, "Máximo 256 caracteres")
    .required("El correo electrónico es obligatorio"),
  phoneNumber: yup.string().trim().max(256, "Máximo 256 caracteres"),
  emailConfirmed: yup.boolean().required(),
  phoneNumberConfirmed: yup.boolean().required(),
  lockoutEnabled: yup.boolean().required(),
  lockoutEnd: yup
    .string()
    .test(
      "valid-date",
      "Ingresa una fecha y hora válidas",
      (value) => !value || !Number.isNaN(new Date(value).getTime()),
    ),
  password: yup
    .string()
    .test(
      "password-length",
      "La contraseña debe tener al menos 8 caracteres",
      (value) => !value || value.length >= 8,
    ),
});
