import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RiRestaurantLine } from 'react-icons/ri';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b">
        <div className="max-w-[1400px] mx-auto flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⬚</span>
            <span className="text-xl font-bold">Easy Table</span>
          </div>
          <nav className="hidden md:flex gap-8">
            <a href="#caracteristicas" className="text-sm hover:text-gray-600">Características</a>
            <a href="#precios" className="text-sm hover:text-gray-600">Precios</a>
            <a href="#testimonios" className="text-sm hover:text-gray-600">Testimonios</a>
            <a href="#contacto" className="text-sm hover:text-gray-600">Contacto</a>
          </nav>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/login')} 
              className="text-sm hover:text-gray-600"
            >
              Iniciar sesión
            </button>
            <button 
              onClick={() => navigate('/register')}
              className="bg-black text-white px-4 py-2 rounded-md text-sm"
            >
              Registrarse
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-[2.75rem] md:text-6xl font-bold leading-tight mb-6">
              Gestiona tu restaurante de manera fácil y eficiente
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              Easy Table simplifica la gestión de reservas, mesas y personal de tu restaurante en una sola plataforma.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => navigate('/register')}
                className="bg-black text-white px-6 py-2.5 rounded-md text-sm font-medium"
              >
                Registrarme →
              </button>
              <button className="border border-gray-300 px-6 py-2.5 rounded-md text-sm font-medium">
                Ver demostración
              </button>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="bg-gray-100 rounded-lg w-full max-w-[550px] aspect-square flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;