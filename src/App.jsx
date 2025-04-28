import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./assets/database/authcontext";
import ProtectedRoute from "./assets/components/ProtectedRoute"; 
import Login from './assets/views/Login'
import Encabezado from "./assets/components/Encabezado";
import Inicio from "./assets/views/Inicio";
import Productos from "./assets/views/Productos";
import Categorias from "./assets/views/Categorias"; //Importación de Categorias
import Catalogo from "./assets/views/Catalogo";
import Clima from "./assets/views/Clima";
import './App.css'

function App() {

  return (
    <>
      <AuthProvider>
        <Router>
            <Encabezado />
            <main className="margen-superior-main">
              <Routes>
                
                <Route path="/" element={<Login />} />
                <Route path="/inicio" element={<ProtectedRoute element={<Inicio />} />} />
                <Route path="/categorias" element={<ProtectedRoute element={<Categorias />} />}/> //Ruta de Categorias protegida
                <Route path="/productos" element= {<ProtectedRoute element={<Productos />} />}/>
                <Route path="/catalogo" element= {<ProtectedRoute element={<Catalogo />} />}/>
                <Route path="/clima" element={<ProtectedRoute element={<Clima />} />}/>

              </Routes>
            </main>
        </Router>
      </AuthProvider>
    </>
  )
}

export default App