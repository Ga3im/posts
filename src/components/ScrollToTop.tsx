import { useEffect, useState } from "react";

type ScrollToTopType = {
  onClick: () => void;
};

export const handleToTopBtn = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
};

export const ScrollToTop = ({ onClick }: ScrollToTopType) => {
  const [isScroll, setIsScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setIsScroll(true);
      } else {
        setIsScroll(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {isScroll && (
        <button
          onClick={onClick}
          className="fixed cursor-pointer bottom-[20px] right-[10px] rounded-full bg-black px-[5px] shadow-[0px_0px_10px_-3px]"
        >
          Наверх
        </button>
      )}
    </>
  );
};
