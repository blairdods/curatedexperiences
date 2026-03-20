interface ImageGridProps {
  images: { src: string; alt: string }[];
  columns?: 2 | 3;
}

export function ImageGrid({ images, columns = 3 }: ImageGridProps) {
  return (
    <div
      className={`grid gap-3 sm:gap-4 ${
        columns === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-2 sm:grid-cols-3"
      }`}
    >
      {images.map((img, i) => (
        <div
          key={i}
          className={`relative overflow-hidden rounded-lg bg-warm-100 ${
            // Make the first image span 2 rows for visual interest
            i === 0 && columns === 3 ? "row-span-2 aspect-[3/4]" : "aspect-[4/3]"
          }`}
        >
          <img
            src={img.src}
            alt={img.alt}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>
      ))}
    </div>
  );
}
