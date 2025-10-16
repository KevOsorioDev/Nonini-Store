import { useEffect, useState } from 'react';

export const useScrollEffect = () => {
  const [transformed, setTransformed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setTransformed(true);
      } else {
        setTransformed(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return transformed;
};