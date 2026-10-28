import { useState } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";

import { loginSchema } from "../schemas/authSchema";
import { useAuthStore } from "../store/authstore";
import { login as loginService } from "../services/authService";
import type { User } from "../store/models/user";


export const useLogin = () => {
    const login = useAuthStore((state) => state.login);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async (values: { email: string; password: string }) => {
        setLoading(true);
        try {
            const response = await loginService(values);
            const user: User = {
                ...response,
                sessionStart: new Date(),
            }
            login(user);
            navigate("/tickets");
        } catch (error) {
            console.error("Error logging in:", error);
            formik.resetForm();
        } finally {
            setLoading(false);
            
        }
    };

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: loginSchema,
        onSubmit,
    });

    return {
        formik,
        loading,
        showPassword,
        setShowPassword,
    };
};