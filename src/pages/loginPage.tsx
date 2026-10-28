import { CheckRounded } from "@mui/icons-material";
import Header from "../components/common/header";
import LoginForm from "../components/auth/loginForm";
import "./loginPage.css";
import { useLogin } from "../hooks/useLogin";

const LoginPage = () => {
  const { formik, loading, showPassword, setShowPassword } = useLogin();

  return (
    <div className="login-page">
      <Header brandTo="/login" />
      <main className="login-main">
        <section className="login-card" aria-labelledby="login-title">
          <div className="login-card-heading">
            <span className="login-card-label">
              <span /> TU ESPACIO DE TRABAJO
            </span>
            <h1 id="login-title">Iniciar sesión</h1>
            <p>Bienvenido de nuevo. Ingresa a tu cuenta.</p>
          </div>
          <LoginForm
            formik={formik}
            loading={loading}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />
          <div className="login-mini-card" aria-hidden="true">
            <span className="login-mini-card-icon">
              <CheckRounded fontSize="small" />
            </span>
            <div>
              <strong>¡Ticket resuelto!</strong>
              <small>Así se siente avanzar.</small>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LoginPage;
