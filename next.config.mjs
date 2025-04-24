/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true, // Modo estricto de React para detectar errores en desarrollo
    swcMinify: true, // Optimización con SWC para mejorar rendimiento
    output: 'standalone',
    
    async rewrites() {
      return [
        {
          source: "/api/recepciones",
          destination: "http://192.168.1.78:5000/recepciones",
        },
        {
          source: "/api/recepciones/:folio/productos",
          destination: "http://192.168.1.78:5000/recepciones/:folio/productos",
        },
      ];
    },
  
    async headers() {
      return [
        {
          source: "/api/:path*", 
          headers: [
            {
              key: "Access-Control-Allow-Origin",
              value: "*", // Permite llamadas desde cualquier origen (útil si hay problemas de CORS)
            },
            {
              key: "Access-Control-Allow-Methods",
              value: "GET, POST, PUT, DELETE, OPTIONS",
            },
            {
              key: "Access-Control-Allow-Headers",
              value: "Content-Type, Authorization",
            },
          ],
        },
      ];
    },
  };
  
  export default nextConfig;
  