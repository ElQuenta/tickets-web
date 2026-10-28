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
  PersonOutlineRounded,
  VisibilityOffOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import type { FormikProps } from "formik";

interface RegisterFormProps {
  formik: FormikProps<{
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }>;
  loading: boolean;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (show: boolean) => void;
  submitLabel?: string;
}

const RegisterForm = ({
  formik,
  loading,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  submitLabel = "Crear cuenta",
}: RegisterFormProps) => {
  return (
    <form
      onSubmit={formik.handleSubmit}
      noValidate
      className="login-form"
      aria-busy={loading}
    >
      <div className="login-field">
        <label htmlFor="register-username">Nombre de usuario</label>
        <TextField
          fullWidth
          disabled={loading}
          id="register-username"
          name="username"
          type="text"
          placeholder="Nombre del usuario"
          autoComplete="username"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.username}
          helperText={formik.touched.username && formik.errors.username}
          error={formik.touched.username && Boolean(formik.errors.username)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutlineRounded fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />
      </div>
      <div className="login-field">
        <label htmlFor="register-email">Correo electrónico</label>
        <TextField
          fullWidth
          disabled={loading}
          id="register-email"
          name="email"
          type="email"
          placeholder="tu@empresa.com"
          autoComplete="email"
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
        <label htmlFor="register-password">Contraseña</label>
        <TextField
          fullWidth
          disabled={loading}
          id="register-password"
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Crea una contraseña"
          autoComplete="new-password"
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
      <div className="login-field">
        <label htmlFor="register-confirm-password">Confirmar contraseña</label>
        <TextField
          fullWidth
          disabled={loading}
          id="register-confirm-password"
          name="confirmPassword"
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Repite la contraseña"
          autoComplete="new-password"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.confirmPassword}
          helperText={
            formik.touched.confirmPassword && formik.errors.confirmPassword
          }
          error={
            formik.touched.confirmPassword &&
            Boolean(formik.errors.confirmPassword)
          }
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
                      showConfirmPassword
                        ? "Ocultar confirmación de contraseña"
                        : "Mostrar confirmación de contraseña"
                    }
                    aria-pressed={showConfirmPassword}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? (
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
            <CircularProgress size={18} color="inherit" /> Creando cuenta…
          </>
        ) : (
          submitLabel
        )}
      </Button>
    </form>
  );
};

export default RegisterForm;
