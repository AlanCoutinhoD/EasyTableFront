import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { RiDashboardLine, RiTeamLine, RiMenuLine, RiStore2Line, RiSettings4Line, RiLogoutBoxLine } from 'react-icons/ri';

const Branches = () => {
  const [branches, setBranches] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos los estados');

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/branches', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBranches(response.data);
    } catch (error) {
      console.error('Error fetching branches:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 fixed h-full bg-white border-r">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-8">
            <span className="text-xl font-bold">Easy Table</span>
          </div>
          <nav className="space-y-2">
            <a href="/dashboard" className="flex items-center gap-2 p-2 text-gray-600 hover:bg-gray-50 rounded-md">
              <RiDashboardLine className="h-5 w-5" />
              <span>Dashboard</span>
            </a>
            <a href="/empleados" className="flex items-center gap-2 p-2 text-gray-600 hover:bg-gray-50 rounded-md">
              <RiTeamLine className="h-5 w-5" />
              <span>Gestionar Empleados</span>
            </a>
            <a href="/platillos" className="flex items-center gap-2 p-2 text-gray-600 hover:bg-gray-50 rounded-md">
              <RiMenuLine className="h-5 w-5" />
              <span>Gestionar Platillos</span>
            </a>
            <a href="/branches" className="flex items-center gap-2 p-2 text-gray-600 bg-gray-100 rounded-md">
              <RiStore2Line className="h-5 w-5" />
              <span>Gestionar Sucursales</span>
            </a>
            <a href="/configuracion" className="flex items-center gap-2 p-2 text-gray-600 hover:bg-gray-50 rounded-md">
              <RiSettings4Line className="h-5 w-5" />
              <span>Configuración</span>
            </a>
            <button className="flex items-center gap-2 p-2 text-red-600 hover:bg-gray-50 rounded-md w-full mt-4">
              <RiLogoutBoxLine className="h-5 w-5" />
              <span>Cerrar Sesión</span>
            </button>
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <div className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Gestión de Sucursales</h1>
            <button className="bg-black text-white px-4 py-2 rounded-md flex items-center gap-2">
              <span>+</span> Nueva Sucursal
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-2">Sucursales</h2>
            <p className="text-gray-600 mb-6">Administra las sucursales de tu restaurante desde aquí.</p>

            <div className="flex justify-between mb-6">
              <input
                type="text"
                placeholder="Buscar sucursales..."
                className="w-96 px-4 py-2 border border-gray-300 rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="flex gap-4">
                <select 
                  className="px-4 py-2 border border-gray-300 rounded-md"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option>Todos los estados</option>
                  <option>Activa</option>
                  <option>En renovación</option>
                  <option>En construcción</option>
                </select>
                <button className="px-4 py-2 border border-gray-300 rounded-md">
                  Exportar
                </button>
              </div>
            </div>

            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3">Nombre</th>
                  <th className="text-left py-3">Dirección</th>
                  <th className="text-left py-3">Teléfono</th>
                  <th className="text-left py-3">Gerente</th>
                  <th className="text-left py-3">Estado</th>
                  <th className="text-left py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {branches.map((branch) => (
                  <tr key={branch.id} className="border-b">
                    <td className="py-3">{branch.name}</td>
                    <td className="py-3">{branch.address}</td>
                    <td className="py-3">{branch.phone}</td>
                    <td className="py-3">{branch.manager}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        branch.status === 'Activa' ? 'bg-green-100 text-green-800' :
                        branch.status === 'En renovación' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {branch.status}
                      </span>
                    </td>
                    // In the actions column of the table
                    <td className="py-3">
                      <div className="flex gap-2">
                        <Link 
                          to={`/kitchen/${branch.id}`} 
                          className="p-2 hover:bg-gray-100 rounded-md text-blue-600"
                        >
                          🍳
                        </Link>
                        <button className="p-2 hover:bg-gray-100 rounded-md">✏️</button>
                        <button className="p-2 hover:bg-gray-100 rounded-md">⋮</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Branches;