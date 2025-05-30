import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { db } from '../database/firebaseconfig';
import { collection,onSnapshot } from 'firebase/firestore';
import GraficoProductos from '../components/estadisticas/GraficoProductos';
import { useTranslation } from 'react-i18next';


const Estadisticas = () => {
    const [productos, setProductos] = useState([]);
    const productosCollection = collection(db, 'productos');
    const nombres = productos.map((producto) => producto.nombre);
    const precios = productos.map((producto) => producto.precio);
    const { t } = useTranslation();

    useEffect(() => {
       const unsubcribe = onSnapshot(productosCollection, (snapshot) => {
        const fetchedProductos = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id, 
        }));
        setProductos(fetchedProductos);
    }, (error) => {
        console.error('Error al obtener productos:', error);
        alert('Error al obtener productos');
    });
       return () => unsubcribe();
    }, []);
    
    return (
    <Container>
        <br />
        <h1>{t("estadisticas.titulo")}</h1>
        <Row className='mt-4'>
        <Col xs={12} sm={12} md={12} lg={12} className='mt-4'>
            <GraficoProductos nombres={nombres} precios={precios} />
        </Col>
        </Row>
    </Container>
);
};

export default Estadisticas;