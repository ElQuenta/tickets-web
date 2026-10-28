import {
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import {
  ArrowForwardRounded,
  EmailOutlined,
  LockOutlined,
  VisibilityOffOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import type { FormikProps } from "formik";

interface LoginFormProps {
  formik: FormikProps<{ email: string; password: string }>;
  loading: boolean;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
}

const LoginForm = ({
  formik,
  loading,
  showPassword,
  setShowPassword,
}: LoginFormProps) => {
  return (
    <form
      onSubmit={formik.handleSubmit}
      noValidate
      className="login-form"
      aria-busy={loading}
    >
      <div className="login-field">
        <label htmlFor="input-email-textfield">Correo electrónico</label>
        <TextField
          fullWidth
          disabled={loading}
          id="input-email-textfield"
          name="email"
          type="email"
          placeholder="tu@empresa.com"
          autoComplete="username"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
          helperText={formik.touched.email && formik.errors.email}
          error={formik.touched.email && Boolean(formik.errors.email)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlined fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />
      </div>
      <div className="login-field">
        <label htmlFor="input-password-textfield">Contraseña</label>
        <TextField
          fullWidth
          disabled={loading}
          id="input-password-textfield"
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Ingresa tu contraseña"
          autoComplete="current-password"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
          helperText={formik.touched.password && formik.errors.password}
          error={formik.touched.password && Boolean(formik.errors.password)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlined fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    type="button"
                    disabled={loading}
                    aria-label={
                      showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                    }
                    aria-pressed={showPassword}
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? (
                      <VisibilityOffOutlined fontSize="small" />
                    ) : (
                      <VisibilityOutlined fontSize="small" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      </div>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={loading}
        className="login-submit"
        endIcon={loading ? undefined : <ArrowForwardRounded />}
      >
        {loading ? (
          <>
            <CircularProgress size={18} color="inherit" /> Ingresando…
          </>
        ) : (
          "Iniciar sesión"
        )}
      </Button>
    </form>
  );
};

export default LoginForm;
