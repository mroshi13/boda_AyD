"use client";

import { useEffect, useState } from "react";
import { Cormorant_Garamond } from "next/font/google";
import { Bodoni_Moda } from "next/font/google";
import { Antic_Didone } from "next/font/google";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const antic = Antic_Didone({
  subsets: ["latin"],
  weight: ["400"],
});

const API_URL =
  "https://script.google.com/macros/s/AKfycbx271Rbhfn1po7PAzrUL2NNGnPVhGL4qpiTL4xHzl8JdhkVmQt1TuGS-tZg4I245CxaMg/exec";

type Guest = {
  inviteID?: string;
  name: string;
  p_number: string;
  guestsAllowed: number;
  rsvpStatus?: string;
  guestsAttending?: number;
  finalConfirmation?: string;
};

export default function FinalConfirmation() {
  const [guest, setGuest] = useState<Guest | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const inviteID = params.get("inviteID");

    async function loadGuest() {
      if (!inviteID) {
        setLoading(false);
        return;
      }

      try {
        const url =
          `${API_URL}?inviteID=${encodeURIComponent(inviteID)}`;

        const res = await fetch(url);
        const data = await res.json();

        console.log("Final confirmation response:", data);

        if (data.error) {
          setGuest(null);
          return;
        }

        const loadedGuest: Guest = {
          ...data,
          inviteID: data.inviteID ?? inviteID,
          guestsAllowed: Number(data.guestsAllowed),
          guestsAttending: Number(data.guestsAttending ?? 0),
        };
        setGuest(loadedGuest);

        if (
          loadedGuest.finalConfirmation === "yes" ||
          loadedGuest.finalConfirmation === "no"
        ) {
          setSubmitted(true);
        }
      } catch (error) {
        console.error(
          "Failed to load final confirmation:",
          error
        );

        setGuest(null);
      } finally {
        setLoading(false);
      }
    }

    loadGuest();
  }, []);

  async function handleConfirmation(
    finalConfirmation: "yes" | "no"
  ) {
    if (!guest) return;

    setSubmitting(true);

    const payload = {
      inviteID: guest.inviteID,
      action: "finalConfirmation",
      finalConfirmation,
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(payload),
      });

      const responseText = await res.text();

      if (!res.ok) {
        throw new Error(
          `HTTP error ${res.status}: ${responseText}`
        );
      }

      const data = JSON.parse(responseText);

      if (data.success !== true) {
        throw new Error(
          data.error || "No se pudo guardar la confirmación."
        );
      }

      setGuest((currentGuest) =>
        currentGuest
          ? {
              ...currentGuest,
              finalConfirmation,
            }
          : currentGuest
      );

      setSubmitted(true);
    } catch (error) {
      console.error(
        "Failed to submit final confirmation:",
        error
      );

      alert(
        "No pudimos guardar tu confirmación. Por favor intenta nuevamente."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main
        className={`${bodoni.className} min-h-screen bg-[#FFFAEE] flex items-center justify-center px-6`}
      >
        <p className="text-xl text-[#222222]">
          Cargando invitación...
        </p>
      </main>
    );
  }

  if (!guest) {
    return (
      <main
        className={`${bodoni.className} min-h-screen bg-[#FFFAEE] flex items-center justify-center px-6`}
      >
        <div className="text-center">
          <h1
            className={`${antic.className} text-4xl font-bold text-[#222222]`}
          >
            Invitación no encontrada
          </h1>

          <p className="mt-4 text-gray-600">
            Por favor verifica el enlace que recibiste.
          </p>
        </div>
      </main>
    );
  }

  /*
   * Only guests who previously RSVP'd yes
   * should reach the final confirmation.
   */
  if (guest.rsvpStatus?.toLowerCase() !== "yes") {
    return (
      <main
        className={`${bodoni.className} min-h-screen bg-[#FFFAEE] flex items-center justify-center px-6`}
      >
        <div className="text-center max-w-xl">
          <h1
            className={`${antic.className} text-4xl font-bold text-[#222222]`}
          >
            Confirmación Final
          </h1>

          <p className="mt-6 text-lg text-gray-700">
            Esta confirmación está disponible para invitados
            que previamente confirmaron su asistencia.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main
      className={`${bodoni.className} min-h-screen bg-[#FFFAEE] flex items-center justify-center px-6 py-16`}
    >
      <div className="w-full max-w-xl space-y-8">

        <div className="text-center space-y-4">
          <p
            className={`${cormorant.className} text-xl tracking-[0.2em] uppercase`}
          >
            Alec & Danaee
          </p>

          <h1
            className={`${antic.className} text-5xl font-bold text-[#222222]`}
          >
            Confirmación Final
          </h1>

          <h2
            className={`${cormorant.className} text-3xl text-[#222222]`}
          >
            ¡Hola, {guest.name}! 💌
          </h2>
        </div>

        <div className="bg-[#FFFDF8] border rounded-2xl p-8 shadow-sm text-center space-y-4">
          <p className="text-lg text-gray-700">
            ¡Ya casi llega nuestro gran día!
          </p>

          <p className="text-lg text-gray-700">
            Tenemos registrada tu asistencia para nuestra boda
            el
          </p>

          <p
            className={`${cormorant.className} text-3xl font-semibold`}
          >
            10 de Octubre de 2026
          </p>

          <div className="pt-3">
            <p className="text-gray-600">
              Personas confirmadas
            </p>

            <p className="text-4xl font-semibold mt-1">
              {guest.guestsAttending}
            </p>
          </div>
        </div>

        {/* Itinerary */}
        <div className="bg-[#FFFDF8] border rounded-2xl p-8 shadow-sm text-center">
          <h2
            className={`${antic.className} text-3xl font-bold text-[#222222]`}
          >
            Itinerario
          </h2>

          <div className="mt-8 space-y-6">
            {/* Ceremony */}
            <div>
              <p
                className={`${cormorant.className} text-3xl font-semibold text-[#222222]`}
              >
                4:00 PM
              </p>

              <p
                className={`${cormorant.className} text-xl text-gray-700 mt-1`}
              >
                Ceremonia en IMANHA
              </p>
              
            </div>

            {/* Divider */}
            <div className="flex justify-center">
              <div className="h-8 w-px bg-gray-300" />
            </div>

            {/* Reception */}
            <div>
              <p
                className={`${cormorant.className} text-3xl font-semibold text-[#222222]`}
              >
                6:00 PM
              </p>

              <p
                className={`${cormorant.className} text-xl text-gray-700 mt-1`}
              >
                Recepción en IMANHA
              </p>
            </div>
          </div>
        </div>

        {submitted ? (
          <div className="bg-[#FFFDF8] border rounded-2xl p-8 shadow-sm text-center">
            {guest.finalConfirmation === "yes" ? (
              <>
                <h2
                  className={`${antic.className} text-3xl font-bold`}
                >
                  ¡Nos vemos muy pronto! 🤍
                </h2>

                <p className="mt-4 text-gray-700">
                  Tu asistencia ha sido confirmada.
                </p>
              </>
            ) : (
              <>
                <h2
                  className={`${antic.className} text-3xl font-bold`}
                >
                  Gracias por avisarnos 🤍
                </h2>

                <p className="mt-4 text-gray-700">
                  Hemos actualizado tu confirmación.
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="bg-[#FFFDF8] border rounded-2xl p-8 shadow-sm text-center space-y-6">
            <p className="text-lg text-gray-700">
              Queremos confirmar que aún podremos contar con
              tu presencia.
            </p>

            <button
              type="button"
              disabled={submitting}
              onClick={() => handleConfirmation("yes")}
              className="w-full bg-black text-white py-4 rounded-full hover:bg-gray-800 transition cursor-pointer disabled:opacity-50"
            >
              {submitting
                ? "Guardando..."
                : "Sí, confirmo mi asistencia"}
            </button>

            <button
              type="button"
              disabled={submitting}
              onClick={() => handleConfirmation("no")}
              className="w-full border border-black text-black py-4 rounded-full hover:bg-gray-100 transition cursor-pointer disabled:opacity-50"
            >
              Ya no podré asistir
            </button>
          </div>
        )}

        {/* Dress Code Reminder */}
        <div className="bg-[#FFFDF8] border rounded-2xl p-6 shadow-sm text-center space-y-5">
          <div className="space-y-2">
            <h2
              className={`${antic.className} text-3xl font-bold text-[#222222]`}
            >
              Código de Vestimenta
            </h2>

            <p
              className={`${cormorant.className} text-xl text-gray-700`}
            >
              Te recordamos nuestro código de vestimenta. ¡Gracias! 🤍
            </p>
          </div>

          <div className="overflow-hidden rounded-xl">
            <img
              src="/images/codigo_vestimenta.jpg"
              alt="Código de vestimenta para la boda de Alec y Danaee"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      </div>
    </main>
  );
}