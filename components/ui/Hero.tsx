export default function Hero({ title }: { title: string }) {
  return (
    <section className="w-full py-24 md:py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-start gap-x-6 md:gap-x-10 lg:gap-x-32">
        
        {/* Левая скобка */}
        <span className="text-[60px] md:text-[100px] lg:text-[130px] font">
          [
        </span>

        {/* Текст */}
        <h1
          className="
             md:text-[120px] sm:text-[120px] lg:text-[120px]
             tracking-wide
          "
        >
          {title}
        </h1>

        {/* Правая скобка */}
        <span className="text-[60px] md:text-[100px] lg:text-[130px] font">
          ]
        </span>
      </div>
    </section>
  );
}
