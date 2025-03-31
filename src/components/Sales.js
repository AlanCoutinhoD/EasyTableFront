import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RiRestaurantLine, RiDashboardLine, RiTeamLine, RiMenuLine, RiStore2Line, RiLogoutBoxLine } from 'react-icons/ri';
import { BsFileEarmarkText } from 'react-icons/bs';
import axios from 'axios';
import OrderTicket from './OrderTicket';
import ReactDOMServer from 'react-dom/server';
import { toast } from 'react-hot-toast';

const Sales = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [orders, setOrders] = useState([]);
  const [paidOrders, setPaidOrders] = useState([]); // Add this new state

  useEffect(() => {
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

    fetchBranches();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!selectedBranch) return;
      
      try {
        const token = localStorage.getItem('token');
        const ordersResponse = await axios.get(
          `http://192.168.56.1:5000/api/orders/branch/${selectedBranch}/delivered`,
          {
            headers: { Authorization: `Bearer ${token}` },
            validateStatus: function (status) {
              return status === 200 || status === 404;
            }
          }
        );
        
        setOrders(ordersResponse.status === 200 ? ordersResponse.data : []);
      } catch (error) {
        setOrders([]);
      }
    };

    fetchOrders();
  }, [selectedBranch]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handlePrintTicket = (order) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Ticket #${order.id}</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <style>
            @media print {
              body { margin: 0; padding: 0; }
              @page { size: 80mm 297mm; margin: 0; }
            }
          </style>
        </head>
        <body>
    `);
    
    const ticket = <OrderTicket order={order} />;
    printWindow.document.write(ReactDOMServer.renderToString(ticket));
    
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const handleDailyReport = async () => {
    if (!selectedBranch) {
      toast.error('Por favor seleccione una sucursal');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const today = new Date().toISOString().split('T')[0];
      
      const response = await axios.get(`http://192.168.56.1:5000/api/orders/branch/${selectedBranch}/payment_status/pagado`, {
        headers: { Authorization: `Bearer ${token}` },
        validateStatus: function (status) {
          return status === 200 || status === 404;
        }
      });

      const todayOrders = (response.status === 200 ? response.data : []).filter(order => {
        const orderDate = new Date(order.created_at).toISOString().split('T')[0];
        return orderDate === today;
      });

      if (todayOrders.length === 0) {
        toast.info('No hay ventas registradas para el día de hoy');
        return;
      }

      const dailyTotal = todayOrders.reduce((sum, order) => sum + parseFloat(order.total_amount), 0);
      const totalOrders = todayOrders.length;

      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>Reporte de Ventas Diario</title>
            <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
            <style>
              @media print {
                body { margin: 20px; }
              }
            </style>
          </head>
          <body class="p-8">
            <div class="max-w-2xl mx-auto">
              <h1 class="text-2xl font-bold mb-4">Reporte de Ventas Diario</h1>
              <p class="mb-2">Fecha: ${new Date().toLocaleDateString('es-ES')}</p>
              <p class="mb-4">Sucursal: ${branches.find(b => b.id === parseInt(selectedBranch))?.name}</p>
              
              <div class="mb-6">
                <h2 class="text-xl font-semibold mb-2">Resumen</h2>
                <p>Total de Ventas: $${dailyTotal.toFixed(2)}</p>
                <p>Número de Órdenes: ${totalOrders}</p>
              </div>

              <table class="w-full mb-6">
                <thead>
                  <tr class="border-b">
                    <th class="text-left py-2">Orden ID</th>
                    <th class="text-left py-2">Mesa</th>
                    <th class="text-left py-2">Hora</th>
                    <th class="text-right py-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${todayOrders.map(order => `
                    <tr class="border-b">
                      <td class="py-2">ORD-${order.id}</td>
                      <td class="py-2">Mesa ${order.tableNumber}</td>
                      <td class="py-2">${new Date(order.created_at).toLocaleTimeString()}</td>
                      <td class="py-2 text-right">$${parseFloat(order.total_amount).toFixed(2)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>

              <div class="text-center mt-8 text-sm">
                <p>Reporte generado el ${new Date().toLocaleString('es-ES')}</p>
              </div>
            </div>
          </body>
        </html>
      `);
      
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Error al generar el reporte');
    }
  };

  const handleMarkAsPaid = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://192.168.56.1:5000/api/orders/${orderId}`,
        { payment_status: "pagado" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success('Orden marcada como pagada');
      
      // Just fetch the updated orders
      const ordersResponse = await axios.get(
        `http://192.168.56.1:5000/api/orders/branch/${selectedBranch}/delivered`,
        {
          headers: { Authorization: `Bearer ${token}` },
          validateStatus: function (status) {
            return status === 200 || status === 404;
          }
        }
      );
      
      setOrders(ordersResponse.status === 200 ? ordersResponse.data : []);
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Error al actualizar la orden');
    }
  };

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
          <Link to="/dashboard" className="flex items-center gap-2 p-2 text-gray-600 hover:bg-gray-50 rounded-md">
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
          <Link to="/branches" className="flex items-center gap-2 p-2 text-gray-600 hover:bg-gray-50 rounded-md">
            <RiStore2Line className="h-5 w-5" />
            <span>Gestionar Sucursales</span>
          </Link>
          <Link to="/ventas" className="flex items-center gap-2 p-2 bg-gray-100 rounded-md">
            <BsFileEarmarkText className="h-5 w-5" />
            <span>Ventas</span>
          </Link>
          <button className="flex items-center gap-2 p-2 text-red-600 hover:bg-gray-50 rounded-md w-full">
            <RiLogoutBoxLine className="h-5 w-5" />
            <span>Cerrar Sesión</span>
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Historial de Ventas</h1>
          <button 
            onClick={handleDailyReport}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md"
          >
            <BsFileEarmarkText className="h-5 w-5" />
            Reporte de Ventas
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">Filtros</h2>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Buscar por orden, mesa..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2 border border-gray-300 rounded-md min-w-[200px]"
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
            >
              <option value="">Seleccionar Sucursal</option>
              {branches.map(branch => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
            <input
              type="date"
              className="px-4 py-2 border border-gray-300 rounded-md"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3">Orden ID</th>
                <th className="text-left py-3">Mesa</th>
                <th className="text-left py-3">Fecha</th>
                <th className="text-left py-3">Total</th>
                <th className="text-left py-3">Estado Pago</th>
                <th className="text-left py-3">Método Pago</th>
                <th className="text-left py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {[...orders, ...paidOrders].map((order) => (
                <tr key={order.id} className="border-b">
                  <td className="py-3">ORD-{order.id}</td>
                  <td className="py-3">Mesa {order.tableNumber}</td>
                  <td className="py-3">{formatDate(order.created_at)}</td>
                  <td className="py-3">${parseFloat(order.total_amount).toFixed(2)}</td>
                  <td className="py-3">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      order.payment_status === 'pagado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.payment_status === 'pagado' ? 'Pagado' : 'Pendiente'}
                    </span>
                  </td>
                  <td className="py-3 capitalize">{order.payment_method}</td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handlePrintTicket(order)}
                        className="flex items-center gap-2 px-3 py-1 border rounded-md hover:bg-gray-50"
                        title="Imprimir ticket"
                      >
                        <BsFileEarmarkText className="h-4 w-4" />
                        Ticket
                      </button>
                      {order.payment_status !== 'pagado' && (
                        <button 
                          onClick={() => handleMarkAsPaid(order.id)}
                          className="flex items-center gap-2 px-3 py-1 border rounded-md hover:bg-gray-50 text-green-600 hover:bg-green-50"
                          title="Marcar como pagado"
                        >
                          Marcar Pagado
                        </button>
                      )}
                    </div>
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

export default Sales;