import * as yup from "yup";

export const loginSchema = yup.object({
  email: yup
    .string()
    .email("Debes ingresar un correo electrónico válido")
    .required("El correo electrónico es obligatorio"),
  password: yup
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .required(),
});

export const registerSchema = yup.object({
  username: yup
    .string()
    .min(6, "El nombre de usuario debe tener al menos 6 caracteres")
    .required("El nombre de usuario es obligatorio"),
  email: yup
    .string()
    .email("Debes ingresar un correo electrónico válido")
    .required("El correo electrónico es obligatorio"),
  password: yup
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .required("La contraseña es obligatoria"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), ""], "Las contraseñas deben coincidir")
    .required("Debes confirmar tu contraseña"),
});