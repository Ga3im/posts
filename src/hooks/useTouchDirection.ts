import { useState } from "react";

interface Direction {
  up: boolean;
  right: boolean;
  down: boolean;
  left: boolean;
}

export const useTouchDirection = () => {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(
    null
  );
  const [direction, setDirection] = useState<Direction | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
    setDirection(null);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const horizontal = touchStart.x - touchEndX;
    const vertical = touchStart.y - touchEndY;

    const threshold = 100;

    const isLeft = horizontal > threshold;
    const isRight = horizontal < -threshold;
    const isUp = vertical > threshold;
    const isDown = vertical < -threshold;

    if (isLeft || isRight || isUp || isDown) {
      setDirection({
        left: isLeft,
        right: isRight,
        up: isUp,
        down: isDown,
      });
    }

    setTouchStart(null);
  };

  return { direction, handleTouchStart, handleTouchEnd };
};
