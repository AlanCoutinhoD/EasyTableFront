import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Kitchen = () => {
  // Add state for active filter
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Example orders data structure matching the image
  const exampleOrders = [
    {
      id: "004",
      table: "3",
      status: "new",
      priority: "Urgente",
      timeAgo: "5 minutos",
      items: [
        { name: "Pasta Carbonara", quantity: 1, prepTime: "15 min" },
        { name: "Brownie con Helado", quantity: 1, prepTime: "5 min" }
      ]
    },
    {
      id: "006",
      table: "10",
      status: "in_progress",
      priority: "Alta",
      timeAgo: "8 minutos",
      items: [
        { name: "Risotto de Champiñones", quantity: 1, prepTime: "18 min" },
        { name: "Ensalada César", quantity: 1, prepTime: "8 min" }
      ]
    },
    {
      id: "001",
      table: "5",
      status: "ready",
      priority: "Normal",
      timeAgo: "2 minutos",
      items: [
        { name: "Pasta Carbonara", quantity: 2, prepTime: "15 min" },
        { name: "Ensalada César", quantity: 1, prepTime: "8 min" },
        { name: "Tiramisú", quantity: 2, prepTime: "5 min" }
      ]
    }
  ];

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'Urgente':
        return 'bg-red-100 text-red-800';
      case 'Alta':
        return 'bg-yellow-100 text-yellow-800';
      case 'Normal':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const OrderCard = ({ order }) => (
    <div className="bg-white rounded-lg shadow p-4 relative overflow-hidden">
      {/* Add colored time indicator bar */}
      <div className={`absolute top-0 left-0 w-full h-1 ${
        parseInt(order.timeAgo) > 15 
          ? 'bg-red-500' 
          : parseInt(order.timeAgo) > 10 
            ? 'bg-yellow-500' 
            : 'bg-blue-500'
      }`}></div>

      <div className="flex justify-between items-start mb-4 mt-2">
        <div>
          <h3 className="font-medium">ORD-{order.id}</h3>
          <p className="text-gray-600">Mesa {order.table}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-sm ${getPriorityStyle(order.priority)}`}>
            {order.priority}
          </span>
        </div>
      </div>
      <div className="space-y-2 mb-4">
        {order.items.map((item, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span>{item.quantity}x {item.name}</span>
            <span className="text-gray-600">{item.prepTime}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-gray-500">Hace {order.timeAgo}</span>
        <div className="flex gap-2">
          <button className="text-gray-600 text-sm">Ver detalles</button>
          <button className="bg-black text-white px-4 py-1 rounded-md text-sm">
            Iniciar
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Easy Table - Cocina</h1>
        <div className="flex gap-4">
          <button className="px-4 py-2 rounded-md hover:bg-gray-100">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button className="px-4 py-2 rounded-md">
            Todas las...
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Nuevas Column */}
        <div>
          <h2 
            className="flex items-center gap-2 mb-4 cursor-pointer hover:opacity-80"
            onClick={() => setActiveFilter(activeFilter === 'new' ? 'all' : 'new')}
          >
            Nuevas
            <span className="bg-blue-500 text-white rounded-full px-2 py-0.5 text-sm">
              {exampleOrders.filter(order => order.status === 'new').length}
            </span>
          </h2>
          <div className="space-y-4">
            {exampleOrders
              .filter(order => activeFilter === 'all' || activeFilter === 'new')
              .filter(order => order.status === 'new')
              .map(order => (
                <OrderCard key={order.id} order={order} />
              ))}
          </div>
        </div>

        {/* En preparación Column */}
        <div>
          <h2 
            className="flex items-center gap-2 mb-4 cursor-pointer hover:opacity-80"
            onClick={() => setActiveFilter(activeFilter === 'in_progress' ? 'all' : 'in_progress')}
          >
            En preparación
            <span className="bg-yellow-500 text-white rounded-full px-2 py-0.5 text-sm">
              {exampleOrders.filter(order => order.status === 'in_progress').length}
            </span>
          </h2>
          <div className="space-y-4">
            {exampleOrders
              .filter(order => activeFilter === 'all' || activeFilter === 'in_progress')
              .filter(order => order.status === 'in_progress')
              .map(order => (
                <OrderCard key={order.id} order={order} />
              ))}
          </div>
        </div>

        {/* Listas Column */}
        <div>
          <h2 
            className="flex items-center gap-2 mb-4 cursor-pointer hover:opacity-80"
            onClick={() => setActiveFilter(activeFilter === 'ready' ? 'all' : 'ready')}
          >
            Listas
            <span className="bg-green-500 text-white rounded-full px-2 py-0.5 text-sm">
              {exampleOrders.filter(order => order.status === 'ready').length}
            </span>
          </h2>
          <div className="space-y-4">
            {exampleOrders
              .filter(order => activeFilter === 'all' || activeFilter === 'ready')
              .filter(order => order.status === 'ready')
              .map(order => (
                <OrderCard key={order.id} order={order} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Kitchen;