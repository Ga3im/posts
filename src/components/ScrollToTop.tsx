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
          className="fixed cursor-pointer bottom-[70px] right-[18px] rounded-full bg-black w-[25px] h-[25px] shadow-[0px_0px_10px_-3px]"
        >
          &#8593;
        </button>
      )}
    </>
  );
};
