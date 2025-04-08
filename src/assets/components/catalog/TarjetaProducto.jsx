import { Card, Col, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import  "../../styles/Catalogo.css"

const TarjetaProducto = ({ producto, openEditModal }) => {
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
              <span className="tarjeta-precio">C${producto.precio}</span>
              <br />
              <span className="tarjeta-categoria">{producto.categoria}</span>
            </Card.Text>
          </div>
          <Button
            variant="outline-warning"
            size="sm"
            className="me-2"
            onClick={() => openEditModal(producto)}
          >
            <i className="bi bi-pencil"></i>
          </Button>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default TarjetaProducto;