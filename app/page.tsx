"use client";
import { useState } from "react";
import RSVPSection from "../components/RSVPSection";
import { Cormorant_Garamond } from "next/font/google";
import { Bodoni_Moda } from "next/font/google";

const cormorant = Cormorant_Garamond({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

const bodoni = Bodoni_Moda ({
  subsets: ["latin"],
  weight: ["400","500","600","700"],
});

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

export default function HomePage() {

const [isOpen, setIsOpen] = useState(false);
const hotelsInValley = [
    {
      name: "Eliá",
      reservation:
        "https://us2.cloudbeds.com/es/reservation/AU6hyB?currency=mxn",
      maps: "https://maps.app.goo.gl/CuRh41Kjcm89kWos5",
    },
    {
      name: "Hotel Boutique & Spa Valle de Guadalupe",
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
      name: "City Express Plus by Marriott Ensenada",
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

  const linkClass =
    "text-blue-600 underline hover:text-blue-800 transition";

  const buttonPrimary =
    "px-4 py-2 bg-black text-white rounded-full text-center hover:bg-gray-800 transition";

  const buttonSecondary =
    "px-4 py-2 border border-gray-300 rounded-full text-center hover:bg-gray-100 transition";

function openInvitation() {
  const audio = document.querySelector("audio");

  if (audio instanceof HTMLAudioElement) {
    audio.volume = 0.5;

    if (audio.paused) {
      audio.play().catch(console.error);
    }
  }

  setIsOpen(true);

  setTimeout(() => {
    document
      .getElementById("historia")
      ?.scrollIntoView({ behavior: "smooth" });
  }, 100);
}

return (
  <main className="bg-[#FAF2DD] text-gray-800">
    {/* HERO SECTION */}
    <section className="relative min-h-screen flex items-center justify-center text-center px-6 overflow-hidden">

      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/cruzando_calle.jpg')" }}
      />

      {/* Overlay 
      <div className="absolute inset-0 bg-[#FFEBCD]/60" />*/}

      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl">
        <div className="bg-[#FFFDF8]/90 backdrop-blur-md shadow-2xl rounded-3xl p-10 text-center space-y-6">
          <p className={`${bodoni.className} uppercase tracking-[0.3em] text-xlg`}>
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
    {isOpen && (<>
    
    <div className="w-100 h-px bg-black/40 mx-auto" />

    {/* DETAILS SECTION */}
    <section id="detalles" className="min-h-screen flex items-center px-6 py-24 text-center">
      <div className="w-24 h-px bg-black/40 mx-auto" />
      <div className="w-full max-w-7xl mx-auto grid md:grid-cols-[30%_70%] gap-12 items-center">

        {/* Left Image */}
        <div className="flex justify-center">
          <img
            src="/images/flores1.png"
            alt="Decoración floral"
            className="w-full max-w-xs object-contain"
          />
        </div>

        {/* Right Content */}
        <div className="flex flex-col items-center space-y-12">

          <h1 className={`${cormorant.className} text-5xl font-bold`}>
            Detalles de la Misa y Recepción
          </h1>

          {/* Intro */}
          <div className="space-y-6">
            <div className={`${bodoni.className} text-2xl text-gray-700 leading-relaxed space-y-4`}>
              <p>3:00 PM — Misa en X de la Madre</p>

              <p>4:30 PM — Rompe Hielo</p>

              <p>5:00 PM — Recepción y Fiesta</p>
            </div>
          </div>

          {/* Venue */}
          <div className="max-w-xl w-full border rounded-2xl p-6 bg-[#FAF2DD] shadow-sm text-center">
            <h3 className={`${cormorant.className} font-semibold text-xl mb-3`}>
              📍 IMANHA
            </h3>

            <a
              href="https://maps.app.goo.gl/yWLM1V2Bep94eHXk9"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              Lote Francisco, Zarco, 22753 Francisco Zarco, B.C., Mexico
            </a>
          </div>
        </div>
      </div>
    </section>

    <div className="w-100 h-px bg-black/40 mx-auto" />
    
    <section
      id="FAQs"
      className="min-h-screen flex items-center bg-[#5b6946] text-[#faf3dd] px-6 py-24">
      
      <div className="w-full max-w-7xl mx-auto grid md:grid-cols-[60%_40%] text-[#faf3dd] gap-16 items-center">
        {/* Left Content */}
        <div className="flex flex-col items-start space-y-12 text-left">
          {/* Dress Code */}
          <div className="space-y-6">
            <h2 className={`${cormorant.className} text-5xl font-bold`}>
              Código de Vestimenta
            </h2>
            <div className={`${bodoni.className} text-2xl text-700 leading-relaxed space-y-4`}>
              <p>
                Tu presencia es muy importante para nosotros.
              </p>

              <p>
                Para nuestra celebración, les pedimos amablemente evitar los colores
                <span className="font-semibold">
                  {" "}blanco, beige, azul eléctrico, rojo y negro.
                </span>
              </p>

              <p>
                Como guía, les compartimos nuestra{" "}
                <a
                  href="https://pin.it/38qXehQiH"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-blue-700 hover:text-blue-900 transition"
                >
                   paleta de colores 
                </a>
                {" "}sugerida.
              </p>

              <p>
                ¡Gracias por acompañarnos en este día tan especial!
              </p>

            </div>
          </div>
        </div>

        {/* Right Photo */}
        <div className="flex justify-center">
          <div className="bg-[#FFFDF8] p-5 rounded-3xl shadow-2xl border border-gray-200">
            <img
              src="/images/anillo.jpg"
              alt="Alec y Danaee"
              className="rounded-2xl object-cover w-full max-w-md aspect-[4/5]"
            />
          </div>
        </div>

      </div>
    </section>
    <div className="w-100 h-px bg-black/40 mx-auto" />
    <section
      id="momentos"
      className="relative overflow-hidden px-6 py-24 text-center"
    >

      <div className="mx-auto max-w-7xl space-y-14">
        {/* Photo Frames */}
        <div className="grid gap-10 md:grid-cols-3">
          {galleryPhotos.map((photo) => (
            <div
              key={photo.src}
              className="mx-auto w-full max-w-sm"
            >
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
    <div className="w-100 h-px bg-black/40 mx-auto" />
    <section
      id="hospedaje"
      className="px-6 py-24 text-center">

      <div className="mx-auto w-full max-w-5xl space-y-16">
        {/* Header */}
        <div className="space-y-4">

          <h1 className={`${cormorant.className} text-5xl font-semibold`}>
            Hospedaje
          </h1>

          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Les compartimos algunas opciones de hospedaje en el Valle de Guadalupe y Ensenada.
          </p>
        </div>

        {/* Dentro del Valle */}
        <div className="space-y-6 text-left max-w-3xl mx-auto">

          <h2 className={`${cormorant.className} text-3xl font-semibold text-center`}>
            Valle de Guadalupe
          </h2>

          <ul className="divide-y divide-black/10">

            {hotelsInValley.map((hotel) => (
              <li
                key={hotel.name}
                className="flex items-center justify-between py-5"
              >
                <div className="flex items-center gap-3">

                  <span className="text-lg font-medium">
                    {hotel.name}
                  </span>

                </div>

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

        {/* Fuera del Valle */}
        <div className="space-y-6 text-left max-w-3xl mx-auto">

          <h2 className={`${cormorant.className} text-3xl font-semibold text-center`}>
            Ensenada
          </h2>

          <ul className="divide-y divide-black/10">

            {hotelsOutsideValley.map((hotel) => (
              <li
                key={hotel.name}
                className="flex items-center justify-between py-5"
              >
                <div className="flex items-center gap-3">

                  <span className="text-lg font-medium">
                    {hotel.name}
                  </span>

                </div>

                <a
                  href={hotel.reservation}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-blue-700 hover:text-blue-900 transition">
                  Reservar →
                </a>

              </li>
            ))}
          </ul>
        </div>

      </div>
    </section>

    <div className="w-100 h-px bg-black/40 mx-auto" />
    
    <section
      id="rsvp"
      className="flex flex-col items-center bg-[#5b6946] text-center py-24">
      <RSVPSection />

    </section>
    </>
    )}
  </main>
);
}
