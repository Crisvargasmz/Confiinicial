// Importaciones
import React, { useState, useEffect } from "react";
import { Container, Button, Toast, Col, Row } from "react-bootstrap";
import { db } from "../database/firebaseconfig";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";

import TablaProductos from "../components/products/TablaProductos";
import ModalRegistroProducto from "../components/products/ModalRegistroProducto";
import ModalEdicionProducto from "../components/products/ModalEdicionProducto";
import ModalEliminacionProducto from "../components/products/ModalEliminacionProducto";
import CuadroBusqueda from "../busqueda/CuadroBusqueda";
import ModalQR from "../components/qr/ModalQR";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useTranslation } from 'react-i18next';

const Productos = () => {
  const { t } = useTranslation();
  // Estados para manejo de datos
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    precio: "",
    categoria: "",
    imagen: ""
  });
  const [productoEditado, setProductoEditado] = useState(null);
  const [productoAEliminar, setProductoAEliminar] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrText, setQrText] = useState("");

  // Referencia a las colecciones en Firestore
  const productosCollection = collection(db, "productos");
  const categoriasCollection = collection(db, "categorias");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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

  const generarPDFProductos = () => {
    const doc = new jsPDF();
    doc.setFillColor(28, 41, 51);
    doc.rect(0, 0, 220, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text(t('productos.reportePDF'), doc.internal.pageSize.width / 2, 18, 'center');
    const columnas = [
      "#",
      t('productos.nombre'),
      t('productos.precio'),
      t('productos.categoria')
    ]
    const filas = productosFiltrados.map((producto, index) => [
      index + 1,
      producto.nombre,
      `C$${producto.precio}`,
      producto.categoria
    ])
    const totalPaginas = "{total_pages_count_string}";

    autoTable(doc, {
      head: [columnas],
      body: filas,
      startY: 40,
      theme: "grid",
      styles: {
        cellPadding: 2,
        fontSize: 10,
      },
      margin: {
        top: 20,
        right: 20,
        left: 20
      },
      tableWidth: "auto",
      columnStyles: {
        0: { cellWidth: "auto" },
        1: { cellWidth: "auto" },
        2: { cellWidth: "auto" },
      },
      pageBreak: "auto",
      rowPageBreak: "auto",

      didDrawPage: function (data) {
        const alturaPagina = doc.internal.pageSize.height;
        const anchoPagina = doc.internal.pageSize.width;
        const numeroPagina = doc.internal.getNumberOfPages();
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        const piePagina = `${t('common.pagina')} ${numeroPagina} ${t('common.de')} ${totalPaginas}`;
        doc.text(piePagina, anchoPagina / 2 + 15, alturaPagina - 10, 'center');
      },
    });

    if (typeof doc.putTotalPages === "function") {
      doc.putTotalPages(totalPaginas);
    }

    const fecha = new Date().toLocaleDateString();
    const dia = String(new Date().getDate()).padStart(2, '0');
    const mes = String(new Date().getMonth() + 1).padStart(2, '0');
    const anio = new Date().getFullYear();
    const nombreArchivo = `${t('productos.reportePDF')} ${dia}-${mes}-${anio}.pdf`;

    doc.save(nombreArchivo);
  }

  const generarPDFDetalleProducto = (producto) => {
    const pdf = new jsPDF();

    // Encabezado
    pdf.setFillColor(28, 41, 51);
    pdf.rect(0, 0, 220, 30, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(22);
    pdf.text(producto.nombre, pdf.internal.pageSize.getWidth() / 2, 18, { align: "center" });

    // Imagen centrada (si existe)
    if (producto.imagen) {
      const propiedadesImagen = pdf.getImageProperties(producto.imagen);
      const anchoPagina = pdf.internal.pageSize.getWidth();
      const anchoImagen = 60;
      const altoImagen = (propiedadesImagen.height * anchoImagen) / propiedadesImagen.width;
      const posicionX = (anchoPagina - anchoImagen) / 2;
      pdf.addImage(producto.imagen, 'JPEG', posicionX, 40, anchoImagen, altoImagen);

      // Datos centrados debajo de la imagen
      const posicionY = 40 + altoImagen + 10;
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(14);
      pdf.text(`${t('productos.precio')}: C$${producto.precio}`, anchoPagina / 2, posicionY, { align: "center" });
      pdf.text(`${t('productos.categoria')}: ${producto.categoria}`, anchoPagina / 2, posicionY + 10, { align: "center" });
    } else {
      // Si no hay imagen, mostrar los datos más arriba
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(14);
      pdf.text(`${t('productos.precio')}: C$${producto.precio}`, pdf.internal.pageSize.getWidth() / 2, 50, { align: "center" });
      pdf.text(`${t('productos.categoria')}: ${producto.categoria}`, pdf.internal.pageSize.getWidth() / 2, 60, { align: "center" });
    }

    pdf.save(`${producto.nombre}.pdf`);
  }

  const generarExcelProductos = () => {
    // 1. Estructura de datos para la hoja Excel
    const datos = productosFiltrados.map((producto, index) => ({
      "#": index + 1,
      [t('productos.nombre')]: producto.nombre,
      [t('productos.precio')]: parseFloat(producto.precio),
      [t('productos.categoria')]: producto.categoria,
    }));

    // 2. Crear hoja y libro Excel
    const hoja = XLSX.utils.json_to_sheet(datos);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, t('productos.titulo'));

    // 3. Crear el archivo binario
    const excelBuffer = XLSX.write(libro, { bookType: 'xlsx', type: 'array' });

    // 4. Guardar el archivo usando file-saver
    const fecha = new Date();
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    const nombreArchivo = `${t('productos.reportePDF')} ${dia}-${mes}-${anio}.xlsx`;

    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, nombreArchivo);
  }

  // Calcular productos paginados
  const paginatedProductos = productosFiltrados.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Función para obtener todas las categorías y productos de Firestore
  const fetchData = () => {
    // Escuchar productos
    const unsubscribeProductos = onSnapshot(productosCollection, (snapshot) => {
      const fetchedProductos = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setProductos(fetchedProductos);
      setProductosFiltrados(fetchedProductos);
      if (isOffline) {
        console.log("Offline: Productos cargados desde caché local.");
      }
    }, (error) => {
      console.error("Error al escuchar productos:", error);
      if (isOffline) {
        console.log("Offline: Mostrando datos desde caché local.");
      } else {
        alert(t('common.error') + ": " + error.message);
      }
    });

    // Escuchar categorías
    const unsubscribeCategorias = onSnapshot(categoriasCollection, (snapshot) => {
      const fetchedCategorias = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setCategorias(fetchedCategorias);
    });

    return () => {
      unsubscribeProductos();
      unsubscribeCategorias();
    };
  };

  useEffect(() => {
    const cleanup = fetchData();
    return cleanup;
  }, []);

  const handleSearchChange = (e) => {
    const text = e.target.value.toLowerCase();
    setSearchText(text);

    const filtrados = productos.filter((producto) =>
      producto.nombre.toLowerCase().includes(text) ||
      producto.categoria.toLowerCase().includes(text)
    );

    setProductosFiltrados(filtrados);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoProducto((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setProductoEditado((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNuevoProducto((prev) => ({
          ...prev,
          imagen: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductoEditado((prev) => ({
          ...prev,
          imagen: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProducto = async () => {
    if (!nuevoProducto.nombre || !nuevoProducto.precio || !nuevoProducto.categoria) {
      alert(t('common.error'));
      return;
    }

    setShowModal(false);

    const tempId = `temp_${Date.now()}`;
    const productoConId = { ...nuevoProducto, id: tempId };

    try {
      setProductos((prev) => [...prev, productoConId]);
      setProductosFiltrados((prev) => [...prev, productoConId]);

      setNuevoProducto({
        nombre: "",
        precio: "",
        categoria: "",
        imagen: ""
      });

      await addDoc(productosCollection, nuevoProducto);

      if (isOffline) {
        console.log("Producto agregado localmente (sin conexión).");
      } else {
        console.log("Producto agregado exitosamente en la nube.");
      }
    } catch (error) {
      console.error("Error al agregar el producto:", error);

      if (isOffline) {
        console.log("Offline: Producto almacenado localmente.");
      } else {
        setProductos((prev) => prev.filter((prod) => prod.id !== tempId));
        setProductosFiltrados((prev) => prev.filter((prod) => prod.id !== tempId));
        alert(t('common.error') + ": " + error.message);
      }
    }
  };

  const handleEditProducto = async () => {
    if (!productoEditado?.nombre || !productoEditado?.precio || !productoEditado?.categoria) {
      alert(t('common.error'));
      return;
    }

    setShowEditModal(false);

    const productoRef = doc(db, "productos", productoEditado.id);

    try {
      await updateDoc(productoRef, {
        nombre: productoEditado.nombre,
        precio: productoEditado.precio,
        categoria: productoEditado.categoria,
        imagen: productoEditado.imagen
      });

      if (isOffline) {
        setProductos((prev) =>
          prev.map((prod) =>
            prod.id === productoEditado.id ? { ...productoEditado } : prod
          )
        );
        setProductosFiltrados((prev) =>
          prev.map((prod) =>
            prod.id === productoEditado.id ? { ...productoEditado } : prod
          )
        );
        console.log("Producto actualizado localmente (sin conexión).");
        alert(t('common.error'));
      } else {
        console.log("Producto actualizado exitosamente en la nube.");
      }
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      setProductos((prev) =>
        prev.map((prod) =>
          prod.id === productoEditado.id ? { ...productoEditado } : prod
        )
      );
      setProductosFiltrados((prev) =>
        prev.map((prod) =>
          prod.id === productoEditado.id ? { ...productoEditado } : prod
        )
      );
      alert(t('common.error') + ": " + error.message);
    }
  };

  const handleDeleteProducto = async () => {
    if (!productoAEliminar) return;

    setShowDeleteModal(false);

    try {
      setProductos((prev) => prev.filter((prod) => prod.id !== productoAEliminar.id));
      setProductosFiltrados((prev) => prev.filter((prod) => prod.id !== productoAEliminar.id));

      const productoRef = doc(db, "productos", productoAEliminar.id);
      await deleteDoc(productoRef);

      if (isOffline) {
        console.log("Producto eliminado localmente (sin conexión).");
      } else {
        console.log("Producto eliminado exitosamente en la nube.");
      }
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      alert(t('common.error') + ": " + error.message);
    }
  };

  const openEditModal = (producto) => {
    setProductoEditado({ ...producto });
    setShowEditModal(true);
  };

  const openDeleteModal = (producto) => {
    setProductoAEliminar(producto);
    setShowDeleteModal(true);
  };

  const handleCopy = (producto) => {
    const texto = `${producto.nombre}\nPrecio: C$${producto.precio}\nCategoría: ${producto.categoria}`;
    navigator.clipboard.writeText(texto).then(() => {
      setToastMsg(t('productos.copiadoExito'));
      setShowToast(true);
    });
  };

  const handleShowQR = (producto) => {
    const texto = `${producto.nombre}\nPrecio: C$${producto.precio}\nCategoría: ${producto.categoria}`;
    setQrText(texto);
    setShowQRModal(true);
  };

  return (
    <Container className="mt-5">
      <h1>{t('productos.titulo')}</h1>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Button variant="primary" onClick={() => setShowModal(true)}>
          {t('productos.nuevoProducto')}
        </Button>
        <div>
          <Button variant="success" className="me-2" onClick={generarPDFProductos}>
            {t('productos.exportarPDF')}
          </Button>
          <Button variant="info" onClick={generarExcelProductos}>
            {t('productos.exportarExcel')}
          </Button>
        </div>
      </div>

      <CuadroBusqueda
        placeholder={t('productos.buscar')}
        value={searchText}
        onChange={handleSearchChange}
      />

      <TablaProductos
        productos={paginatedProductos}
        onEdit={openEditModal}
        onDelete={openDeleteModal}
        onCopy={handleCopy}
        onShowQR={handleShowQR}
        onGeneratePDF={generarPDFDetalleProducto}
      />

      <ModalRegistroProducto
        show={showModal}
        onHide={() => setShowModal(false)}
        nuevoProducto={nuevoProducto}
        categorias={categorias}
        handleInputChange={handleInputChange}
        handleImageChange={handleImageChange}
        handleAddProducto={handleAddProducto}
      />

      <ModalEdicionProducto
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        productoEditado={productoEditado}
        categorias={categorias}
        handleEditInputChange={handleEditInputChange}
        handleEditImageChange={handleEditImageChange}
        handleEditProducto={handleEditProducto}
      />

      <ModalEliminacionProducto
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        productoAEliminar={productoAEliminar}
        handleDeleteProducto={handleDeleteProducto}
      />

      <ModalQR
        show={showQRModal}
        onHide={() => setShowQRModal(false)}
        qrText={qrText}
      />

      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        delay={3000}
        autohide
        style={{
          position: 'fixed',
          top: 20,
          right: 20,
        }}
      >
        <Toast.Header>
          <strong className="me-auto">{t('common.exito')}</strong>
        </Toast.Header>
        <Toast.Body>{toastMsg}</Toast.Body>
      </Toast>
    </Container>
  );
};

export default Productos;
