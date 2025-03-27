import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RiRestaurantLine, RiDashboardLine, RiTeamLine, RiMenuLine, RiStore2Line, RiSettings4Line, RiLogoutBoxLine } from 'react-icons/ri';
import axios from 'axios';

const Dishes = () => {
  const [dishes, setDishes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/products', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setDishes(response.data);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };
  
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <RiRestaurantLine className="h-6 w-6" />
            <span className="text-xl font-bold">Easy Table</span>
          </div>
        </div>
        <nav className="p-4 space-y-2">
          <Link to="/dashboard" className="flex items-center gap-2 p-2 text-gray-600 hover:bg-gray-50 rounded-md">
            <RiDashboardLine className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <Link to="/empleados" className="flex items-center gap-2 p-2 text-gray-600 hover:bg-gray-50 rounded-md">
            <RiTeamLine className="h-5 w-5" />
            <span>Gestionar Empleados</span>
          </Link>
          <Link to="/platillos" className="flex items-center gap-2 p-2 bg-gray-100 rounded-md">
            <RiMenuLine className="h-5 w-5" />
            <span>Gestionar Platillos</span>
          </Link>
          <Link to="/branches" className="flex items-center gap-2 p-2 text-gray-600 hover:bg-gray-50 rounded-md">
            <RiStore2Line className="h-5 w-5" />
            <span>Gestionar Sucursales</span>
          </Link>
          <Link to="/configuracion" className="flex items-center gap-2 p-2 text-gray-600 hover:bg-gray-50 rounded-md">
            <RiSettings4Line className="h-5 w-5" />
            <span>Configuración</span>
          </Link>
          <button className="flex items-center gap-2 p-2 text-red-600 hover:bg-gray-50 rounded-md w-full">
            <RiLogoutBoxLine className="h-5 w-5" />
            <span>Cerrar Sesión</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gestión de Platillos</h1>
          <button className="bg-black text-white px-4 py-2 rounded-md flex items-center gap-2">
            <span>+</span> Nuevo Platillo
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">Menú</h2>
          <p className="text-gray-600 mb-6">Administra los platillos de tu restaurante desde aquí.</p>

          <div className="flex justify-between mb-6">
            <input
              type="text"
              placeholder="Buscar platillos..."
              className="w-80 px-4 py-2 border border-gray-300 rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="flex gap-3">
              <button className="px-4 py-2 border border-gray-300 rounded-md">
                Filtrar
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-md">
                Exportar
              </button>
            </div>
          </div>

          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3">Imagen</th>
                <th className="text-left py-3">Nombre</th>
                <th className="text-left py-3">Descripción</th>
                <th className="text-left py-3">Precio</th>
                <th className="text-left py-3">Fecha de Creación</th>
                <th className="text-left py-3"></th>
              </tr>
            </thead>
            <tbody>
              {dishes.map((dish) => (
                <tr key={dish.id} className="border-b">
                  <td className="py-3">
                    <img 
                      src={dish.image_url} 
                      alt={dish.name}
                      className="w-12 h-12 object-cover rounded"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/48';
                      }}
                    />
                  </td>
                  <td className="py-3">{dish.name}</td>
                  <td className="py-3 max-w-xs truncate">{dish.description}</td>
                  <td className="py-3">${parseFloat(dish.price).toFixed(2)}</td>
                  <td className="py-3">
                    {new Date(dish.created_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </td>
                  <td className="py-3 text-right">
                    <button className="text-gray-600">...</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Dishes;