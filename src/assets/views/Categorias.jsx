// Importaciones
import React, { useState, useEffect } from "react";
import { Container, Button } from "react-bootstrap";
import { db } from "../database/firebaseconfig";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  doc,
} from "firebase/firestore";

// Importaciones de componentes personalizados
import TablaCategorias from "../components/categories/TablaCategorias";
import ModalRegistroCategoria from "../components/categories/ModalRegistroCategoria";
import ModalEdicionCategoria from "../components/categories/ModalEdicionCategoria";
import ModalEliminacionCategoria from "../components/categories/ModalEliminacionCategoria";
import CuadroBusqueda from "../busqueda/CuadroBusqueda";


const Categorias = () => {
  
  // Estados para manejo de datos
  const [categorias, setCategorias] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [nuevaCategoria, setNuevaCategoria] = useState({
    nombre: "",
    descripcion: "",
  });
  const [categoriaEditada, setCategoriaEditada] = useState(null);
  const [categoriaAEliminar, setCategoriaAEliminar] = useState(null);
  const [categoriasFiltradas, setCategoriasFiltradas] = useState([]);
  const [searchText, setSearchText] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Referencia a la colección de categorías en Firestore
  const categoriasCollection = collection(db, "categorias");

  // Calcular categorías paginadas
  const paginatedCategorias = categoriasFiltradas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
  const handleOnline = () => {
    setIsOffline(false);
  };
  const handleOffline = () => {
    setIsOffline(true);
  };
  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);
  setIsOffline(!navigator.onLine);
  return () => {
    window.removeEventListener("online", handleOnline);
    window.removeEventListener("offline", handleOffline);
  };
}, []);

  // Función para obtener todas las categorías de Firestore
  const fetchCategorias = () => {
    const stopListening = onSnapshot(categoriasCollection, (snapshot) => {
      const fetchedCategorias = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setCategorias(fetchedCategorias);
      setCategoriasFiltradas(fetchedCategorias);
      console.log("Categorías cargadas desde Firestore:", fetchedCategorias);
      if (isOffline) {
        console.log("Offline: Mostrando datos desde la caché local.");
      }
    }, (error) => {
      console.error("Error al escuchar categorías:", error);
      if (isOffline) {
        console.log("Offline: Mostrando datos desde la caché local.");
      } else {
        alert("Error al cargar las categorías: " + error.message);
      }
    });
    return stopListening;
  };
  // Hook useEffect para carga inicial y escucha de datos
  useEffect(() => {
    const cleanupListener = fetchCategorias();
    return () => cleanupListener();
  }, []);

  const handleSearchChange = (e) => {
    const text = e.target.value.toLowerCase();
    setSearchText(text);

    const filtradas = categorias.filter((categoria) => 
      categoria.nombre.toLowerCase().includes(text) ||
        categoria.descripcion.toLowerCase().includes(text)
    );

    setCategoriasFiltradas(filtradas);
  }

  // Manejador de cambios en inputs del formulario de nueva categoría
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevaCategoria((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Manejador de cambios en inputs del formulario de edición
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setCategoriaEditada((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Función para agregar una nueva categoría (CREATE)
  const handleAddCategoria = async () => {
    if (!nuevaCategoria.nombre || !nuevaCategoria.descripcion) {
      alert("Por favor, completa todos los campos antes de guardar.");
      return;
    }
    try {
      await addDoc(categoriasCollection, nuevaCategoria);
      setShowModal(false);
      setNuevaCategoria({ nombre: "", descripcion: "" });
      await fetchCategorias();
    } catch (error) {
      console.error("Error al agregar la categoría:", error);
    }
  };

  const handleEditCategoria = async () => {
    if (!categoriaEditada?.nombre || !categoriaEditada?.descripcion) {
      alert("Por favor, completa todos los campos antes de actualizar.");
      return;
    }
    
    setShowEditModal(false);

    const categoriaRef = doc(db, "categorias", categoriaEditada.id);
  
    try {
      // Intentar actualizar en Firestore
      await updateDoc(categoriaRef, {
        nombre: categoriaEditada.nombre,
        descripcion: categoriaEditada.descripcion,
      });

      console.log('Red desconectada:', isOffline )
  
      if (isOffline) {
        // Actualizar estado local inmediatamente si no hay conexión
        setCategorias((prev) =>
          prev.map((cat) =>
            cat.id === categoriaEditada.id ? { ...categoriaEditada } : cat
          )
        );
        setCategoriasFiltradas((prev) =>
          prev.map((cat) =>
            cat.id === categoriaEditada.id ? { ...categoriaEditada } : cat
          )
        );
        console.log("Categoría actualizada localmente (sin conexión).");
        alert(
          "Sin conexión: Categoría actualizada localmente. Se sincronizará cuando haya internet."
        );
      } else {
        // Si hay conexión, confirmar éxito en la nube
        console.log("Categoría actualizada exitosamente en la nube.");
      }
    } catch (error) {
      // Manejar errores inesperados (no relacionados con la red)
      console.error("Error al actualizar la categoría:", error);
      setCategorias((prev) =>
        prev.map((cat) =>
          cat.id === categoriaEditada.id ? { ...categoriaEditada } : cat
        )
      );
      setCategoriasFiltradas((prev) =>
        prev.map((cat) =>
          cat.id === categoriaEditada.id ? { ...categoriaEditada } : cat
        )
      );
      alert("Ocurrió un error al actualizar la categoría: " + error.message);
    }
  };

  // Función para eliminar una categoría (DELETE)
  const handleDeleteCategoria = async () => {
    if (categoriaAEliminar) {
      try {
        const categoriaRef = doc(db, "categorias", categoriaAEliminar.id);
        await deleteDoc(categoriaRef);
        setShowDeleteModal(false);
        await fetchCategorias();
      } catch (error) {
        console.error("Error al eliminar la categoría:", error);
      }
    }
  };

  // Función para abrir el modal de edición con datos prellenados
  const openEditModal = (categoria) => {
    setCategoriaEditada({ ...categoria });
    setShowEditModal(true);
  };

  // Función para abrir el modal de eliminación
  const openDeleteModal = (categoria) => {
    setCategoriaAEliminar(categoria);
    setShowDeleteModal(true);
  };

  // Renderizado del componente
  return (
    <Container className="mt-5">
      <br />
      <h4>Gestión de Categorías</h4>
      <Button className="mb-3" onClick={() => setShowModal(true)}>
        Agregar categoría
      </Button>
      <CuadroBusqueda
        searchText={searchText}
        handleSearchChange={handleSearchChange}
      />


      <TablaCategorias
        categorias={paginatedCategorias}
        openEditModal={openEditModal}
        openDeleteModal={openDeleteModal}
        totalItems={categoriasFiltradas.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      <ModalRegistroCategoria
        showModal={showModal}
        setShowModal={setShowModal}
        nuevaCategoria={nuevaCategoria}
        handleInputChange={handleInputChange}
        handleAddCategoria={handleAddCategoria}
      />
      <ModalEdicionCategoria
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        categoriaEditada={categoriaEditada}
        handleEditInputChange={handleEditInputChange}
        handleEditCategoria={handleEditCategoria}
      />
      <ModalEliminacionCategoria
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        handleDeleteCategoria={handleDeleteCategoria}
      />
    </Container>
  );
};

export default Categorias;
