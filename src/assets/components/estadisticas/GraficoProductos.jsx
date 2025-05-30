import {Card} from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import { Chart} from "chart.js/auto";
import { useTranslation } from 'react-i18next';

const GraficoProductos = ({nombres, precios}) => {
    const { t } = useTranslation();

    const data = {
        labels: nombres,
        datasets: [{
            label: t("estadisticas.precio"),
            data: precios,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
        }]
    };
    
    const options = {
     responsive: true,
     plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: t("estadisticas.graficoProductos"),
        },
     },
     scales: {
        y: {
            beginAtZero: true,
            title: {
                display: true,
                text: t("estadisticas.precio"),
            },
        },
        x: {
            title: {
                display: true,
                text: t("estadisticas.producto"),
            },
        },
     },
    };

    return (
       <div style={{width: '100%', height: '400px'}}>
        <Card>
            <Card.Body>
                <Card.Title>{t("estadisticas.graficoProductos")}</Card.Title>
                <Bar data={data} options={options} />
            </Card.Body>
        </Card>
       </div>
    );
};

export default GraficoProductos;