import React, { useState, useEffect } from "react";
import { Container, Button } from "react-bootstrap";
import { db } from "../database/firebaseconfig";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";

import TablaLibros from "../components/libros/TablaLibros";
import ModalRegistroLibro from "../components/libros/ModalRegistroLibro";
import ModalEdicionLibro from "../components/libros/ModalEdicionLibro";
import ModalEliminacionLibro from "../components/libros/ModalEliminacionLibro";
import CuadroBusqueda from "../busqueda/CuadroBusqueda";
import { useTranslation } from 'react-i18next';

const Libros = () => {
  const { t } = useTranslation();
  const [libros, setLibros] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [nuevoLibro, setNuevoLibro] = useState({
    titulo: "",
    autor: "",
    categoria: ""
  });
  const [libroEditado, setLibroEditado] = useState(null);
  const [libroAEliminar, setLibroAEliminar] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [librosFiltrados, setLibrosFiltrados] = useState([]);

  const librosCollection = collection(db, "libros");
  const categoriasCollection = collection(db, "categorias");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    setIsOffline(!navigator.onLine);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const paginatedLibros = librosFiltrados.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const fetchData = () => {
    const unsubscribeLibros = onSnapshot(librosCollection, (snapshot) => {
      const fetchedLibros = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setLibros(fetchedLibros);
      setLibrosFiltrados(fetchedLibros);
    });
    const unsubscribeCategorias = onSnapshot(categoriasCollection, (snapshot) => {
      const fetchedCategorias = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setCategorias(fetchedCategorias);
    });
    return () => {
      unsubscribeLibros();
      unsubscribeCategorias();
    };
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setLibrosFiltrados(libros);
  }, [libros]);

  const handleSearchChange = (e) => {
    const text = e.target.value.toLowerCase();
    setSearchText(text);
    const filtrados = libros.filter((libro) =>
      libro.titulo.toLowerCase().includes(text) ||
      libro.autor.toLowerCase().includes(text) ||
      libro.categoria.toLowerCase().includes(text)
    );
    setLibrosFiltrados(filtrados);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoLibro((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setLibroEditado((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNuevoLibro((prev) => ({ ...prev, imagen: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLibroEditado((prev) => ({ ...prev, imagen: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddLibro = async () => {
    if (!nuevoLibro.titulo || !nuevoLibro.autor || !nuevoLibro.categoria) {
      alert("Por favor, completa todos los campos.");
      return;
    }
    setShowModal(false);
    const tempId = `temp_${Date.now()}`;
    const libroConId = {
      ...nuevoLibro,
      id: tempId,
    };
    try {
      setLibros((prev) => [...prev, libroConId]);
      setLibrosFiltrados((prev) => [...prev, libroConId]);
      await addDoc(librosCollection, {
        titulo: nuevoLibro.titulo,
        autor: nuevoLibro.autor,
        categoria: nuevoLibro.categoria,
      });
      setNuevoLibro({ titulo: "", autor: "", categoria: "" });
    } catch (error) {
      setLibros((prev) => prev.filter((libro) => libro.id !== tempId));
      setLibrosFiltrados((prev) => prev.filter((libro) => libro.id !== tempId));
      alert("Error al agregar el libro: " + error.message);
    }
  };

  const handleEditLibro = async () => {
    if (!libroEditado.titulo || !libroEditado.autor || !libroEditado.categoria || !libroEditado.imagen) {
      alert("Por favor, completa todos los campos, incluyendo la imagen.");
      return;
    }
    setShowEditModal(false);
    const libroRef = doc(db, "libros", libroEditado.id);
    try {
      setLibros((prev) =>
        prev.map((libro) =>
          libro.id === libroEditado.id ? { ...libroEditado } : libro
        )
      );
      setLibrosFiltrados((prev) =>
        prev.map((libro) =>
          libro.id === libroEditado.id ? { ...libroEditado } : libro
        )
      );
      await updateDoc(libroRef, {
        titulo: libroEditado.titulo,
        autor: libroEditado.autor,
        categoria: libroEditado.categoria,
        imagen: libroEditado.imagen,
      });
    } catch (error) {
      alert("Error al actualizar el libro: " + error.message);
    }
  };

  const handleDeleteLibro = async () => {
    if (!libroAEliminar) return;
    setShowDeleteModal(false);
    try {
      setLibros((prev) => prev.filter((libro) => libro.id !== libroAEliminar.id));
      setLibrosFiltrados((prev) => prev.filter((libro) => libro.id !== libroAEliminar.id));
      const libroRef = doc(db, "libros", libroAEliminar.id);
      await deleteDoc(libroRef);
    } catch (error) {
      setLibros((prev) => [...prev, libroAEliminar]);
      setLibrosFiltrados((prev) => [...prev, libroAEliminar]);
      alert("Error al eliminar el libro: " + error.message);
    }
  };

  const openEditModal = (libro) => {
    setLibroEditado({ ...libro });
    setShowEditModal(true);
  };

  const openDeleteModal = (libro) => {
    setLibroAEliminar(libro);
    setShowDeleteModal(true);
  };
  
  return (
    <Container className="mt-5">
      <br />
      <h4>{t("libros.titulo")}</h4>
      <Button className="mb-3" onClick={() => setShowModal(true)}>
        {t("libros.agregarLibro")}
      </Button>
      <CuadroBusqueda
        searchText={searchText}
        handleSearchChange={handleSearchChange}
      />
      <TablaLibros
        openEditModal={openEditModal}
        openDeleteModal={openDeleteModal}
        libros={paginatedLibros}
        totalItems={libros.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      <ModalRegistroLibro
        showModal={showModal}
        setShowModal={setShowModal}
        nuevoLibro={nuevoLibro}
        handleInputChange={handleInputChange}
        handleImageChange={handleImageChange}
        handleAddLibro={handleAddLibro}
        categorias={categorias}
      />
      <ModalEdicionLibro
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        libroEditado={libroEditado}
        handleEditInputChange={handleEditInputChange}
        handleEditImageChange={handleEditImageChange}
        handleEditLibro={handleEditLibro}
        categorias={categorias}
      />
      <ModalEliminacionLibro
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        handleDeleteLibro={handleDeleteLibro}
      />
    </Container>
  );
};

export default Libros; 