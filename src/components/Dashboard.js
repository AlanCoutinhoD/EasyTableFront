import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RiRestaurantLine, RiDashboardLine, RiTeamLine, RiMenuLine, RiStore2Line, RiSettings4Line, RiLogoutBoxLine } from 'react-icons/ri';
import axios from 'axios';

const Dashboard = () => {
  const [business, setBusiness] = useState(null);
  const [error, setError] = useState(null);
 
  const [activeTab, setActiveTab] = useState('negocio');
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/businesses', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setBusiness(response.data[0]);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchBusinessData();
  }, []);

  useEffect(() => {
    const fetchBranches = async () => {
      if (activeTab === 'sucursales') {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get('http://localhost:5000/api/branches', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setBranches(response.data);
        } catch (err) {
          console.error('Error fetching branches:', err);
        }
      }
    };

    fetchBranches();
  }, [activeTab]);

  return (
    <div className="min-h-screen flex bg-gray-50">
     
      <aside className="w-64 bg-white border-r">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <RiRestaurantLine className="h-6 w-6" />
            <span className="text-xl font-bold">Easy Table</span>
          </div>
        </div>
        <nav className="p-4 space-y-2">
          <Link to="/dashboard" className="flex items-center gap-2 p-2 bg-gray-100 rounded-md">
            <RiDashboardLine className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <Link to="/empleados" className="flex items-center gap-2 p-2 text-gray-600 hover:bg-gray-50 rounded-md">
            <RiTeamLine className="h-5 w-5" />
            <span>Gestionar Empleados</span>
          </Link>
          
          <Link to="/platillos" className="flex items-center gap-2 p-2 text-gray-600 hover:bg-gray-50 rounded-md">
            <RiMenuLine className="h-5 w-5" />
            <span>Gestionar Platillos</span>
          </Link>
          <Link to="/sucursales" className="flex items-center gap-2 p-2 text-gray-600 hover:bg-gray-50 rounded-md">
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
        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-gray-600">Ingresos Totales</h3>
              <span className="text-2xl">$</span>
            </div>
            <p className="text-3xl font-bold mb-2">$45,231.89</p>
            <p className="text-sm text-green-600">+20.1% respecto al mes anterior</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-gray-600">Reservaciones</h3>
              <span className="text-2xl">📅</span>
            </div>
            <p className="text-3xl font-bold mb-2">+573</p>
            <p className="text-sm text-green-600">+201 respecto al mes anterior</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-gray-600">Ventas</h3>
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-3xl font-bold mb-2">+1,234</p>
            <p className="text-sm text-green-600">+19% respecto al mes anterior</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-gray-600">Clientes Activos</h3>
              <span className="text-2xl">👥</span>
            </div>
            <p className="text-3xl font-bold mb-2">+12,234</p>
            <p className="text-sm text-green-600">+573 respecto al mes anterior</p>
          </div>
        </div>

        {/* Tabs */}
        
        <div className="mb-8">
          <nav className="flex gap-4 border-b">
            <button 
              className={`px-4 py-2 text-sm font-medium ${activeTab === 'negocio' ? 'border-b-2 border-black -mb-px' : 'text-gray-600 hover:text-black'}`}
              onClick={() => setActiveTab('negocio')}
            >
              Negocio
            </button>
            <button 
              className={`px-4 py-2 text-sm font-medium ${activeTab === 'sucursales' ? 'border-b-2 border-black -mb-px' : 'text-gray-600 hover:text-black'}`}
              onClick={() => setActiveTab('sucursales')}
            >
              Sucursales
            </button>
            <button 
              className={`px-4 py-2 text-sm font-medium ${activeTab === 'reportes' ? 'border-b-2 border-black -mb-px' : 'text-gray-600 hover:text-black'}`}
              onClick={() => setActiveTab('reportes')}
            >
              Reportes
            </button>
          </nav>
        </div>

       
        <div className="grid grid-cols-3 gap-8">
          {activeTab === 'negocio' ? (
            <>
              <div className="col-span-2 bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-bold mb-6">Información del Negocio</h2>
                {business ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Nombre del Negocio</h3>
                      <p className="text-gray-700">{business.name}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Descripción</h3>
                      <p className="text-gray-700">{business.description}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Fecha de Creación</h3>
                      <p className="text-gray-700">
                        {new Date(business.created_at).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                    <RiStore2Line className="w-16 h-16 mb-4" />
                    <p className="text-lg">Aún no tienes un negocio registrado</p>
                  </div>
                )}
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                {/* Top Dishes section remains the same */}
              </div>
            </>
          ) : activeTab === 'sucursales' ? (
            <div className="col-span-3">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-bold mb-6">Sucursales</h2>
                {branches.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {branches.map((branch) => (
                      <div key={branch.id} className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-3">{branch.name}</h3>
                        <div className="space-y-2 text-gray-600">
                          <p className="flex items-center gap-2">
                            <span className="font-medium">Dirección:</span>
                            {branch.address}
                          </p>
                          <p className="flex items-center gap-2">
                            <span className="font-medium">Teléfono:</span>
                            {branch.phone}
                          </p>
                          <p className="flex items-center gap-2">
                            <span className="font-medium">Fecha de creación:</span>
                            {new Date(branch.created_at).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <RiStore2Line className="w-16 h-16 mx-auto mb-4" />
                    <p>No hay sucursales registradas</p>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );  
};    

export default Dashboard;