import Image from "next/image";

export const EmptyFavorites = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center ">
      <Image
        src="/empty-fav.png"
        alt="No favorites found"
        width={140}
        height={140}
      />
      <h2 className="mt-4 text-2xl font-semibold">No favorites found</h2>
      <p className="text-muted-foreground text-sm mt-2">Try adding some favorites.</p>
    </div>
  );
};

     