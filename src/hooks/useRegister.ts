import { useState } from "react";
import { useFormik } from "formik";

import { registerSchema } from "../schemas/authSchema";
import { register as registerService } from "../services/authService";
import type { RegisterRequest } from "../models/authModels";

export const useRegister = (onComplete: (error?: unknown) => void) => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = async ({ username, email, password }: RegisterRequest) => {
    if (loading) return;
    setLoading(true);
    let registrationError: unknown;
    try {
      await registerService({
        username: username.trim(),
        email: email.trim(),
        password,
      });
    } catch (error) {
      registrationError = error;
    } finally {
      formik.resetForm();
      setShowPassword(false);
      setShowConfirmPassword(false);
      setLoading(false);
      onComplete(registrationError);
    }
  };

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: registerSchema,
    onSubmit,
  });

  return {
    formik,
    loading,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
  };
};
