import React from "react";
import { Table, Button, Image } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import Paginacion from "../ordenamiento/Paginacion";
import { useTranslation } from 'react-i18next';

const TablaProductos = ({
  productos,
  onEdit,
  onDelete,
  onCopy,
  onShowQR,
  onGeneratePDF
}) => {
  const { t } = useTranslation();

  return (
    <>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>{t('productos.imagen')}</th>
            <th>{t('productos.nombre')}</th>
            <th>{t('productos.precio')}</th>
            <th>{t('productos.categoria')}</th>
            <th>{t('common.acciones')}</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.id}>
              <td>
                {producto.imagen && (
                  <Image src={producto.imagen} width="50" height="50" />
                )}
              </td>
              <td>{producto.nombre}</td>
              <td>C${producto.precio}</td>
              <td>{producto.categoria}</td>
              <td>
                <Button
                  variant="outline-info"
                  size="sm"
                  className="me-2"
                  onClick={() => onCopy(producto)}
                  title={t('common.copiar')}
                >
                  <i className="bi bi-clipboard"></i>
                </Button>
                <Button
                  variant="outline-warning"
                  size="sm"
                  className="me-2"
                  onClick={() => onEdit(producto)}
                  title={t('common.editar')}
                >
                  <i className="bi bi-pencil"></i>
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => onDelete(producto)}
                  title={t('common.eliminar')}
                >
                  <i className="bi bi-trash"></i>
                </Button>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-2"
                  onClick={() => onShowQR(producto)}
                  title={t('productos.generarQR')}
                >
                  <i className="bi bi-qr-code"></i>
                </Button>
                <Button
                  variant="outline-success"
                  size="sm"
                  className="me-2"
                  onClick={() => onGeneratePDF(producto)}
                  title={t('productos.generarPDF')}
                > 
                  <i className="bi bi-file-pdf"></i>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default TablaProductos;