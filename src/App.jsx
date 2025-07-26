import { useState, useRef, useEffect } from "react";
import { Bot, User, ChevronDown, ChevronUp } from "lucide-react";
import Chatbot from "./components/chatbot";


function App() {
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const servicesRef = useRef(null);

  useEffect(() => {
    if (isServicesOpen && servicesRef.current) {
      servicesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isServicesOpen]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Chatbot/>
      {/* Encabezado */}
      <header className="bg-orange-600 p-6 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold flex items-center">
            <Bot className="mr-2" /> INGE LEAN SAS
          </h1>
          <nav>
            <ul className="flex space-x-6">
              <li><a href="#inicio" className="hover:text-orange-200">Inicio</a></li>
              <li><a href="#nosotros" className="hover:text-orange-200">Nosotros</a></li>
              <li><a href="#servicios" className="hover:text-orange-200">Servicios</a></li>
              <li><a href="#contacto" className="hover:text-orange-200">Contacto</a></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Sección Hero */}
      <section id="inicio" className="flex-grow flex items-center justify-center bg-gray-800">
        <div className="container mx-auto text-center p-6">
          <h2 className="text-4xl font-bold mb-4">Bienvenidos a INGE LEAN SAS</h2>
          <p className="text-lg mb-6">
            Soluciones personalizadas en automatización industrial, software a medida e inteligencia artificial para empresas del Eje Cafetero.
          </p>
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded flex items-center mx-auto">
            <User className="mr-2" size={20} /> Conozca Más
          </button>
        </div>
      </section>

      {/* Sección Nosotros */}
      <section id="nosotros" className="bg-gray-900 py-12">
        <div className="container mx-auto p-6">
          <h3 className="text-3xl font-bold text-center mb-6">Sobre Nosotros</h3>
          <p className="text-lg text-center max-w-2xl mx-auto">
            INGE LEAN SAS, ubicada en Pereira, Risaralda, es una empresa especializada en automatización industrial, desarrollo de software a medida, inteligencia artificial y mantenimiento de equipos industriales. Nos enfocamos en soluciones B2B para optimizar procesos industriales y comerciales en el Eje Cafetero.
          </p>
        </div>
      </section>

      {/* Sección Servicios con Función Colapsable */}
      <section id="servicios" className="bg-orange-600 py-12" ref={servicesRef}>
        <div className="container mx-auto p-6">
          <h3 className="text-3xl font-bold text-center mb-6 flex items-center justify-center">
            Nuestros Servicios
            <button
              onClick={() => setIsServicesOpen(!isServicesOpen)}
              className="ml-2 focus:outline-none"
            >
              {isServicesOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>
          </h3>
          {isServicesOpen && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-800 p-6 rounded-lg text-center">
                <h4 className="text-xl font-semibold mb-2">Automatización Industrial</h4>
                <p>Optimizamos procesos con sistemas de control y PLCs personalizados.</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg text-center">
                <h4 className="text-xl font-semibold mb-2">Software a Medida</h4>
                <p>Desarrollamos soluciones de software adaptadas a sus necesidades.</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg text-center">
                <h4 className="text-xl font-semibold mb-2">Inteligencia Artificial</h4>
                <p>Implementamos IA para mejorar la eficiencia empresarial.</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg text-center">
                <h4 className="text-xl font-semibold mb-2">Mantenimiento Industrial</h4>
                <p>Ofrecemos mantenimiento preventivo y correctivo de equipos.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Sección Contacto */}
      <section id="contacto" className="bg-gray-900 py-12">
        <div className="container mx-auto p-6 text-center">
          <h3 className="text-3xl font-bold mb-6">Contáctenos</h3>
          <p className="text-lg mb-6">
            ¿Listo para optimizar sus procesos? Agendemos una reunión para discutir su proyecto.
          </p>
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded">
            Solicitar Cotización
          </button>
          <div className="mt-6 text-sm">
            <p>Correo: comercial@ingelean.com</p>
            <p>Teléfonos: (+57) 321 549 28 72 | (+57) 304 326 25 38</p>
            <p>Dirección: Cl. 29 #10-23, La Victoria, Pereira, Risaralda</p>
          </div>
        </div>
      </section>

      {/* Pie de Página */}
      <footer className="bg-orange-600 p-4 text-center">
        <p>&copy; 2025 INGE LEAN SAS. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default App