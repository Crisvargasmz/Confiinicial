import { Card, Col, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../styles/Catalogo.css";
import { useTranslation } from 'react-i18next';

const TarjetaProducto = ({ producto, openEditModal }) => {
  const { t } = useTranslation();
  
  return (
    <Col lg={3} md={4} sm={6} className="mb-4">
      <Card className="tarjeta-producto">
        {producto.imagen && (
          <Card.Img 
            variant="top" 
            src={producto.imagen} 
            alt={producto.nombre}
            className="tarjeta-imagen"
          />
        )}
        <Card.Body className="tarjeta-cuerpo">
          <div>
            <Card.Title className="tarjeta-titulo">{producto.nombre}</Card.Title>
            <Card.Text className="tarjeta-texto">
              <span className="tarjeta-precio">{t("catalogo.precio")}: C${producto.precio}</span>
              <br />
              <span className="tarjeta-categoria">{t("catalogo.categoria")}: {producto.categoria}</span>
            </Card.Text>
          </div>
          <Button
            variant="outline-warning"
            size="sm"
            className="me-2"
            onClick={() => openEditModal(producto)}
            title={t("common.editar")}
          >
            <i className="bi bi-pencil"></i>
          </Button>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default TarjetaProducto;