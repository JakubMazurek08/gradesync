
import { useRouteError, Link } from 'react-router-dom';
import { useEffect } from 'react';

export const ErrorPage = () => {
  const error = useRouteError();
  
  useEffect(() => {
    console.error("Route error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-white">
      <div className="w-full max-w-md text-center px-4 py-8 relative">
        <div className="absolute inset-0 bg-purple-500/5 blur-xl rounded-full"></div>
        <div className="relative z-10">
          <h1 className="text-6xl font-bold text-purple-400 mb-6">404</h1>
          <h2 className="text-2xl font-medium mb-4">Strona nie znaleziona</h2>
          <p className="text-gray-300 mb-8">
            Przepraszamy, strona której szukasz nie istnieje.
          </p>
          <Link 
            to="/Dashboard" 
            className="inline-block bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-md px-8 py-3 text-lg transition-all duration-300"
          >
            Wróć do strony głównej
          </Link>
        </div>
      </div>
    </div>
  );
}