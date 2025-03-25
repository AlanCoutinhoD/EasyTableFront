import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

// Add useParams at the top
const Menu = () => {
  const { businessId, tableNumber, branchId } = useParams();
  
  const [menuData, setMenuData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [orderItems, setOrderItems] = useState([]);

 
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/public/menu/business/${businessId}`);
        setMenuData(response.data);
      } catch (err) {
        console.error('Error fetching menu:', err);
      }
    };

    fetchMenu();
  }, [businessId]);

  // Add the missing categories and menuSections definitions
  const categories = [
    'Todos',
    'Populares',
    'Vegetarianos',
    'Veganos',
    'Sin Gluten'
  ];

  const menuSections = [
    { id: 'platos-principales', title: 'Platos Principales', active: true },
    { id: 'entrantes', title: 'Entrantes', active: false },
    { id: 'postres', title: 'Postres', active: false }
  ];

  // Add function to handle adding items to order
  const addToOrder = (dish) => {
    const existingItem = orderItems.find(item => item.id === dish.id);
    if (existingItem) {
      setOrderItems(orderItems.map(item =>
        item.id === dish.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setOrderItems([...orderItems, { ...dish, quantity: 1 }]);
    }
  };

  // Add function to handle removing items from order
  const removeFromOrder = (dishId) => {
    setOrderItems(orderItems.filter(item => item.id !== dishId));
  };

  // Add function to update quantity
  const updateQuantity = (dishId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromOrder(dishId);
      return;
    }
    setOrderItems(orderItems.map(item =>
      item.id === dishId ? { ...item, quantity: newQuantity } : item
    ));
  };

  // Add function to handle order submission
  const handleOrderSubmit = async () => {
    try {
      const orderData = {
        total_amount: Number(orderItems.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0).toFixed(2)),
        payment_method: "cash",
        branch_id: Number(branchId),
        tableNumber: tableNumber, 
        items: orderItems.map(item => ({
          product_id: Number(item.id),
          quantity: Number(item.quantity),
          price: Number(parseFloat(item.price).toFixed(2))
        }))
      };

      console.log('Sending order data:', orderData);

      const response = await axios.post('http://localhost:5000/api/public/orders', orderData);
      
      if (response.status === 201) {
        setOrderItems([]);
        alert('¡Pedido realizado con éxito!');
      } else {
        alert('Error al realizar el pedido');
      }
    } catch (err) {
      console.error('Error submitting order:', err.response?.data || err.message);
      alert('Error al realizar el pedido');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Main menu content */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-2">Nuestro Menú</h1>
        <p className="text-gray-600 mb-6">Explora nuestra selección de deliciosos platillos</p>

        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Buscar platillos..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-4 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-md ${
                activeCategory === category
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="flex gap-4 border-b mb-8">
          {menuSections.map((section) => (
            <button
              key={section.id}
              className={`px-4 py-2 ${
                section.active
                  ? 'border-b-2 border-black -mb-px font-medium'
                  : 'text-gray-500'
              }`}
            >
              {section.title}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuData.map((category) => 
            category.products.map((dish) => (
              <div key={dish.id} className="bg-white rounded-lg overflow-hidden shadow-sm">
                <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                  <img
                    src={dish.image_url}
                    alt={dish.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300';
                    }}
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">{dish.name}</h3>
                    <span className="text-lg font-bold">${parseFloat(dish.price).toFixed(2)}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{dish.description}</p>
                  <div className="flex justify-between items-center">
                    {category.category.name && (
                      <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        {category.category.name}
                      </span>
                    )}
                    <button
                      onClick={() => addToOrder(dish)}
                      className="bg-black text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800"
                    >
                      Añadir al Pedido
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Order sidebar */}
      <div className="w-96 bg-white border-l p-6 sticky top-0 h-screen overflow-y-auto">
        <h2 className="text-xl font-bold mb-6">Tu Pedido</h2>
        {orderItems.length === 0 ? (
          <p className="text-gray-500">No hay items en tu pedido</p>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {orderItems.map((item) => (
                <div key={item.id} className="flex items-start justify-between border-b pb-4">
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-600">${parseFloat(item.price).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-2 py-1 bg-gray-100 rounded"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2 py-1 bg-gray-100 rounded"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFromOrder(item.id)}
                      className="text-red-500 ml-2"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between font-bold mb-4">
                <span>Total:</span>
                <span>
                  ${orderItems.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0).toFixed(2)}
                </span>
              </div>
            
              <button 
                onClick={handleOrderSubmit}
                className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800"
              >
                Realizar Pedido
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Menu;