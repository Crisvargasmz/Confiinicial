import React, { useState, useEffect } from "react";
import { Container, Row, Form, Col, Button } from "react-bootstrap";
import { db } from "../database/firebaseconfig";
import {  collection,
  getDocs,
  updateDoc,
  doc,} from "firebase/firestore";
import TarjetaProducto from "../components/catalog/TarjetaProducto";
import ModalEdicionProducto from "../components/products/ModalEdicionProducto";
import CuadroBusqueda from "../busqueda/CuadroBusqueda";
import Paginacion from "../components/ordenamiento/Paginacion";
import "../styles/Catalogo.css";

const Catalogo= () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todas");
  const [showEditModal, setShowEditModal] = useState(false);
  const [productoEditado, setProductoEditado] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // 8 productos por página para mejor distribución en la cuadrícula

  // Calcular productos paginados
  const paginatedProductos = productosFiltrados.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const fetchData = async () => {
    try {
      // Obtener productos
      const productosData = await getDocs(productosCollection);
      const fetchedProductos = productosData.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setProductos(fetchedProductos);

      // Obtener categorías
      const categoriasData = await getDocs(categoriasCollection);
      const fetchedCategorias = categoriasData.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setCategorias(fetchedCategorias);
    } catch (error) {
      console.error("Error al obtener datos:", error);
    }
  };

    // Hook useEffect para carga inicial de datos
    useEffect(() => {
      fetchData();
    }, []);

  useEffect(() => {
    setProductosFiltrados(productos);
  }, [productos]);

  const handleSearchChange = (e) => {
    const text = e.target.value.toLowerCase();
    setSearchText(text);

    const filtrados = productos.filter((producto) =>
      producto.nombre.toLowerCase().includes(text) ||
      producto.categoria.toLowerCase().includes(text)
    );

    setProductosFiltrados(filtrados);
  };

      // Función para abrir el modal de edición con datos prellenados
  const openEditModal = (producto) => {
    setProductoEditado({ ...producto });
    setShowEditModal(true);
  };


    // Manejador de cambios en inputs del formulario de edición
    const handleEditInputChange = (e) => {
      const { name, value } = e.target;
      setProductoEditado((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setProductoEditado((prev) => ({ ...prev, imagen: reader.result }));
        };
        reader.readAsDataURL(file);
      }
    };

      // Función para actualizar un producto existente (UPDATE)
  const handleEditProducto = async () => {
    if (!productoEditado.nombre || !productoEditado.precio || !productoEditado.categoria) {
      alert("Por favor, completa todos los campos requeridos.");
      return;
    }
    try {
      const productoRef = doc(db, "productos", productoEditado.id);
      await updateDoc(productoRef, productoEditado);
      setShowEditModal(false);
      await fetchData(); // Volvemos a obtener los datos actualizados
    } catch (error) {
      console.error("Error al actualizar producto:", error);
    }
  };

  const productosCollection = collection(db, "productos");
  const categoriasCollection = collection(db, "categorias");

  useEffect(() => {
    const filtrados = categoriaSeleccionada === "Todas"
      ? productos
      : productos.filter((producto) => producto.categoria === categoriaSeleccionada);
    setProductosFiltrados(filtrados);
  }, [productos, categoriaSeleccionada]);

  return (
    <Container className="mt-5 catalogo-container">
      <br />
      <h4>Catálogo de Productos</h4>
      {/* Filtro de categorías */}
      <Row>
        <Col lg={3} md={3} sm={6}>
          <Form.Group className="mb-3">
            <Form.Label>Filtrar por categoría:</Form.Label>
            <Form.Select
              value={categoriaSeleccionada}
              onChange={(e) => setCategoriaSeleccionada(e.target.value)}
            >
              <option value="Todas">Todas</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.nombre}>
                  {categoria.nombre}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <CuadroBusqueda
        searchText={searchText}
        handleSearchChange={handleSearchChange}
      />

      {/* Catálogo de productos filtrados */}
      <Row className="g-4">
        {paginatedProductos.length > 0 ? (
          paginatedProductos.map((producto) => (
            <TarjetaProducto 
              key={producto.id} 
              producto={producto} 
              openEditModal={openEditModal} 
            />
          ))
        ) : (
          <Col>
            <p>No hay productos en esta categoría.</p>
          </Col>
        )}
      </Row>

      <div className="paginacion-container">
        <Paginacion
          itemsPerPage={itemsPerPage}
          totalItems={productosFiltrados.length}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>

      <ModalEdicionProducto
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        productoEditado={productoEditado}
        handleEditInputChange={handleEditInputChange}
        handleEditImageChange={handleEditImageChange}
        handleEditProducto={handleEditProducto}
        categorias={categorias}
      />
    </Container>
  );
};

export default Catalogo;
