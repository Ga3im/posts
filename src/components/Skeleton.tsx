export const Skeleton = ({
  length = 10,
  column = 1,
}: {
  length?: number;
  column?: number;
}) => {
  // Базовые стили для элементов скелетона
  const skeletonBase = "bg-gradient-to-r from-white/5 via-white/10 to-white/5 bg-[length:200%_100%] animate-skeleton rounded-[20px]";

  return (
    <div
      className={`grid gap-[20px] p-[20px] mx-auto
        ${length === 1 ? 'p-[20px]' : ''}
        md:grid-cols-3 sm:grid-cols-2 grid-cols-1
      `}
      style={{
        gridTemplateColumns: column > 1 ? `repeat(${column}, 2fr)` : undefined,
      }}
    >
      {Array.from({ length }).map((_, i) => (
        <article 
          key={i} 
          className="p-4 border border-[#e0e0e0] rounded-lg bg-[#3b3b3b] flex flex-col gap-[12px]"
        >
          <h3 className={`${skeletonBase} w-[150px] h-[30px]`}></h3>
          
          <p className={`${skeletonBase} w-full h-[50px]`}></p>
        </article>
      ))}
    </div>
  );
};