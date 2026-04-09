import Image from "next/image";

export type CollaborationPublic = {
  id: string;
  text: string;
  imageMimeType: string;
  imageBase64: string;
};

export function CollaborationsList({ items }: { items: CollaborationPublic[] }) {
  if (items.length === 0) {
    return (
      <p className="text-center text-slate-500">
        Collaborations will appear here once they are added in the admin panel.
      </p>
    );
  }

  return (
    <div className="space-y-10 md:space-y-12">
      {items.map((item, index) => {
        const src = `data:${item.imageMimeType};base64,${item.imageBase64}`;
        const reverse = index % 2 === 1;

        return (
          <article
            key={item.id}
            className={`flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm md:min-h-[280px] md:flex-row md:items-stretch ${
              reverse ? "md:flex-row-reverse" : ""
            }`}
          >
            <div
              className={`flex flex-1 basis-1/2 items-center px-6 py-8 md:order-none md:px-10 md:py-10 ${
                reverse ? "order-2" : ""
              }`}
            >
              <p className="w-full text-[15px] leading-relaxed text-slate-800 md:text-base">
                {item.text}
              </p>
            </div>
            <div
              className={`relative min-h-[220px] w-full shrink-0 basis-1/2 bg-slate-100 md:min-h-0 md:order-none ${
                reverse ? "order-1" : ""
              }`}
            >
              <Image
                src={src}
                alt=""
                fill
                unoptimized
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </article>
        );
      })}
    </div>
  );
}
