import React from "react";
import { Table, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import Paginacion from "../ordenamiento/Paginacion";
import { useTranslation } from 'react-i18next';

const TablaCategorias = ({ categorias, openEditModal, openDeleteModal, totalItems,
  itemsPerPage,
  currentPage,
  setCurrentPage }) => {
  const { t } = useTranslation();

  return (
    <>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>{t('categorias.nombre')}</th>
            <th>{t('categorias.descripcion')}</th>
            <th>{t('common.acciones')}</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map((categoria) => (
            <tr key={categoria.id}>
              <td>{categoria.nombre}</td>
              <td>{categoria.descripcion}</td>
              <td>
                <Button
                  variant="outline-warning"
                  size="sm"
                  className="me-2"
                  onClick={() => openEditModal(categoria)}
                  title={t('common.editar')}
                >
                  <i className="bi bi-pencil"></i>
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => openDeleteModal(categoria)}
                  title={t('common.eliminar')}
                >
                  <i className="bi bi-trash"></i>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Paginacion
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </>
  );
};

export default TablaCategorias;