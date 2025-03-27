import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Kitchen = () => {
  const { branchId } = useParams();
  const [orders, setOrders] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const wsRef = useRef(null);

  useEffect(() => {
    fetchOrders();
    
    // Only create WebSocket if it doesn't exist
    if (!wsRef.current) {
      const ws = new WebSocket('ws://127.0.0.1:3000');
      wsRef.current = ws;

      ws.onopen = () => {
        if (ws.readyState === WebSocket.OPEN) {
          toast.success('Connected to kitchen service', {
            duration: 2000,
            position: 'top-right',
          });
          
          ws.send(JSON.stringify({
            type: 'kitchen_connect',
            branchId: branchId
          }));
        }
      };

      ws.onmessage = (event) => {
        try {
          console.log('WebSocket message received:', event.data);
          const data = JSON.parse(event.data);
          console.log('Parsed WebSocket data:', data);
          
          if (data.type === 'new_order' && data.data.branch_id.toString() === branchId) {
            // Process new order only if it belongs to current branch
            const processedOrder = processOrders([data.data])[0];
            setOrders(prevOrders => [...prevOrders, processedOrder]);
            
            toast.success(`Nueva orden #${processedOrder.id} - Mesa ${processedOrder.table}`, {
              duration: 3000,
              position: 'top-right',
            });
          } else if (data.type === 'orders_update') {
            // Handle full orders update
            const processedOrders = processOrders(data.orders);
            setOrders(processedOrders);
          }
        } catch (error) {
          console.error('Error processing WebSocket message:', error);
          toast(event.data, {
            duration: 3000,
            position: 'top-right',
            style: { background: '#333', color: '#fff' },
          });
        }
      };

      ws.onclose = () => {
        toast.error('Connection lost', {
          duration: 3000,
          position: 'top-right',
        });
        wsRef.current = null;
      };
    }

    // Cleanup function
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [branchId]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/orders/branch/${branchId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const processedOrders = processOrders(response.data);
      setOrders(processedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const getPriority = (created_at) => {
    const minutes = getMinutesDifference(created_at);
    if (minutes > 30) return 'Urgente';
    if (minutes > 15) return 'Alta';
    return 'Normal';
  };

  const getMinutesDifference = (created_at) => {
    const orderDate = new Date(created_at);
    const now = new Date();
    return Math.floor((now - orderDate) / (1000 * 60));
  };

  const getTimeAgo = (created_at) => {
    const minutes = getMinutesDifference(created_at);
    return `${minutes} minutos`;
  };

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

  const processOrders = (rawOrders) => {
    return rawOrders.map(order => ({
      id: order.id.toString(),
      order_id: order.id,
      table: order.tableNumber,
      status: order.status === 'pending' ? 'new' : order.status,
      priority: getPriority(order.created_at),
      timeAgo: getTimeAgo(order.created_at),
      total_amount: order.total_amount,
      payment_status: order.payment_status,
      payment_method: order.payment_method,
      created_at: order.created_at,
      items: order.items.map(item => ({
        name: item.product_name,
        description: item.description,
        quantity: item.quantity,
        price: item.price,
        total: item.total
      }))
    }));
  };

  // Add new state for selected order
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // Update the OrderCard component's button
  const handleStatusUpdate = async (orderId) => {
      try {
        const token = localStorage.getItem('token');
        await axios.patch(
          `http://localhost:5000/api/orders/${orderId}`,
          { status: 'prepared' },
          { headers: { Authorization: `Bearer ${token}` } }
        );
  
        // Update local state to remove the order
        setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
        
        toast.success('Orden marcada como preparada');
      } catch (error) {
        console.error('Error updating order status:', error);
        toast.error('Error al actualizar el estado de la orden');
      }
    };
  
    const OrderCard = ({ order }) => (
      <div className="bg-white rounded-lg shadow p-4 relative overflow-hidden">
        {/* Time indicator bar remains the same */}
        <div className={`absolute top-0 left-0 w-full h-1 ${
          parseInt(order.timeAgo) > 15 
            ? 'bg-red-500' 
            : parseInt(order.timeAgo) > 10 
              ? 'bg-yellow-500' 
              : 'bg-blue-500'
        }`}></div>
    
        <div className="flex justify-between items-start mb-4 mt-2">
          <div>
            <h3 className="font-medium">Orden #{order.id}</h3>
            <p className="text-gray-600">Mesa {order.table}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className={`px-2 py-1 rounded-full text-sm ${getPriorityStyle(order.priority)}`}>
              {order.priority}
            </span>
            <span className="text-sm font-medium">
              Total: ${parseFloat(order.total_amount).toFixed(2)}
            </span>
          </div>
        </div>
    
        <div className="space-y-2 mb-4">
          <div className="bg-gray-50 p-3 rounded-md">
            <h4 className="font-medium mb-2">Detalles del Pedido:</h4>
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm py-1 border-b last:border-0">
                <div>
                  <span className="font-medium">{item.quantity}x</span> {item.name}
                  <p className="text-xs text-gray-500">{item.description}</p>
                </div>
                <div className="text-right">
                  <p>${parseFloat(item.price).toFixed(2)}</p>
                  <p className="text-xs text-gray-500">
                    Subtotal: ${parseFloat(item.total).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
    
        <div className="flex justify-between items-center mt-4">
          <div className="flex flex-col text-sm">
            <span className="text-gray-500">Creado hace {order.timeAgo}</span>
            <span className="text-xs text-gray-400">
              {new Date(order.created_at).toLocaleString()}
            </span>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setSelectedOrder(order)}
              className="text-gray-600 text-sm px-3 py-1 border rounded-md hover:bg-gray-50"
            >
              Ver detalles
            </button>
            <button 
              onClick={() => handleStatusUpdate(order.id)}
              className="bg-black text-white px-4 py-1 rounded-md text-sm hover:bg-gray-800"
            >
              {order.status === 'pending' ? 'Iniciar' : 
               order.status === 'in_progress' ? 'Completar' : 'Entregar'}
            </button>
          </div>
        </div>
    
        <div className="mt-3 pt-3 border-t">
          <div className="flex justify-between text-sm">
            <span>Estado del pago:</span>
            <span className={`${
              order.payment_status === 'pending' ? 'text-yellow-600' : 'text-green-600'
            }`}>
              {order.payment_status === 'pending' ? 'Pendiente' : 'Pagado'}
            </span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span>Método de pago:</span>
            <span className="capitalize">{order.payment_method}</span>
          </div>
        </div>
      </div>
    );

    // Add the DetailedOrderView component
    // Update the DetailedOrderView component
    const DetailedOrderView = ({ order, onClose }) => {
      if (!order) return null;
    
      return (
        <div className="fixed inset-y-0 right-0 w-2/5 bg-white shadow-xl p-8 overflow-y-auto border-l">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Orden #{order.id}</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-2"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
    
          <div className="space-y-8">
            {/* Order info section */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-2xl font-medium">Mesa {order.table}</p>
                  <p className="text-lg text-gray-600 mt-2">Creado hace {order.timeAgo}</p>
                </div>
                <span className={`px-4 py-2 rounded-full text-lg ${getPriorityStyle(order.priority)}`}>
                  {order.priority}
                </span>
              </div>
            </div>
    
            {/* Products section */}
            <div>
              <h3 className="text-2xl font-medium mb-4">Productos</h3>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="bg-gray-50 p-6 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-xl font-medium">{item.name}</p>
                        <p className="text-lg text-gray-600 mt-2">{item.description}</p>
                        <p className="text-lg font-medium mt-3">
                          Cantidad: <span className="text-blue-600">{item.quantity}</span>
                        </p>
                      </div>
                      <div className="text-right ml-6">
                        <p className="text-lg font-medium">${parseFloat(item.price).toFixed(2)}</p>
                        <p className="text-lg text-gray-600 mt-2">
                          Total: <span className="font-medium">${parseFloat(item.total).toFixed(2)}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
    
            {/* Total section */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex justify-between items-center text-2xl font-medium">
                <span>Total del Pedido:</span>
                <span className="text-blue-600">${parseFloat(order.total_amount).toFixed(2)}</span>
              </div>
            </div>
    
            {/* Payment info section */}
            <div className="bg-gray-50 p-6 rounded-xl space-y-4">
              <div className="flex justify-between text-lg">
                <span>Estado del pago:</span>
                <span className={`font-medium ${
                  order.payment_status === 'pending' ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {order.payment_status === 'pending' ? 'Pendiente' : 'Pagado'}
                </span>
              </div>
              <div className="flex justify-between text-lg">
                <span>Método de pago:</span>
                <span className="capitalize font-medium">{order.payment_method}</span>
              </div>
            </div>
          </div>
        </div>
      );
    };
    
    return (
      <>
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
  
          <div className={`grid gap-6 ${selectedOrder ? 'grid-cols-2' : 'grid-cols-3'}`}>
            {/* Nuevas Column */}
            <div>
              <h2 className="flex items-center gap-2 mb-4">
                Nuevas
                <span className="bg-blue-500 text-white rounded-full px-2 py-0.5 text-sm">
                  {orders.filter(order => order.status === 'new').length}
                </span>
              </h2>
              <div className="space-y-4">
                {orders
                  .filter(order => activeFilter === 'all' || activeFilter === 'new')
                  .filter(order => order.status === 'new')
                  .map(order => (
                    <OrderCard key={order.id} order={order} />
                  ))}
              </div>
            </div>
  
            {/* En preparación Column */}
            <div>
              <h2 className="flex items-center gap-2 mb-4">
                En preparación
                <span className="bg-yellow-500 text-white rounded-full px-2 py-0.5 text-sm">
                  {orders.filter(order => order.status === 'in_progress').length}
                </span>
              </h2>
              <div className="space-y-4">
                {orders
                  .filter(order => activeFilter === 'all' || activeFilter === 'in_progress')
                  .filter(order => order.status === 'in_progress')
                  .map(order => (
                    <OrderCard key={order.id} order={order} />
                  ))}
              </div>
            </div>
  
            {/* Listas Column */}
            <div>
              <h2 className="flex items-center gap-2 mb-4">
                Listas
                <span className="bg-green-500 text-white rounded-full px-2 py-0.5 text-sm">
                  {orders.filter(order => order.status === 'ready').length}
                </span>
              </h2>
              <div className="space-y-4">
                {orders
                  .filter(order => activeFilter === 'all' || activeFilter === 'ready')
                  .filter(order => order.status === 'ready')
                  .map(order => (
                    <OrderCard key={order.id} order={order} />
                  ))}
              </div>
            </div>
          </div>
        </div>
        
        <DetailedOrderView 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
        />
      </>
    );
};

export default Kitchen;