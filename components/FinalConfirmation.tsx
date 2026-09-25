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
  "https://script.google.com/macros/s/AKfycby4jbQPpCsrS4t89CCDYTuu_aAO2nBbl78DSBsFm99pUYivT-jgyksIRONzaQGv8Qbx6A/exec";

type Guest = {
  inviteID?: string;
  name: string;
  p_number: string;
  guestsAllowed: number;
  rsvpStatus?: string;
  guestsAttending?: number;
  finalConfirmation?: string;

  // Hotel / transportation
  stayingCityExpress?: string;
  requiresTransportation?: string;
  transportationGuests?: number;
};

export default function FinalConfirmation() {
  const [guest, setGuest] = useState<Guest | null>(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Final confirmation form
  const [finalConfirmation, setFinalConfirmation] = useState("");
  const [stayingCityExpress, setStayingCityExpress] = useState("");
  const [requiresTransportation, setRequiresTransportation] =
    useState("");
  const [transportationGuests, setTransportationGuests] =
    useState<number>(1);

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
          transportationGuests: Number(
            data.transportationGuests ?? 0
          ),
        };

        setGuest(loadedGuest);

        // If this guest has already completed final confirmation,
        // restore their saved answers.
        if (
          loadedGuest.finalConfirmation === "yes" ||
          loadedGuest.finalConfirmation === "no"
        ) {
          setSubmitted(true);
          setFinalConfirmation(
            loadedGuest.finalConfirmation
          );
          setStayingCityExpress(
            loadedGuest.stayingCityExpress ?? ""
          );
          setRequiresTransportation(
            loadedGuest.requiresTransportation ?? ""
          );

          if (
            loadedGuest.transportationGuests &&
            loadedGuest.transportationGuests > 0
          ) {
            setTransportationGuests(
              loadedGuest.transportationGuests
            );
          }
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

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!guest) return;

    /*
     * Validation
     */

    if (!finalConfirmation) {
      alert(
        "Por favor confirma si aún podremos contar con tu asistencia."
      );
      return;
    }

    // Hotel questions only matter if they're still attending.
    if (
      finalConfirmation === "yes" &&
      !stayingCityExpress
    ) {
      alert(
        "Por favor indícanos si te hospedarás en City Express Plus."
      );
      return;
    }

    if (
      finalConfirmation === "yes" &&
      stayingCityExpress === "yes" &&
      !requiresTransportation
    ) {
      alert(
        "Por favor indícanos si requerirás transporte."
      );
      return;
    }

    if (
      finalConfirmation === "yes" &&
      stayingCityExpress === "yes" &&
      requiresTransportation === "yes" &&
      (
        transportationGuests < 1 ||
        transportationGuests >
          Number(guest.guestsAttending ?? 1)
      )
    ) {
      alert(
        "Por favor ingresa un número válido de personas que requerirán transporte."
      );
      return;
    }

    setSubmitting(true);

    /*
     * Normalize values before sending them to Sheets.
     */

    const finalStayingCityExpress =
      finalConfirmation === "yes"
        ? stayingCityExpress
        : "no";

    const finalRequiresTransportation =
      finalConfirmation === "yes" &&
      stayingCityExpress === "yes"
        ? requiresTransportation
        : "no";

    const finalTransportationGuests =
      finalConfirmation === "yes" &&
      stayingCityExpress === "yes" &&
      requiresTransportation === "yes"
        ? transportationGuests
        : 0;

    const payload = {
      inviteID: guest.inviteID,

      action: "finalConfirmation",

      finalConfirmation,

      stayingCityExpress:
        finalStayingCityExpress,

      requiresTransportation:
        finalRequiresTransportation,

      transportationGuests:
        finalTransportationGuests,
    };

    console.log(
      "Submitting final confirmation:",
      payload
    );

    try {
      const res = await fetch(API_URL, {
        method: "POST",

        headers: {
          "Content-Type":
            "text/plain;charset=utf-8",
        },

        body: JSON.stringify(payload),
      });

      const responseText = await res.text();

      console.log(
        "Raw final confirmation response:",
        responseText
      );

      if (!res.ok) {
        throw new Error(
          `HTTP error ${res.status}: ${responseText}`
        );
      }

      let data: {
        success?: boolean;
        error?: string;
      };

      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error(
          `The final confirmation service returned invalid JSON: ${responseText}`
        );
      }

      if (data.success !== true) {
        throw new Error(
          data.error ||
            "The final confirmation was not saved."
        );
      }

      setGuest((currentGuest) =>
        currentGuest
          ? {
              ...currentGuest,
              finalConfirmation,
              stayingCityExpress:
                finalStayingCityExpress,
              requiresTransportation:
                finalRequiresTransportation,
              transportationGuests:
                finalTransportationGuests,
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

  /*
   * Loading
   */

  if (loading) {
    return (
      <section className="min-h-screen py-24 px-6 text-center bg-[#FFFAEE]">
        <h2
          className={`${antic.className} text-4xl font-bold`}
        >
          Confirmación Final
        </h2>

        <p className="mt-4 text-gray-600">
          Cargando invitación...
        </p>
      </section>
    );
  }

  /*
   * Guest not found
   */

  if (!guest) {
    return (
      <section className="min-h-screen py-24 px-6 text-center bg-[#FFFAEE]">
        <h2
          className={`${antic.className} text-4xl font-bold`}
        >
          Confirmación Final
        </h2>

        <p className="mt-4 text-gray-600">
          Invitación no encontrada.
        </p>
      </section>
    );
  }

  /*
   * Only guests who originally RSVP'd YES
   * should have access to final confirmation.
   */

  if (guest.rsvpStatus?.toLowerCase() !== "yes") {
    return (
      <section className="min-h-screen py-24 px-6 text-center bg-[#FFFAEE]">
        <div className="max-w-xl mx-auto">
          <h2
            className={`${antic.className} text-4xl font-bold text-[#222222]`}
          >
            Confirmación Final
          </h2>

          <p
            className={`${cormorant.className} mt-6 text-xl text-gray-700`}
          >
            Esta confirmación está disponible para
            invitados que previamente confirmaron su
            asistencia.
          </p>
        </div>
      </section>
    );
  }

  const maxTransportationGuests =
    Math.max(
      Number(guest.guestsAttending ?? 1),
      1
    );

  return (
    <section
      className={`${bodoni.className} min-h-screen py-20 px-6 bg-[#FFFAEE]`}
    >
      <div className="w-full max-w-xl mx-auto space-y-8">

        {/* Header */}
        <div className="text-center space-y-3">
          <p
            className={`${cormorant.className} text-2xl text-gray-600`}
          >
            Alec & Danaee
          </p>

          <h1
            className={`${antic.className} text-5xl font-bold text-[#222222]`}
          >
            Confirmación Final
          </h1>

          <p
            className={`${cormorant.className} text-2xl text-[#222222]`}
          >
            ¡Hola, {guest.name}! 🤍
          </p>
        </div>

        {/* Guest information */}
        <div className="bg-[#FFFDF8] border rounded-2xl p-6 shadow-sm text-center space-y-3">
          <p
            className={`${cormorant.className} text-xl text-gray-700`}
          >
            ¡Ya falta muy poco para nuestro gran día!
          </p>

          <p
            className={`${cormorant.className} text-lg text-gray-600`}
          >
            Actualmente tenemos confirmada tu
            asistencia para{" "}
            <span className="font-bold text-[#222222]">
              {guest.guestsAttending}
            </span>{" "}
            {guest.guestsAttending === 1
              ? "persona"
              : "personas"}.
          </p>
        </div>

        {/* Already submitted */}
        {submitted ? (
          <div className="bg-[#FFFDF8] border rounded-2xl p-8 shadow-sm text-center space-y-4">

            {guest.finalConfirmation === "yes" ? (
              <>
                <h2
                  className={`${antic.className} text-3xl font-bold text-[#222222]`}
                >
                  ¡Nos vemos muy pronto! 🤍
                </h2>

                <p
                  className={`${cormorant.className} text-xl text-gray-700`}
                >
                  Tu asistencia ha sido confirmada.
                </p>

                {guest.stayingCityExpress ===
                  "yes" && (
                  <div className="pt-4 border-t">
                    <p
                      className={`${cormorant.className} text-lg text-gray-700`}
                    >
                      Hospedaje:{" "}
                      <span className="font-semibold">
                        City Express Plus
                      </span>
                    </p>

                    {guest.requiresTransportation ===
                      "yes" && (
                      <p
                        className={`${cormorant.className} mt-2 text-lg text-gray-700`}
                      >
                        Transporte solicitado para{" "}
                        <span className="font-semibold">
                          {
                            guest.transportationGuests
                          }
                        </span>{" "}
                        {guest.transportationGuests ===
                        1
                          ? "persona"
                          : "personas"}
                        .
                      </p>
                    )}
                  </div>
                )}
              </>
            ) : (
              <>
                <h2
                  className={`${antic.className} text-3xl font-bold text-[#222222]`}
                >
                  Gracias por avisarnos 🤍
                </h2>

                <p
                  className={`${cormorant.className} text-xl text-gray-700`}
                >
                  Hemos actualizado tu confirmación.
                </p>
              </>
            )}
          </div>
        ) : (

          /* Final confirmation form */

          <form
            onSubmit={handleSubmit}
            className="bg-[#FFFDF8] border rounded-2xl p-6 shadow-sm space-y-8"
          >

            {/* Attendance */}
            <div className="space-y-4">
              <div className="text-center">
                <h2
                  className={`${antic.className} text-2xl font-bold text-[#222222]`}
                >
                  Última Confirmación
                </h2>

                <p
                  className={`${cormorant.className} mt-2 text-xl text-gray-700`}
                >
                  ¿Aún podremos contar con tu
                  presencia?
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setFinalConfirmation("yes")
                  }
                  className={`py-3 px-4 rounded-full border transition cursor-pointer ${
                    finalConfirmation === "yes"
                      ? "bg-black text-white"
                      : "bg-white text-[#222222] hover:bg-gray-100"
                  }`}
                >
                  Sí 🤍
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setFinalConfirmation("no");
                    setStayingCityExpress("");
                    setRequiresTransportation("");
                    setTransportationGuests(1);
                  }}
                  className={`py-3 px-4 rounded-full border transition cursor-pointer ${
                    finalConfirmation === "no"
                      ? "bg-black text-white"
                      : "bg-white text-[#222222] hover:bg-gray-100"
                  }`}
                >
                  Ya no podré asistir
                </button>
              </div>
            </div>

            {/* Hotel questions */}
            {finalConfirmation === "yes" && (
              <div className="pt-6 border-t space-y-6">

                <div className="text-center">
                  <h2
                    className={`${antic.className} text-2xl font-bold text-[#222222]`}
                  >
                    Hospedaje y Transporte
                  </h2>

                  <p
                    className={`${cormorant.className} mt-2 text-lg text-gray-600`}
                  >
                    Para ayudarnos a organizar el
                    transporte, por favor comparte con
                    nosotros tus planes de hospedaje.
                  </p>
                </div>

                {/* City Express */}
                <div className="space-y-3">
                  <p
                    className={`${cormorant.className} text-xl text-center text-[#222222]`}
                  >
                    ¿Te hospedarás en{" "}
                    <span className="font-semibold">
                      City Express Plus
                    </span>
                    ?
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setStayingCityExpress("yes")
                      }
                      className={`py-3 rounded-full border transition cursor-pointer ${
                        stayingCityExpress === "yes"
                          ? "bg-black text-white"
                          : "bg-white text-[#222222] hover:bg-gray-100"
                      }`}
                    >
                      Sí
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setStayingCityExpress("no");
                        setRequiresTransportation(
                          ""
                        );
                        setTransportationGuests(1);
                      }}
                      className={`py-3 rounded-full border transition cursor-pointer ${
                        stayingCityExpress === "no"
                          ? "bg-black text-white"
                          : "bg-white text-[#222222] hover:bg-gray-100"
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>

                {/* Transportation */}
                {stayingCityExpress === "yes" && (
                  <div className="space-y-3">
                    <p
                      className={`${cormorant.className} text-xl text-center text-[#222222]`}
                    >
                      ¿Requerirás transporte de City
                      Express Plus al lugar del evento?
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setRequiresTransportation(
                            "yes"
                          )
                        }
                        className={`py-3 rounded-full border transition cursor-pointer ${
                          requiresTransportation ===
                          "yes"
                            ? "bg-black text-white"
                            : "bg-white text-[#222222] hover:bg-gray-100"
                        }`}
                      >
                        Sí
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setRequiresTransportation(
                            "no"
                          );
                          setTransportationGuests(1);
                        }}
                        className={`py-3 rounded-full border transition cursor-pointer ${
                          requiresTransportation ===
                          "no"
                            ? "bg-black text-white"
                            : "bg-white text-[#222222] hover:bg-gray-100"
                        }`}
                      >
                        No
                      </button>
                    </div>
                  </div>
                )}

                {/* Transportation guest count */}
                {stayingCityExpress === "yes" &&
                  requiresTransportation ===
                    "yes" && (
                    <div className="space-y-3">
                      <label
                        htmlFor="transportationGuests"
                        className={`${cormorant.className} block text-xl text-center text-[#222222]`}
                      >
                        ¿Cuántas personas requerirán
                        transporte?
                      </label>

                      <select
                        id="transportationGuests"
                        value={
                          transportationGuests
                        }
                        onChange={(e) =>
                          setTransportationGuests(
                            Number(e.target.value)
                          )
                        }
                        className="w-full border rounded-lg p-3 bg-white"
                      >
                        {Array.from(
                          {
                            length:
                              maxTransportationGuests,
                          },
                          (_, index) => index + 1
                        ).map((number) => (
                          <option
                            key={number}
                            value={number}
                          >
                            {number}{" "}
                            {number === 1
                              ? "persona"
                              : "personas"}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
              </div>
            )}

            {/* Submit */}
            {finalConfirmation && (
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-black text-white py-3 rounded-full hover:bg-gray-800 transition cursor-pointer disabled:opacity-50"
              >
                {submitting
                  ? "Guardando..."
                  : "Confirmar respuestas"}
              </button>
            )}
          </form>
        )}

        {/* Itinerary */}
        <div className="bg-[#FFFDF8] border rounded-2xl p-8 shadow-sm text-center">
          <h2
            className={`${antic.className} text-3xl font-bold text-[#222222]`}
          >
            Itinerario
          </h2>

          <p
            className={`${cormorant.className} mt-2 text-lg text-gray-600`}
          >
            Te compartimos los horarios de nuestro gran día en{" "}
            <span className="font-semibold text-[#222222]">
              IMANHA
            </span>
          </p>

          <div className="mt-8 space-y-6">
            <div>
              <p
                className={`${cormorant.className} text-3xl font-semibold text-[#222222]`}
              >
                4:00 PM
              </p>

              <p
                className={`${cormorant.className} text-xl text-gray-700 mt-1`}
              >
                Ceremonia
              </p>
            </div>

            <div className="flex justify-center">
              <div className="h-8 w-px bg-gray-300" />
            </div>

            <div>
              <p
                className={`${cormorant.className} text-3xl font-semibold text-[#222222]`}
              >
                6:00 PM
              </p>

              <p
                className={`${cormorant.className} text-xl text-gray-700 mt-1`}
              >
                Recepción
              </p>
            </div>
          </div>
        </div>

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
              Te recordamos nuestro código de
              vestimenta. ¡Gracias! 🤍
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
    </section>
  );
}