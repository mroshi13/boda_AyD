"use client";

import { useEffect, useRef, useState } from "react";
import RSVPSection from "../components/RSVPSection";
import WavySection from "../components/WavySection";
import CountdownTimer from "../components/CountdownTimer";
import { Cormorant_Garamond } from "next/font/google";
import { Bodoni_Moda } from "next/font/google";
import { Meow_Script } from "next/font/google";
import { Antic_Didone } from "next/font/google";
import { Analytics } from "@vercel/analytics/next"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const meow = Meow_Script({
  subsets: ["latin"],
  weight: ["400"]
});

const antic = Antic_Didone({
  weight: ["400"],
  subsets: ["latin"]
})

const galleryPhotos = [
  {
    src: "/images/AyD1.jpg",
    alt: "AyD Foto 1",
  },
  {
    src: "/images/AyD2.jpg",
    alt: "AyD Foto 2",
  },
  {
    src: "/images/AyD3.jpg",
    alt: "AyD Foto 3",
  },
];

const googleMapsUrl = "https://maps.app.goo.gl/yWLM1V2Bep94eHXk9";

export default function HomePage() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFading, setIsFading] = useState(false);

  const hasStartedMusic = useRef(false);

  useEffect(() => {
    const handleVisibility = () => {
      const audio = document.querySelector("audio");

      if (!(audio instanceof HTMLAudioElement)) return;
      if (!hasStartedMusic.current) return;

      if (document.hidden) {
        audio.pause();
      } else {
        audio.play().catch(() => {});
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  });

  const hotelsInValley = [
    {
      name: "Eliá",
      reservation:
        "https://us2.cloudbeds.com/es/reservation/AU6hyB?currency=mxn",
      maps: "https://maps.app.goo.gl/CuRh41Kjcm89kWos5",
    },
    {
      name: "Hotel Boutique & Spa",
      reservation: "https://hoteldelvalledeguadalupe.com",
      maps: "https://maps.app.goo.gl/ZumrJ7N9UvELdJhg6",
    },
    {
      name: "Villa Simul",
      reservation: "https://www.villasimul.com/",
      maps: "https://maps.app.goo.gl/uceFh8LXb396BxQy9",
    },
    {
      name: "Maglén Resort",
      reservation: "https://www.maglenresort.com/",
      maps: "https://maps.app.goo.gl/7goCuQXNV97hUb8K7",
    },
  ];

  const hotelsOutsideValley = [
    {
      name: "City Express Plus",
      reservation:
        "https://www.marriott.com/en-us/hotels/tijpe-city-express-plus-ensenada/overview/?scid=f2ae0541-1279-4f24-b197-a979c79310b0",
      maps: "https://maps.app.goo.gl/Svn58FgvWkYBegyx6",
    },
    {
      name: "Torre Lucerna",
      reservation: "https://hoteleslucerna.com/es/ensenada",
      maps: "https://maps.app.goo.gl/SBRmnPdevfNUQNU48",
    }
  ];

  const linkClass = "text-blue-600 underline hover:text-blue-800 transition";

  function openInvitation() {
    const audio = document.querySelector("audio");

    if (audio instanceof HTMLAudioElement) {
      audio.volume = 0.5;

      if (audio.paused) {
        audio
          .play()
          .then(() => {
            hasStartedMusic.current = true;
          })
          .catch(console.error);
      } else {
        hasStartedMusic.current = true;
      }
    }

    setIsFading(true);

    setTimeout(() => {
      setIsOpen(true);
    }, 1000);

    setTimeout(() => {
      document
        .getElementById("novios")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 1500);
  }

  return (
    <main className="bg-[#FFFAEE] text-gray-800">
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center text-center px-6 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-[position:center_60%]"
          style={{ backgroundImage: "url('/images/agarrados_manos.jpg')" }}
        />

        <div className="relative z-10 w-full max-w-2xl">
          <div className={`bg-[#FFFDF8]/90 backdrop-blur-md shadow-2xl rounded-3xl p-10 text-center space-y-6 transition-opacity duration-1000 
            ${isFading ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
            <p
              className={`${bodoni.className} uppercase tracking-[0.3em] text-lg`}
            >
              ¡Nos casamos!
            </p>

            <h1 className={`${cormorant.className} text-5xl font-bold`}>
              Alec & Danaee
            </h1>

            <p className={`${bodoni.className} text-lg text-gray-600`}>
              Valle de Guadalupe, BC, MX
            </p>

            <p className={`${bodoni.className} text-md text-gray-600`}>
              10 de Octubre 2026
            </p>

            {!isOpen && (
              <button
                onClick={openInvitation}
                className={`${bodoni.className} px-8 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition cursor-pointer`}
              >
                Abrir Invitación
              </button>
            )}
          </div>
        </div>
      </section>

      {isOpen && (
        <>
          <WavySection
            topFlower="/images/orchid-top.png"
            topFlowerClassName="w-[280px] md:w-[400px] lg:w-[450px] xl:w-[450px] -left-20 top-0"
            bottomFlower="/images/orchid-bottom.png"
            bottomFlowerClassName="w-[280px] md:w-[400px] lg:w-[450px] xl:w-[500px] -right-20 bottom-0"
          >
          {/* COUPLE SECTION */}
          <section
            id="novios"
            className="min-h-0 flex items-center px-6 py-24 text-center"
          >
            
            <div className="w-full max-w-7xl mx-auto grid md:grid-cols-[55%_45%] gap-10 items-center">
              <div className={`${cormorant.className} flex flex-col text-4xl items-center space-y-12`}>
                <p>
                  Alec Ortega Lara
                </p>

                <p>&</p>

                <p>
                  Susana Danaee Fuerte González
                </p>
              </div>
              
              
              <div className="flex justify-start">
                <div className="bg-[#FFFDF8] p-5 rounded-3xl shadow-2xl border border-gray-200">
                  <img
                    src="/images/espalda.jpg"
                    alt="Alec y Danaee"
                    className="rounded-3xl object-cover w-full max-w-md aspect-[4/5]"
                  />
                </div>
              </div>
            </div>
          </section>
          </WavySection>

          <section
            id="timer"
            className="relative flex min-h-screen items-center justify-center overflow-hidden"
          >
            {/* Background Image */}
            <img
              src="/images/zapatos.jpg"
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-[center_50%]"
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/35" />

            {/* Content */}
            <div className="relative z-10 rounded-3xl border border-white/20 bg-white/10 p-10 backdrop-blur-md shadow-2xl">
              <CountdownTimer />
            </div>
          </section>

          <WavySection bottomFlower="">
          <section
            id="detalles"
            className="min-h-0 w-full overflow-hidden px-4 py-20 text-center md:px-6 md:py-24"
          >
            <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 md:grid-cols-[30%_70%] md:gap-12">
              <div className="flex justify-center overflow-hidden">
                <img
                  src="/images/iniciales_gde.png"
                  alt="Decoración floral"
                  className="w-full max-w-[260px] object-contain md:max-w-xl"
                />
              </div>

              <div className="mx-auto flex w-full max-w-[720px] flex-col items-center space-y-10 px-1 md:space-y-12">
                <h1
                  className={`flex flex-col items-center text-center font-bold leading-[0.9]`}
                >
                  <span className={` ${antic.className} text-[clamp(1.5rem,9vw,4rem)]`}>
                    Lo que necesitas
                  </span>

                  <span className={` ${antic.className} text-[clamp(1.5rem,9vw,3.5rem)]`}>
                    saber
                  </span>
                </h1>

                <div
                  className={`${antic.className} w-full max-w-full space-y-6 text-center text-xl leading-relaxed text-gray-700 md:text-3xl`}
                >
                  {[
                    ["/images/rings-icon.png", "Ceremonia", "3:00 PM — Ceremonía", "h-10 w-10"],
                    ["/images/icons-bebida.png", "Cóctel", "4:30 PM — Cóctel", "h-10 w-10"],
                    ["/images/icons-invitacion.png", "Recepción", "5:00 PM — Recepción", "h-8 w-8"],
                    ["/images/icons-comida.png", "Cena", "6:30 PM — Cena", "h-10 w-10"],
                    ["/images/icons-confeti.png", "Fiesta", "8:00 PM — Fiesta", "h-10 w-10"],
                  ].map(([src, alt, text, size]) => (
                    <p
                      key={text}
                      className="mx-auto flex w-full max-w-full items-center justify-center gap-3 text-center md:gap-5"
                    >
                      <img
                        src={src}
                        alt={alt}
                        className={`${size} shrink-0 object-contain`}
                      />
                      <span className="min-w-0 break-words">{text}</span>
                    </p>
                  ))}

                  <p className="pt-4 underline">Respetuosamente no niños</p>
                </div>

                <div className="mx-auto w-full max-w-xl rounded-2xl border bg-[#FFFAEE] p-5 text-center shadow-sm md:p-6">
                  <h3 className={`${bodoni.className} mb-3 text-xl font-semibold`}>
                    📍 IMANHA
                  </h3>

                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mx-auto inline-flex max-w-full items-center justify-center gap-2 rounded-full border border-[#222222] bg-[#f0f0f0] px-5 py-3 text-center text-base font-medium text-[#222222] transition-all duration-300 hover:-translate-y-1 hover:bg-[#f1eadb] hover:shadow-lg md:px-6 md:text-lg"
                  >
                    Ver en Google Maps
                  </a>
                </div>
              </div>
            </div>
          </section>
        </WavySection>

          <WavySection
            topFlower="../images/lavanda.png"
            topFlowerClassName="
              left-1/2 top-8 h-[600px]
              w-[450px] -translate-x-1/2 
              opacity-[0.15]
              md:w-[800px]
            ">
          <section
            id="faqs"
            className="min-h-0 w-full overflow-hidden px-4 py-20 text-[#222222] md:px-6 md:py-24"
          >
            <div className="mx-auto grid w-full max-w-5xl grid-cols-1 items-center gap-10 md:grid-cols-[60%_40%] md:gap-6">
              <div className="flex w-full flex-col items-center text-center md:items-start md:text-left">
                <div className="relative z-10 w-full max-w-3xl rounded-3xl px-5 py-8 md:px-10 md:py-10">
                  <div className="mb-8 flex justify-center md:justify-start">
                    <div className="flex items-center gap-4">
                      <h2 className="flex flex-col text-center font-bold leading-[0.9] md:text-left">
                        <span className={`${antic.className} text-[clamp(1.5rem,9vw,3rem)]`}>Código de</span>
                        <span className={`${antic.className} text-[clamp(1.5rem,9vw,3.5rem)]`}>Vestimenta</span>
                      </h2>

                      <img
                        src="/images/vestido.png"
                        alt="Wedding dress"
                        className="h-14 w-14 shrink-0 object-contain md:h-16 md:w-16"
                      />
                    </div>
                  </div>

                  <div
                    className={`${antic.className} space-y-4 text-center text-xl text-[#111111] [text-shadow:0_0_0.4px_rgba(0,0,0,0.8)] leading-relaxed md:text-left md:text-2xl`}
                  >
                    <p>
                      - Vestimenta Formal <br />
                      - Mujeres: Vestido Largo <br />
                      - Hombres: Traje / No tenis
                    </p>

                    <p>
                      <a
                        href="https://pin.it/38qXehQiH"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="break-words text-blue-700 underline transition hover:text-black"
                      >
                        Clic aquí para una guía de colores
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center md:justify-start">
                <div className="w-full max-w-sm rounded-3xl border border-gray-200 bg-[#FFFDF8] p-4 shadow-2xl md:max-w-md md:p-5">
                  <img
                    src="/images/anillo.JPG"
                    alt="Alec y Danaee"
                    className="aspect-[4/5] w-full rounded-2xl object-cover"
                  />
                </div>
              </div>
            </div>
          </section>
          </WavySection>

          <WavySection>
            <section
              id="momentos"
              className="relative overflow-hidden px-6 py-24 text-center"
            >
              <div className="mx-auto max-w-7xl space-y-14">
                <div className="grid gap-10 md:grid-cols-3">
                  {galleryPhotos.map((photo) => (
                    <div key={photo.src} className="mx-auto w-full max-w-sm">
                      <div className="rounded-t-full rounded-b-[3rem] border border-[#C8B27C] bg-[#FFFDF8] p-2 shadow-sm">
                        <img
                          src={photo.src}
                          alt={photo.alt}
                          className="aspect-[3/4] w-full rounded-t-full rounded-b-[2.5rem] object-cover grayscale"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </WavySection>

          <WavySection
            bottomFlower="../images/olive_branch.png">
          <section id="hospedaje" className="px-6 py-24 text-center">
            <div className="mx-auto w-full max-w-5xl space-y-16">
              <div className="space-y-4">
                <h1
                  className={`flex flex-col items-center text-center font-semibold leading-[0.9]`}
                >
                  <span className={` ${antic.className} text-[clamp(2.8rem,7vw,3.5rem)]`}>
                    Opciones de
                  </span>

                  <span className={` ${antic.className} text-[clamp(4rem,10vw,4.5rem)]`}>
                    Hospedaje
                  </span>
                </h1>
                <br/>
                <p className={`${cormorant.className} text-2xl text-gray-700 max-w-2xl mx-auto`}>
                  Les compartimos algunas opciones de hospedaje en Valle de Guadalupe y Ensenada.
                </p>
              </div>

              <div className="space-y-6 text-left max-w-3xl mx-auto">
                <h2
                  className={`${antic.className} text-2xl font-semibold text-center`}
                >
                  Valle de Guadalupe
                </h2>

                <ul className="divide-y divide-black/10">
                  {hotelsInValley.map((hotel) => (
                    <li
                      key={hotel.name}
                      className="flex items-center justify-between py-5"
                    >
                      <span className="text-lg font-medium">{hotel.name}</span>

                      <a
                        href={hotel.reservation}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-blue-700 hover:text-blue-900 transition"
                      >
                        Reservar →
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-6 text-left max-w-3xl mx-auto">
              <h2 className={`${antic.className} text-2xl font-semibold text-center`}>
                Ensenada
              </h2>

              <ul className="divide-y divide-black/10">
                {hotelsOutsideValley.map((hotel) => (
                  <li
                    key={hotel.name}
                    className="flex items-center justify-between gap-4 py-5"
                  >
                    <span className="text-lg font-medium">{hotel.name}</span>

                    <a
                      href={hotel.reservation}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 underline text-blue-700 hover:text-blue-900 transition"
                    >
                      Reservar →
                    </a>
                  </li>
                ))}
              </ul>

              <div className="mt-10 rounded-2xl border border-[#222222]/15 bg-[#FFFDF8] px-6 py-5 text-center shadow-sm">
                <p className={`${bodoni.className} text-xl font-semibold text-[#222222]`}>
                  Tarifa especial para nuestros invitados
                </p>

                <p className={`${antic.className} mt-2 text-lg italic text-[#111111]]`}>
                  Contamos con convenio con el hotel City Express Plus.<br/>
                  Favor de contactar a: <br/>
                  ROCIO FUENTES<br/>
                  55 6448 8773<br/>
                  (646) 153 84 50 ext. 192<br/>
                  CODIGO: <br/>
                  BODA-DANAE&ALEC2026
                </p>
              </div>
            </div>
            </div>
          </section>
          </WavySection>

          <WavySection>
            <section id="regalos">
              <div className="w-full max-w-7xl mx-auto grid md:grid-cols-[40%_60%] gap-12 items-center">
                <div className="flex justify-start">
                  <div className="bg-[#FFFDF8] p-5 rounded-3xl shadow-2xl border border-gray-200">
                  <img
                    src="/images/downtown.jpg"
                    alt="Decoración floral"
                    className="rounded-2xl object-cover w-full max-w-md aspect-[4/5]"
                  />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-start gap-4 mb-8">
                    <h2 className={`${antic.className} text-5xl font-bold`}>
                      Regalos
                    </h2>

                    <img
                      src="/images/icon-gift.png"
                      alt="Wedding dress"
                      className="h-14 w-14 object-contain"
                    />
                  </div>
                  <h2 className={`${antic.className} text-2xl leading-tight font-semibold`}>
                    El mejor regalo es compartir este día con ustedes. <br/>
                    Si desean hacernos un obsequio, agradeceremos una contribución en efectivo mediante lluvia de sobres.
                  </h2>

                  <div className="space-y-6">
                  </div>
  
                </div>

              </div>
            </section>
          </WavySection>

          <WavySection>
            <RSVPSection />
          </WavySection>

          <WavySection>
            <section id="outro" className="w-full">
              <div className="mx-auto grid w-full max-w-7xl px-6 md:px-8 grid-cols-1 items-center gap-10 md:grid-cols-[25%_50%_25%] md:gap-6">

                {/* Left Image */}
                <div className="flex justify-center md:justify-start">
                  <div className="rounded-3xl border border-gray-200 bg-[#FFFDF8] p-5 shadow-2xl">
                    <img
                      src="/images/downtown.jpg"
                      alt="Decoración floral"
                      className="aspect-[4/5] w-full max-w-sm rounded-2xl object-cover"
                    />
                  </div>
                </div>

                {/* Center Text */}
                <div className="space-y-6 text-center">
                  <div className="mb-8 flex items-center justify-center gap-4">
                    <h2 className={`${antic.className} text-4xl font-bold`}>
                      Gracias por acompañarnos
                    </h2>
                  </div>

                  <h2 className={`${cormorant.className} text-3xl font-bold leading-tight`}>
                    - Danaee y Alec -
                  </h2>
                </div>

                {/* Right Image */}
                <div className="flex justify-center md:justify-end md:pr-4">
                  <div className="rounded-3xl border border-gray-200 bg-[#FFFDF8] p-5 shadow-2xl">
                    <img
                      src="/images/anillo_deatras.jpg"
                      alt="Decoración floral"
                      className="aspect-[4/5] w-full max-w-sm rounded-4xl object-cover"
                    />
                  </div>
                </div>

              </div>
            </section>
          </WavySection>
          <p className={`${antic.className}`}>
          Website by: MRoshi©
          </p>
          <Analytics/>
        </>
      )}
    </main>
  );
}