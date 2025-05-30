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
import ChatIA from "../components/chat/ChatIA";
import { useTranslation } from 'react-i18next';

const Categorias = () => {
  const { t } = useTranslation();
  // Estados para manejo de datos
  const [categorias, setCategorias] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
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
        alert(t('common.error') + ": " + error.message);
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
    // Validar campos requeridos
    if (!nuevaCategoria.nombre || !nuevaCategoria.descripcion) {
      alert(t('common.error'));
      return;
    }

    // Cerrar modal
    setShowModal(false);
  
    // Crear ID temporal para offline y objeto de categoría
    const tempId = `temp_${Date.now()}`;
    const categoriaConId = { ...nuevaCategoria, id: tempId };
  
    try {
      // Actualizar estado local para reflejar la nueva categoría
      setCategorias((prev) => [...prev, categoriaConId]);
      setCategoriasFiltradas((prev) => [...prev, categoriaConId]);

      // Limpiar campos del formulario
      setNuevaCategoria({ nombre: "", descripcion: "" });
  
      // Intentar guardar en Firestore
      await addDoc(categoriasCollection, nuevaCategoria);
  
      // Mensaje según estado de conexión
      if (isOffline) {
        console.log("Categoría agregada localmente (sin conexión).");
      } else {
        console.log("Categoría agregada exitosamente en la nube.");
      }
    } catch (error) {
      console.error("Error al agregar la categoría:", error);
  
      // Manejar error según estado de conexión
      if (isOffline) {
        console.log("Offline: Categoría almacenada localmente.");
      } else {
        // Revertir cambios locales si falla en la nube
        setCategorias((prev) => prev.filter((cat) => cat.id !== tempId));
        setCategoriasFiltradas((prev) => prev.filter((cat) => cat.id !== tempId));
        alert(t('common.error') + ": " + error.message);
      }
    }
  };

  const handleEditCategoria = async () => {
    if (!categoriaEditada?.nombre || !categoriaEditada?.descripcion) {
      alert(t('common.error'));
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

      console.log('Red desconectada:', isOffline)
  
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
        alert(t('common.error'));
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
      alert(t('common.error') + ": " + error.message);
    }
  };

  // Función para eliminar una categoría (DELETE)
  const handleDeleteCategoria = async () => {
    if (!categoriaAEliminar) return;
  
    // Cerrar modal
    setShowDeleteModal(false);
  
    try {
      // Actualizar estado local para reflejar la eliminación
      setCategorias((prev) => prev.filter((cat) => cat.id !== categoriaAEliminar.id));
      setCategoriasFiltradas((prev) => prev.filter((cat) => cat.id !== categoriaAEliminar.id));
  
      // Intentar eliminar en Firestore
      const categoriaRef = doc(db, "categorias", categoriaAEliminar.id);
      await deleteDoc(categoriaRef);
  
      // Mensaje según estado de conexión
      if (isOffline) {
        console.log("Categoría eliminada localmente (sin conexión).");
      } else {
        console.log("Categoría eliminada exitosamente en la nube.");
      }
    } catch (error) {
      console.error("Error al eliminar la categoría:", error);
      alert(t('common.error') + ": " + error.message);
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
      <h4>{t("categorias.titulo")}</h4>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Button className="mb-3" onClick={() => setShowModal(true)}>
          {t("categorias.agregarCategoria")}
        </Button>
        <Button className="mb-3" onClick={() => setShowChatModal(true)} style={{ width: "100%" }}>
          {t("categorias.chatIA")}
        </Button>
      </div>
      <CuadroBusqueda
        placeholder={t('categorias.buscar')}
        value={searchText}
        onChange={handleSearchChange}
      />

      <TablaCategorias
        categorias={paginatedCategorias}
        onEdit={openEditModal}
        onDelete={openDeleteModal}
        totalItems={categoriasFiltradas.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      <ModalRegistroCategoria
        show={showModal}
        onHide={() => setShowModal(false)}
        nuevaCategoria={nuevaCategoria}
        handleInputChange={handleInputChange}
        handleAddCategoria={handleAddCategoria}
      />
      <ModalEdicionCategoria
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        categoriaEditada={categoriaEditada}
        handleEditInputChange={handleEditInputChange}
        handleEditCategoria={handleEditCategoria}
      />
      <ModalEliminacionCategoria
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        categoriaAEliminar={categoriaAEliminar}
        handleDeleteCategoria={handleDeleteCategoria}
      />
      <ChatIA
        show={showChatModal}
        onHide={() => setShowChatModal(false)}
      />
    </Container>
  );
};

export default Categorias;
