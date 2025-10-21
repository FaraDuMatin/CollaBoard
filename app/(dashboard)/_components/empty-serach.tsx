import Image from "next/image";

export const EmptySearch = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center ">
      <Image
        src="/empty-search.png"
        alt="No results found"
        width={140}
        height={140}
      />
      <h2 className="mt-4 text-2xl font-semibold">No results found</h2>
      <p className="text-muted-foreground text-sm mt-2">Try adjusting your search terms.</p>
    </div>
  );
};
