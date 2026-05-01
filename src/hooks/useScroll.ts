import { useEffect, useState, useRef } from "react";

export const useScrollDirection = () => {
  const [scrollDirection, setDirection] = useState({
    up: false,
    right: false,
    down: false,
    left: false,
  });

  const lastScroll = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      const newX = window.scrollX;
      const newY = window.scrollY;
      
      const diffY = newY - lastScroll.current.y;

      setDirection({
        up: diffY < -5, 
        down: diffY > 5,
        left: newX < lastScroll.current.x,
        right: newX > lastScroll.current.x,
      });
      lastScroll.current = { x: newX, y: newY };
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return { scrollDirection };
};
