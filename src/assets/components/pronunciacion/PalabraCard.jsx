import React from "react";
import { Button, Alert } from "react-bootstrap";
import { useTranslation } from 'react-i18next';

const PalabraCard = ({
    palabra,
    escuchando,
    resultado,
    error,
    onHablar,
    onNueva
}) => {
    const { t } = useTranslation();
    
    return (
        <div className="text-center">
            <h4 className="mt-4">{t("pronunciacion.titulo")}</h4>
            <h1 className="display-4">{palabra}</h1>

            <Button
                variant="primary"
                onClick={onHablar}
                disabled={escuchando}
                className="mt-3"
            >
                {escuchando ? t("common.cargando") : t("pronunciacion.hablar")}
            </Button>

            <Button variant="secondary" onClick={onNueva} className="ms-2 mt-3">
                {t("pronunciacion.nuevaPalabra")}
            </Button>

            {resultado && (
                <Alert
                    variant={resultado.correcto ? "success" : "danger"}
                    className="mt-4"
                    >
                    {resultado.correcto
                        ? `${t("pronunciacion.correcto")} "${resultado.texto}"`
                        : `${t("pronunciacion.incorrecto")} "${resultado.texto}", "${palabra}"`}
                </Alert>
            )}

            {error && (
                <Alert variant="warning" className="mt-3">
                    {error}
                </Alert>
            )}
        </div>
    );
};
export default PalabraCard;