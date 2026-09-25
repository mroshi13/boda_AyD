"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import {
  Cormorant_Garamond,
  Bodoni_Moda,
  Antic_Didone,
} from "next/font/google";

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
  "https://script.google.com/macros/s/AKfycbx1AoxTipX7uWyz1Yo-A3FyLETdalkYMO8teRaKQ9WX6_UP1h8jQdnyvsyPYfV8PkcfIg/exec";

type Guest = {
  inviteID?: string;
  name: string;
  p_number: string;

  guestsAllowed: number;

  rsvpStatus?: string;
  guestsAttending?: number;

  finalConfirmation?: string;

  stayingCityExpress?: string;

  requiresTransportation?: string;

  transportationGuests?: number;
};

export default function FinalConfirmation() {
  const [guest, setGuest] =
    useState<Guest | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [submitted, setSubmitted] =
    useState(false);

  /*
   * ========================================
   * FORM STATE
   * ========================================
   */

  const [
    finalConfirmation,
    setFinalConfirmation,
  ] = useState("");

  const [
    stayingCityExpress,
    setStayingCityExpress,
  ] = useState("");

  const [
    requiresTransportation,
    setRequiresTransportation,
  ] = useState("");

  const [
    transportationGuests,
    setTransportationGuests,
  ] = useState(1);

  /*
   * ========================================
   * LOAD GUEST
   * ========================================
   *
   * This starts immediately when the page
   * mounts, but DOES NOT prevent the rest
   * of the page from rendering.
   */

  useEffect(() => {
    const params =
      new URLSearchParams(
        window.location.search
      );

    const inviteID =
      params.get("inviteID");

    async function loadGuest() {
      if (!inviteID) {
        setLoading(false);
        return;
      }

      try {
        const url =
          `${API_URL}?inviteID=${encodeURIComponent(
            inviteID
          )}`;

        const res =
          await fetch(url);

        if (!res.ok) {
          throw new Error(
            `HTTP error ${res.status}`
          );
        }

        const data =
          await res.json();

        console.log(
          "Final confirmation response:",
          data
        );

        if (
          data.success === false ||
          data.error
        ) {
          setGuest(null);
          return;
        }

        const loadedGuest: Guest = {
          ...data,

          inviteID:
            data.inviteID ??
            inviteID,

          guestsAllowed:
            Number(
              data.guestsAllowed
            ),

          guestsAttending:
            Number(
              data.guestsAttending ??
                0
            ),

          transportationGuests:
            Number(
              data.transportationGuests ??
                0
            ),
        };

        setGuest(loadedGuest);

        /*
         * If the guest already completed
         * final confirmation, restore the
         * saved answers.
         */
        if (
          loadedGuest.finalConfirmation ===
            "yes" ||
          loadedGuest.finalConfirmation ===
            "no"
        ) {
          setFinalConfirmation(
            loadedGuest.finalConfirmation
          );

          setStayingCityExpress(
            loadedGuest.stayingCityExpress ??
              ""
          );

          setRequiresTransportation(
            loadedGuest.requiresTransportation ??
              ""
          );

          if (
            Number(
              loadedGuest.transportationGuests
            ) > 0
          ) {
            setTransportationGuests(
              Number(
                loadedGuest.transportationGuests
              )
            );
          }

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

  /*
   * ========================================
   * SUBMIT FINAL CONFIRMATION
   * ========================================
   */

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!guest || submitting) {
      return;
    }

    /*
     * Attendance validation
     */
    if (!finalConfirmation) {
      alert(
        "Por favor confirma si aún podremos contar con tu asistencia."
      );

      return;
    }

    /*
     * Hotel validation
     */
    if (
      finalConfirmation === "yes" &&
      !stayingCityExpress
    ) {
      alert(
        "Por favor indícanos si te hospedarás en City Express Plus."
      );

      return;
    }

    /*
     * Transportation validation
     */
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

    const maxGuests =
      Math.max(
        Number(
          guest.guestsAttending ?? 1
        ),
        1
      );

    /*
     * Transportation seat validation
     */
    if (
      finalConfirmation === "yes" &&
      stayingCityExpress === "yes" &&
      requiresTransportation === "yes" &&
      (
        transportationGuests < 1 ||
        transportationGuests >
          maxGuests
      )
    ) {
      alert(
        "Por favor ingresa un número válido de personas que requerirán transporte."
      );

      return;
    }

    /*
     * Normalize hotel / transportation
     * answers before sending them.
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
      inviteID:
        guest.inviteID,

      action:
        "finalConfirmation",

      finalConfirmation,

      stayingCityExpress:
        finalStayingCityExpress,

      requiresTransportation:
        finalRequiresTransportation,

      transportationGuests:
        finalTransportationGuests,
    };

    /*
     * Save the old guest state so we can
     * roll back if Google Apps Script
     * rejects the request.
     */

    const previousGuest = {
      ...guest,
    };

    /*
     * ========================================
     * OPTIMISTIC UI
     * ========================================
     *
     * Immediately show the confirmation
     * result instead of waiting for Apps
     * Script to finish.
     */

    const optimisticGuest: Guest = {
      ...guest,

      finalConfirmation,

      stayingCityExpress:
        finalStayingCityExpress,

      requiresTransportation:
        finalRequiresTransportation,

      transportationGuests:
        finalTransportationGuests,
    };

    setSubmitting(true);

    setGuest(
      optimisticGuest
    );

    setSubmitted(true);

    try {
      const res =
        await fetch(API_URL, {
          method: "POST",

          headers: {
            "Content-Type":
              "text/plain;charset=utf-8",
          },

          body:
            JSON.stringify(payload),
        });

      const responseText =
        await res.text();

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
        data =
          JSON.parse(
            responseText
          );
      } catch {
        throw new Error(
          `Invalid JSON response: ${responseText}`
        );
      }

      if (
        data.success !== true
      ) {
        throw new Error(
          data.error ||
            "The confirmation was not saved."
        );
      }

      console.log(
        "Final confirmation saved:",
        data
      );
    } catch (error) {
      console.error(
        "Failed to submit final confirmation:",
        error
      );

      /*
       * Roll back the optimistic update.
       */

      setGuest(
        previousGuest
      );

      setSubmitted(false);

      alert(
        "No pudimos guardar tu confirmación. Por favor intenta nuevamente."
      );
    } finally {
      setSubmitting(false);
    }
  }

  /*
   * ========================================
   * TRANSPORTATION LIMIT
   * ========================================
   */

  const maxTransportationGuests =
    guest
      ? Math.max(
          Number(
            guest.guestsAttending ?? 1
          ),
          1
        )
      : 1;

  /*
   * ========================================
   * PAGE
   * ========================================
   *
   * Notice that there is NO global
   * "if (loading)" return anymore.
   *
   * The static page renders immediately
   * while guest information loads in the
   * background.
   */

  return (
    <section
      className={`${bodoni.className} min-h-screen py-20 px-6 bg-[#FFFAEE]`}
    >
      <div className="w-full max-w-xl mx-auto space-y-8">

        {/* =================================
            HEADER
        ================================= */}

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
            className={`${cormorant.className} text-xl text-gray-700`}
          >
            ¡Ya falta muy poco para
            nuestro gran día! 🤍
          </p>
        </div>

        {/* =================================
            ITINERARY
        ================================= */}

        <div className="bg-[#FFFDF8] border rounded-2xl p-8 shadow-sm text-center">

          <h2
            className={`${antic.className} text-3xl font-bold text-[#222222]`}
          >
            Itinerario
          </h2>

          <p
            className={`${cormorant.className} mt-2 text-lg text-gray-600`}
          >
            Te compartimos los
            horarios de nuestro gran
            día en{" "}
            <span className="font-semibold text-[#222222]">
              IMANHA
            </span>
            .
          </p>

          <div className="mt-8 space-y-6">

            {/* CEREMONY */}

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

            {/* DIVIDER */}

            <div className="flex justify-center">
              <div className="h-8 w-px bg-gray-300" />
            </div>

            {/* RECEPTION */}

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

        {/* =================================
            DRESS CODE
        ================================= */}

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
              Te recordamos nuestro
              código de vestimenta.
              ¡Gracias! 🤍
            </p>

          </div>

          {/* DRESS CODE DETAILS */}

          <div
            className={`${cormorant.className} text-xl text-[#222222] space-y-1`}
          >
            <p>
              <span className="font-semibold">
                Hombres:
              </span>{" "}
              Vestimenta formal
            </p>

            <p>
              <span className="font-semibold">
                Mujeres:
              </span>{" "}
              Vestido largo
            </p>
          </div>

          {/* DRESS CODE IMAGE */}

          <div className="overflow-hidden rounded-xl">
            <Image
              src="/images/codigo_vestimenta.jpg"
              alt="Código de vestimenta para la boda de Alec y Danaee"
              width={1200}
              height={1600}
              sizes="(max-width: 640px) 100vw, 576px"
              className="w-full h-auto object-contain"
            />
          </div>

        </div>

        {/* =================================
            PERSONALIZED CONFIRMATION
        ================================= */}

        <div className="pt-4">

          {/*
           * -------------------------------
           * STILL LOADING
           * -------------------------------
           */}

          {loading ? (
            <div className="bg-[#FFFDF8] border rounded-2xl p-8 shadow-sm text-center space-y-3">

              <h2
                className={`${antic.className} text-3xl font-bold text-[#222222]`}
              >
                Tu Confirmación
              </h2>

              <p
                className={`${cormorant.className} text-xl text-gray-600`}
              >
                Cargando tu invitación...
              </p>

              {/*
               * Small loading animation
               */}
              <div className="flex justify-center pt-2">
                <div className="w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
              </div>

            </div>
          ) : !guest ? (

            /*
             * -------------------------------
             * GUEST NOT FOUND
             * -------------------------------
             */

            <div className="bg-[#FFFDF8] border rounded-2xl p-8 shadow-sm text-center">

              <h2
                className={`${antic.className} text-3xl font-bold text-[#222222]`}
              >
                Tu Confirmación
              </h2>

              <p
                className={`${cormorant.className} mt-3 text-xl text-gray-600`}
              >
                Invitación no encontrada.
              </p>

            </div>
          ) : guest.rsvpStatus?.toLowerCase() !==
            "yes" ? (

            /*
             * -------------------------------
             * ORIGINAL RSVP WAS NOT YES
             * -------------------------------
             */

            <div className="bg-[#FFFDF8] border rounded-2xl p-8 shadow-sm text-center">

              <h2
                className={`${antic.className} text-3xl font-bold text-[#222222]`}
              >
                Tu Confirmación
              </h2>

              <p
                className={`${cormorant.className} mt-3 text-xl text-gray-600`}
              >
                Esta confirmación está
                disponible para invitados
                que previamente confirmaron
                su asistencia.
              </p>

            </div>
          ) : (

            /*
             * -------------------------------
             * VALID GUEST
             * -------------------------------
             */

            <div className="space-y-6">

              {/* PERSONALIZED GREETING */}

              <div className="text-center space-y-2">

                <h2
                  className={`${antic.className} text-3xl font-bold text-[#222222]`}
                >
                  Tu Confirmación
                </h2>

                <p
                  className={`${cormorant.className} text-2xl text-[#222222]`}
                >
                  ¡Hola, {guest.name}! 🤍
                </p>

              </div>

              {/* CURRENT RSVP INFORMATION */}

              <div className="bg-[#FFFDF8] border rounded-2xl p-6 shadow-sm text-center space-y-3">

                <p
                  className={`${cormorant.className} text-xl text-gray-700`}
                >
                  ¡Ya falta muy poco para
                  nuestro gran día!
                </p>

                <p
                  className={`${cormorant.className} text-lg text-gray-600`}
                >
                  Actualmente tenemos
                  confirmada tu asistencia
                  para{" "}
                  <span className="font-bold text-[#222222]">
                    {
                      guest.guestsAttending
                    }
                  </span>{" "}
                  {guest.guestsAttending ===
                  1
                    ? "persona"
                    : "personas"}
                  .
                </p>

              </div>

              {/* =============================
                  ALREADY SUBMITTED
              ============================= */}

              {submitted ? (
                <div className="bg-[#FFFDF8] border rounded-2xl p-8 shadow-sm text-center space-y-4">

                  {guest.finalConfirmation ===
                  "yes" ? (
                    <>

                      <h2
                        className={`${antic.className} text-3xl font-bold text-[#222222]`}
                      >
                        ¡Nos vemos muy
                        pronto! 🤍
                      </h2>

                      <p
                        className={`${cormorant.className} text-xl text-gray-700`}
                      >
                        Tu asistencia ha
                        sido confirmada.
                      </p>

                      {guest.stayingCityExpress ===
                        "yes" && (
                        <div className="pt-4 border-t">

                          <p
                            className={`${cormorant.className} text-lg text-gray-700`}
                          >
                            Hospedaje:{" "}
                            <span className="font-semibold">
                              City Express
                              Plus
                            </span>
                          </p>

                          {guest.requiresTransportation ===
                            "yes" && (
                            <p
                              className={`${cormorant.className} mt-2 text-lg text-gray-700`}
                            >
                              Transporte
                              solicitado
                              para{" "}
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

                      {submitting && (
                        <p className="text-sm text-gray-500">
                          Guardando...
                        </p>
                      )}

                    </>
                  ) : (
                    <>

                      <h2
                        className={`${antic.className} text-3xl font-bold text-[#222222]`}
                      >
                        Gracias por
                        avisarnos 🤍
                      </h2>

                      <p
                        className={`${cormorant.className} text-xl text-gray-700`}
                      >
                        Hemos actualizado
                        tu confirmación.
                      </p>

                      {submitting && (
                        <p className="text-sm text-gray-500">
                          Guardando...
                        </p>
                      )}

                    </>
                  )}

                </div>
              ) : (

                /* ===========================
                   CONFIRMATION FORM
                =========================== */

                <form
                  onSubmit={
                    handleSubmit
                  }
                  className="bg-[#FFFDF8] border rounded-2xl p-6 shadow-sm space-y-8"
                >

                  {/* FINAL ATTENDANCE */}

                  <div className="space-y-4">

                    <div className="text-center">

                      <h2
                        className={`${antic.className} text-2xl font-bold text-[#222222]`}
                      >
                        Última
                        Confirmación
                      </h2>

                      <p
                        className={`${cormorant.className} mt-2 text-xl text-gray-700`}
                      >
                        ¿Aún podremos
                        contar con tu
                        presencia?
                      </p>

                    </div>

                    <div className="grid grid-cols-2 gap-3">

                      <button
                        type="button"
                        onClick={() =>
                          setFinalConfirmation(
                            "yes"
                          )
                        }
                        className={`py-3 px-4 rounded-full border transition cursor-pointer ${
                          finalConfirmation ===
                          "yes"
                            ? "bg-black text-white"
                            : "bg-white text-[#222222] hover:bg-gray-100"
                        }`}
                      >
                        Sí 🤍
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setFinalConfirmation(
                            "no"
                          );

                          setStayingCityExpress(
                            ""
                          );

                          setRequiresTransportation(
                            ""
                          );

                          setTransportationGuests(
                            1
                          );
                        }}
                        className={`py-3 px-4 rounded-full border transition cursor-pointer ${
                          finalConfirmation ===
                          "no"
                            ? "bg-black text-white"
                            : "bg-white text-[#222222] hover:bg-gray-100"
                        }`}
                      >
                        Ya no podré
                        asistir
                      </button>

                    </div>
                  </div>

                  {/* =========================
                      HOTEL / TRANSPORTATION
                  ========================= */}

                  {finalConfirmation ===
                    "yes" && (
                    <div className="pt-6 border-t space-y-6">

                      <div className="text-center">

                        <h2
                          className={`${antic.className} text-2xl font-bold text-[#222222]`}
                        >
                          Hospedaje y
                          Transporte
                        </h2>

                        <p
                          className={`${cormorant.className} mt-2 text-lg text-gray-600`}
                        >
                          Para ayudarnos a
                          organizar el
                          transporte, por
                          favor comparte
                          con nosotros tus
                          planes de
                          hospedaje.
                        </p>

                      </div>

                      {/* CITY EXPRESS */}

                      <div className="space-y-3">

                        <p
                          className={`${cormorant.className} text-xl text-center text-[#222222]`}
                        >
                          ¿Te hospedarás
                          en{" "}
                          <span className="font-semibold">
                            City Express
                            Plus
                          </span>
                          ?
                        </p>

                        <div className="grid grid-cols-2 gap-3">

                          <button
                            type="button"
                            onClick={() =>
                              setStayingCityExpress(
                                "yes"
                              )
                            }
                            className={`py-3 rounded-full border transition cursor-pointer ${
                              stayingCityExpress ===
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
                              setStayingCityExpress(
                                "no"
                              );

                              setRequiresTransportation(
                                ""
                              );

                              setTransportationGuests(
                                1
                              );
                            }}
                            className={`py-3 rounded-full border transition cursor-pointer ${
                              stayingCityExpress ===
                              "no"
                                ? "bg-black text-white"
                                : "bg-white text-[#222222] hover:bg-gray-100"
                            }`}
                          >
                            No
                          </button>

                        </div>
                      </div>

                      {/* TRANSPORTATION */}

                      {stayingCityExpress ===
                        "yes" && (
                        <div className="space-y-3">

                          <p
                            className={`${cormorant.className} text-xl text-center text-[#222222]`}
                          >
                            ¿Requerirás
                            transporte de
                            City Express
                            Plus al lugar
                            del evento?
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

                                setTransportationGuests(
                                  1
                                );
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

                      {/* TRANSPORTATION SEATS */}

                      {stayingCityExpress ===
                        "yes" &&
                        requiresTransportation ===
                          "yes" && (
                          <div className="space-y-3">

                            <label
                              htmlFor="transportationGuests"
                              className={`${cormorant.className} block text-xl text-center text-[#222222]`}
                            >
                              ¿Cuántas
                              personas
                              requerirán
                              transporte?
                            </label>

                            <select
                              id="transportationGuests"
                              value={
                                transportationGuests
                              }
                              onChange={(
                                e
                              ) =>
                                setTransportationGuests(
                                  Number(
                                    e
                                      .target
                                      .value
                                  )
                                )
                              }
                              className="w-full border rounded-lg p-3 bg-white"
                            >
                              {Array.from(
                                {
                                  length:
                                    maxTransportationGuests,
                                },
                                (
                                  _,
                                  index
                                ) =>
                                  index +
                                  1
                              ).map(
                                (
                                  number
                                ) => (
                                  <option
                                    key={
                                      number
                                    }
                                    value={
                                      number
                                    }
                                  >
                                    {
                                      number
                                    }{" "}
                                    {number ===
                                    1
                                      ? "persona"
                                      : "personas"}
                                  </option>
                                )
                              )}
                            </select>

                          </div>
                        )}

                    </div>
                  )}

                  {/* SUBMIT */}

                  {finalConfirmation && (
                    <button
                      type="submit"
                      disabled={
                        submitting
                      }
                      className="w-full bg-black text-white py-3 rounded-full hover:bg-gray-800 transition cursor-pointer disabled:opacity-50"
                    >
                      {submitting
                        ? "Guardando..."
                        : "Confirmar respuestas"}
                    </button>
                  )}

                </form>
              )}

            </div>
          )}

        </div>

      </div>
    </section>
  );
}