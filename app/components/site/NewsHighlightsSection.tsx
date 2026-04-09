import Image from "next/image";

export type NewsHighlightImagePublic = {
  imageMimeType: string;
  imageBase64: string;
};

export type NewsHighlightPublic = {
  id: string;
  images: NewsHighlightImagePublic[];
};

function NewsCardMosaic({ images }: { images: NewsHighlightImagePublic[] }) {
  if (images.length === 0) return null;

  const dataUrl = (img: NewsHighlightImagePublic) =>
    `data:${img.imageMimeType};base64,${img.imageBase64}`;

  if (images.length === 1) {
    const img = images[0];
    return (
      <div className="relative w-full bg-slate-100">
        <Image
          src={dataUrl(img)}
          alt=""
          width={1200}
          height={900}
          unoptimized
          className="h-auto w-full object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1">
      {images.map((img, i) => {
        const spanTwo = images.length === 3 && i === 2;
        return (
          <div
            key={i}
            className={`relative bg-white ${
              spanTwo ? "col-span-2 aspect-[2/1]" : "aspect-square"
            }`}
          >
            <Image
              src={dataUrl(img)}
              alt=""
              fill
              unoptimized
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 200px"
            />
          </div>
        );
      })}
    </div>
  );
}

export function NewsHighlightsSection({ items }: { items: NewsHighlightPublic[] }) {
  const visible = items.filter((h) => h.images.length > 0);

  if (visible.length === 0) {
    return (
      <p className="text-center text-slate-500">
        News and highlights will appear here once image posts are added in the admin panel.
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {visible.map((item) => (
        <article
          key={item.id}
          className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
        >
          <NewsCardMosaic images={item.images} />
        </article>
      ))}
    </div>
  );
}
