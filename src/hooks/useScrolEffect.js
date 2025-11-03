import { useEffect, useState } from 'react';

export const useScrollEffect = () => {
  const [transformed, setTransformed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Si hay un modal abierto, usar el scroll guardado
      const scrollY = document.body.dataset.scrollY 
        ? parseInt(document.body.dataset.scrollY) 
        : window.scrollY;
      
      if (scrollY > 0) {
        setTransformed(true);
      } else {
        setTransformed(false);
      }
    };

    // Ejecutar inmediatamente para detectar el estado inicial
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return transformed;
};