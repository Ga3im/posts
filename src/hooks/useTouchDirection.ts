import { useState } from "react";

export const useTouchDirection = () => {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number }>(null);
  const [direction, setDirection] = useState<{
    up: boolean;
    right: boolean;
    down: boolean;
    left: boolean;
  } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart({
      ...touchStart,
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
    setDirection(null);
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    let horizontal = touchStart.x - touchEndX;
    let vertical = touchStart.y - touchEndY;

    if (horizontal > 0 && Math.abs(horizontal) > 100) {
      setDirection({ ...direction, left: true });
    } else {
      setDirection({ ...direction, right: true });
    }

    if (vertical > 0 && Math.abs(vertical) > 100) {
      setDirection({ ...direction, up: true });
    } else {
      setDirection({ ...direction, down: true });
    }
    setTouchStart(null);
  };
  return { direction, handleTouchStart, handleTouchEnd };
};
