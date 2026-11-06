import Image from "next/image";
import Link from "next/link";

type Props = {
  title: string;
  text: string;
  image: string;
  icon: string;
  number: string;
  href: string;
};

export default function ServiceCard({
  title,
  text,
  image,
  icon,
  number,
  href,
}: Props) {
  return (
    <div
      className="
        service-02-item
        relative
        w-[48%] 
        h-[350px] 
        rounded-[32px] 
        overflow-hidden
      "
    >
      {/* IMAGE */}
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover"
      />

      {/* WHITE BLOCK */}
      <div
        className="
          absolute 
          bottom-0 
          left-0 
          w-[85%] 
          bg-white 
          rounded-t-[28px] 
          px-8 
          py-7 
          shadow-[0_8px_32px_rgba(0,0,0,0.08)]
          z-10
        "
      >
        {/* HEADER */}
        <div className="flex items-start justify-between gap-6 mb-4">
          <h3 className="text-[20px] font-medium leading-snug text-[#444] max-w-[85%]">
            {title}
          </h3>

          <div className="w-10 h-10 rounded-full border border-[#dfdfdf] text-[#757575] flex items-center justify-center text-sm">
            {number}
          </div>
        </div>

        {/* TEXT */}
        <p className="text-[15px] leading-relaxed text-[#757575] mb-6">
          {text}
        </p>

        {/* LINK */}
        <Link
          href={href}
          className="inline-flex items-center gap-2 text-[15px] font-medium text-[#444]"
        >
          Ətraflı
          <span className="text-lg">→</span>
        </Link>

        {/* ICON */}
        <div className="absolute -top-7 right-6">
          <div className="w-14 h-14 rounded-full bg-[#e7e7e7] flex items-center justify-center">
            <Image src={icon} alt="" width={26} height={26} />
          </div>
        </div>
      </div>
    </div>
  );
}
