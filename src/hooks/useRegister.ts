import { useState } from "react";
import { useFormik } from "formik";

import { registerSchema } from "../schemas/authSchema";
import { register as registerService } from "../services/authService";

export const useRegister = () => {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const onSubmit = async (values: { username: string; email: string; password: string}) => {
        setLoading(true);
        try {
            await registerService(values);
            formik.resetForm();
        } catch (error) {
            console.error("Error creating account:", error);
        } finally {
            setLoading(false);
            
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
