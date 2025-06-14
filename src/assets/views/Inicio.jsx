import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Container, Button } from "react-bootstrap";
import ModalInstalacionIOS from "../components/inicio/ModalInstalacionIOS";
import { useTranslation } from 'react-i18next';

const Inicio = () => {

    const navigate = useNavigate();

    // Variables de estado para la instalación de la PWA y detección de iOS
    const [solicitudInstalacion, setSolicitudInstalacion] = useState(null);
    const [mostrarBotonInstalacion, setMostrarBotonInstalacion] = useState(false);
    const [esDispositivoIOS, setEsDispositivoIOS] = useState(false);
    const [mostrarModalInstrucciones, setMostrarModalInstrucciones] = useState(false);
    const { t } = useTranslation();

    // Detectar dispositivo iOS
    useEffect(() => {
        const esIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        setEsDispositivoIOS(esIOS);
    }, []);

    // Manejar evento beforeinstallprompt
    useEffect(() => {
        const manejarSolicitudInstalacion = (evento) => {
            evento.preventDefault();
            setSolicitudInstalacion(evento);
            setMostrarBotonInstalacion(true);
        };

        window.addEventListener("beforeinstallprompt", manejarSolicitudInstalacion);

        return () => {
            window.removeEventListener("beforeinstallprompt", manejarSolicitudInstalacion);
        };
    }, []);

    // Función de navegación
    const handleNavigate = (path) => {
      navigate(path);
    };

    // Función para disparar el prompt de instalación
    const instalacion = async () => {
        if (!solicitudInstalacion) return;
        try {
            await solicitudInstalacion.prompt();
            const { outcome } = await solicitudInstalacion.userChoice;
            console.log(outcome === "accepted" ? "Instalación aceptada" : "Instalación rechazada");
        } catch (error) {
            console.error("Error al intentar instalar la PWA:", error);
        } finally {
            setSolicitudInstalacion(null);
            setMostrarBotonInstalacion(false);
        }
    };

    console.log("esDispositivoIOS:", esDispositivoIOS);
console.log("mostrarBotonInstalacion:", mostrarBotonInstalacion);
console.log("solicitudInstalacion:", solicitudInstalacion);

    // Funciones para mostrar y ocultar el modal de instrucciones para iOS
    const abrirModalInstrucciones = () => setMostrarModalInstrucciones(true);
    const cerrarModalInstrucciones = () => setMostrarModalInstrucciones(false);

  return (
    <Container>
      <h1>{t("inicio.titulo")}</h1>
      <button onClick={() => handleNavigate("/categorias")} >{t("inicio.botonCategorias")}</button>
      <button onClick={() => handleNavigate("/productos")} >{t("inicio.botonProductos")}</button>
      <br />
      {!esDispositivoIOS && mostrarBotonInstalacion && (
        <div className="my-4">
          <Button className="sombra" variant="primary" onClick={instalacion}>
            {t("inicio.botonInstalar")} <i className="bi bi-download"></i>
          </Button>
        </div>
      )}
      {esDispositivoIOS && (
        <div className="text-center my-4">
          <Button className="sombra" variant="primary" onClick={abrirModalInstrucciones}>
            {t("inicio.botonInstalar")} <i className="bi bi-phone"></i>
          </Button>
        </div>    
      )}
      <ModalInstalacionIOS
        mostrar={mostrarModalInstrucciones}
        cerrar={cerrarModalInstrucciones}
      />
    </Container>
  );
}

export default Inicio;