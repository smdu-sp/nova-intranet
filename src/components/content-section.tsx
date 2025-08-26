"use client";

import Image from "next/image";

interface ContentSectionProps {
  title: string;
  subtitle: string;
  text: string;
  imageSrc: string;
  imageAlt: string;
  link: string;
}

export default function ContentSection({
  title,
  subtitle,
  text,
  imageSrc,
  imageAlt,
  link,
}: ContentSectionProps) {
  return (
    <section className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-bold text-[#0a3299] mb-4 border-b-2 border-[#0a3299] pb-2">
        {title}
      </h2>
      <div className="flex gap-4">
        <div className="w-[270px] h-[165px] flex-shrink-0">
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={270}
            height={165}            
            className="w-full h-full rounded object-cover"
          />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-[#333333] mb-2">{subtitle}</h3>
          <p className="text-[#666666] text-sm leading-relaxed">{text}</p>
        </div>
      </div>
    </section>
  );
}
