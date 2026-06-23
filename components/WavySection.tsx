import React from "react";

type WavySectionProps = {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  topFlower?: string;
  bottomFlower?: string;
};

export default function WavySection({
  children,
  className = "",
  contentClassName = "",
  topFlower,
  bottomFlower,
}: WavySectionProps) {
  return (
    <section
      className={`w-full bg-[#FFFAEE] px-2 py-8 md:px-6 md:py-12 ${className}`}
    >
      <div className="relative mx-auto w-full max-w-[1800px] border-2 border-[#222222] p-4 md:p-5">
        <div className="relative overflow-hidden border border-[#222222] bg-[#FFFAEE] px-8 py-12 md:px-16 md:py-16">
          {topFlower && (
            <img
              src={topFlower}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute left-0 top-0 z-0 w-32 md:w-48 lg:w-72"
            />
          )}

          {bottomFlower && (
            <img
              src={bottomFlower}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 right-0 z-0 w-32 md:w-48 lg:w-72"
            />
          )}

          <div className={`relative z-10 ${contentClassName}`}>
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}