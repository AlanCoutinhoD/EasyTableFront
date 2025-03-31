import React from 'react';

const OrderTicket = ({ order }) => {
  const printTicket = () => {
    window.print();
  };

  return (
    <div className="p-4 max-w-[300px] mx-auto bg-white print:block">
      <div className="text-center mb-4">
        <h2 className="font-bold text-xl">Easy Table</h2>
        <p className="text-sm">Ticket de Venta</p>
        <p className="text-sm">Orden #{order.id}</p>
        <p className="text-sm">Mesa {order.tableNumber}</p>
        <p className="text-xs">{new Date(order.created_at).toLocaleString()}</p>
      </div>

      <div className="border-t border-b py-2 my-2">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-1">Producto</th>
              <th className="text-center py-1">Cant</th>
              <th className="text-right py-1">Precio</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, index) => (
              <tr key={index}>
                <td className="text-left py-1">{item.product_name}</td>
                <td className="text-center py-1">{item.quantity}</td>
                <td className="text-right py-1">${parseFloat(item.price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <div className="flex justify-between font-bold">
          <span>Total:</span>
          <span>${parseFloat(order.total_amount).toFixed(2)}</span>
        </div>
        <div className="text-sm mt-2">
          <p>Método de pago: {order.payment_method}</p>
          <p>Estado: {order.payment_status === 'paid' ? 'Pagado' : 'Pendiente'}</p>
        </div>
      </div>

      <div className="text-center mt-6 text-xs">
        <p>¡Gracias por su preferencia!</p>
      </div>
    </div>
  );
};

export default OrderTicket;