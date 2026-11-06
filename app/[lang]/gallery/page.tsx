import type { Metadata } from "next";
import { getGallery } from "@/lib/directus";
import { buildPageMetadata, normalizeLang } from "@/lib/seo";
import { directusImage } from "@/lib/directusImage";
import GallerySlider from "@/components/GallerySlider";

type Lang = "en" | "ru" | "az";

export async function generateMetadata(props: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await props.params;

  // Not in the sitemap yet — keep it out of the index until it has real content
  return buildPageMetadata({
    lang: normalizeLang(lang),
    path: "gallery",
    title: "Gallery | BeSmile Dental Clinic",
    description: "BeSmile Dental Clinic gallery, Baku.",
    noindex: true,
  });
}

export default async function GalleryPage({
  params,
}: {
  params: { lang: Lang };
}) {
  const data = await getGallery();

  const gallery = Array.isArray(data) ? data[0] : null;

  // ✅ SAFE GUARD — БЕЗ notFound
  if (!gallery || !gallery.main_image) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center text-gray-500">
        Gallery is empty
      </div>
    );
  }

  const mainImage = gallery.main_image;
  const sliderImages = Array.isArray(gallery.slider_images)
    ? gallery.slider_images
    : [];

  return (
    <div className="w-full min-h-screen bg-white overflow-hidden flex flex-col">

      {/* HERO */}
      <section className="w-full px-6 sm:px-8 lg:px-12 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          <div>
            <h1 className="font-manrope font-light tracking-tight leading-[0.9]">
              <span
                className="
        block
        text-[64px]
        tracking-[0.22em]
        sm:text-[88px]
        lg:text-[112px]
      "
              >
                HAPPY
              </span>

              <span
                className="
        block
        text-[64px]
        tracking-[0.22em]
        ml-[100px]
        sm:text-[88px]
        sm:ml-[110px]
        lg:text-[112px]
        lg:ml-[120px]
      "
              >
                SMILES
              </span>
            </h1>
          </div>


          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-[720px] rounded-[28px] overflow-hidden shadow-xl">
              <img
                src={directusImage(mainImage, 1600, 82)}
                alt="Gallery"
                className="w-full object-cover"
              />
            </div>
          </div>

        </div>
      </section>

      {/* SLIDER */}
      {sliderImages.length > 0 && (
        <GallerySlider images={sliderImages} />
      )}
    </div>
  );
}
