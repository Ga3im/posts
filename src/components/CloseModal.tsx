type ModalCloseType = {
  text: string;
  clickNo: () => void;
  clickYes: () => void;
};

export const ModalClose = ({ text, clickNo, clickYes }: ModalCloseType) => {
  return (
    <div className="fixed top-0 left-0 w-full z-10 h-full bg-black/50 flex justify-center items-center">
      <div className="rounded-[5px] bg-[#cecece] text-black p-[20px]">
        <p className="text-[20px]">{text}</p>
        <div className="flex justify-between items-center gap-[20px] pt-[20px]">
          <button
            onClick={clickYes}
            className="w-full rounded-[8px] bg-[green] text-white px-[10px]"
          >
            Да
          </button>
          <button
            onClick={clickNo}
            className="w-full rounded-[8px] bg-[red] text-white px-[10px]"
          >
            Нет
          </button>
        </div>
      </div>
    </div>
  );
};
