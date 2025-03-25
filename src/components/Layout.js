import React from 'react';

const Layout = ({ children }) => {
  return (
    <html lang="es">
      <head>
        <title>Easy Table - Gestión de restaurantes</title>
        <meta name="description" content="Plataforma de gestión de restaurantes que simplifica reservas, mesas y personal" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-inter">
        {children}
      </body>
    </html>
  );
};

export default Layout;