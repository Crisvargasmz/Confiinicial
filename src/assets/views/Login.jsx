import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import LoginForm from "../components/LoginForm";
import { appfirebase } from "../database/firebaseconfig";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useAuth } from "../database/authcontext";
import "../../App.css";
import { useTranslation } from 'react-i18next';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = (e) => {
    e.preventDefault();
    const auth = getAuth(appfirebase);

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("Usuario autenticado:", userCredential.user);
        // Guardar las credenciales en localStorage
         localStorage.setItem("adminEmail", email);
        localStorage.setItem("adminPassword", password);
        // Redirigir después de iniciar sesión
        navigate("/inicio");
      })
      .catch((error) => {
        setError(t("login.errorAutenticacion"));
        console.error(error);
      });                     
  };

  // Si el usuario ya está autenticado, redirigir automáticamente
  if (user) {
    navigate("/inicio");
  }

  return (
    <Container className="d-flex vh-100 justify-content-center align-items-center">
      <LoginForm
        email={email}
        password={password}
        error={error}
        setEmail={setEmail}
        setPassword={setPassword}
        handleSubmit={handleSubmit}
      />
    </Container>
  );
};

export default Login;