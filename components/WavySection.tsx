import React from "react";

type WavySectionProps = {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
};

export default function WavySection({
  children,
  className = "",
  contentClassName = "",
}: WavySectionProps) {
  return (
    <section className="w-full bg-[#FFFAEE] px-2 py-8 md:px-6 md:py-12">
      <div className="relative mx-auto w-[98vw] max-w-[1800px] bg-[#FFFAEE] px-6 py-10 md:px-12 md:py-14">
        {/* Wavy outline */}
        <svg
          className="pointer-events-none absolute inset-4 h-[calc(100%-2rem)] w-[calc(100%-2rem)] md:inset-6 md:h-[calc(100%-3rem)] md:w-[calc(100%-3rem)]"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="
              M 6 5
              C 14 3, 20 7, 28 5
              S 42 7, 50 5
              S 64 7, 72 5
              S 86 3, 94 5
              C 97 18, 93 28, 95 40
              S 97 62, 95 74
              S 97 88, 94 95
              C 84 97, 76 93, 66 95
              S 48 97, 38 95
              S 20 97, 6 95
              C 3 82, 7 72, 5 60
              S 3 38, 5 26
              S 3 12, 6 5
            "
            fill="none"
            stroke="#222222"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <div className="relative z-10">
          {children}
        </div>
      </div>
    </section>
  );
}