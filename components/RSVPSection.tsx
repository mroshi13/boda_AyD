"use client";

import { useEffect, useState } from "react";
import { Cormorant_Garamond, Cormorant_SC } from "next/font/google";
import { Bodoni_Moda } from "next/font/google";
import { Meow_Script } from "next/font/google";

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

const API_URL =
  "https://script.google.com/macros/s/AKfycbzmusq5cs5qGQhqL5-1vVKZgTp0RVWFQ6ioLsGAmOhzmKF5aWQebir_ze4Avct5H7682w/exec";

type Guest = {
  inviteID?: string;
  name: string;
  email: string;
  guestsAllowed: number;
  message?: string;
  invited?: boolean;
  rsvpStatus?: string;
  guestsAttending?: number;
};

export default function RSVPSection() {
  const [guest, setGuest] = useState<Guest | null>(null);
  const [inviteID, setInviteID] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const urlInviteID = params.get("inviteID");
    const urlEmail = params.get("email");

    setInviteID(urlInviteID);
    setEmail(urlEmail);

    async function loadGuest() {
      if (!urlInviteID && !urlEmail) {
        setLoading(false);
        return;
      }

      try {
        const query = urlInviteID
          ? `?inviteID=${encodeURIComponent(urlInviteID)}`
          : `?email=${encodeURIComponent(urlEmail ?? "")}`;

        const url = `${API_URL}${query}`;

        console.log("URL inviteID:", urlInviteID);
        console.log("Fetching RSVP guest:", url);

        const res = await fetch(url);
        const data = await res.json();

        console.log("RSVP response:", data);

        if (data.error) {
          setGuest(null);
        } else {
          setGuest({
            ...data,
            inviteID: data.inviteID ?? urlInviteID ?? undefined,
            guestsAllowed: Number(data.guestsAllowed),
            guestsAttending: Number(data.guestsAttending ?? 0),
          });
        }
      } catch (err) {
        console.error("Failed to load RSVP guest:", err);
        setGuest(null);
      } finally {
        setLoading(false);
      }
    }

    loadGuest();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!guest) return;

    setSubmitting(true);

    const form = new FormData(e.currentTarget);

    const payload = {
      inviteID: guest.inviteID ?? inviteID,
      email: guest.email,
      rsvpStatus: form.get("rsvp"),
      guestsAttending: Number(form.get("guestsAttending")),
      message: form.get("message"),
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      console.log("RSVP submit response:", data);

      if (!data.error) {
        setSubmitted(true);
      } else {
        console.error("RSVP submit error:", data.error);
      }
    } catch (err) {
      console.error("Failed to submit RSVP:", err);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <section id="rsvp" className="py-24 px-6 text-center">
        <h2 className="text-4xl font-bold">RSVP</h2>
        <p className="mt-4 text-gray-600">Cargando invitación...</p>
      </section>
    );
  }

  if (!guest) {
    return (
      <section id="rsvp" className="py-24 px-6 text-center">
        <h2 className={`${cormorant.className}text-4xl font-bold`}>RSVP</h2>
        <p className={`${cormorant.className}mt-4 text-gray-600`}>Invitación no encontrada.</p>

        <p className={`${cormorant.className}mt-4 text-xs text-gray-400`}>
          inviteID recibido: {inviteID || "ninguno"}
        </p>
      </section>
    );
  }

  return (
    <section id="rsvp" className={`${bodoni.className} py-24 px-6 flex bg-[#FFFAEE] justify-center`}>
      <div className="w-full max-w-xl space-y-6">
        <div className="text-center space-y-3">
          <h1 className={`${meow.className} text-4xl text-[#222222] font-bold`}>RSVP</h1>
          <h3 className={`${cormorant.className} text-2xl text-[#222222]`}>¡Hola, {guest.name}! 💌</h3>

          {guest.message && (
            <p className="text-gray-600 italic">{guest.message}</p>
          )}
        </div>

        <div className="bg-[#FFFDF8] border rounded-2xl p-6 shadow-sm text-center">
          <p className="text-lg">
            🎉 Tu invitación es para{" "}
            <span className="font-bold">{guest.guestsAllowed}</span>{" "}
            {guest.guestsAllowed === 1 ? "persona" : "personas"}.
          </p>
        </div>

        {submitted ? (
          <div className="bg-[#FFFDF8] border rounded-2xl p-8 shadow-sm text-center">
            <h2 className={`${cormorant.className} ext-3xl font-bold`}>¡Gracias, {guest.name}! 🎉</h2>
            <p className={`${cormorant.className} mt-4 text-gray-700`}>Hemos recibido tu RSVP.</p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-[#FFFDF8] border rounded-2xl p-6 shadow-sm space-y-4"
          >
            <select
              name="rsvp"
              required
              className="w-full border rounded-lg p-3"
            >
              <option value="">¿Asistirás?</option>
              <option value="yes">Sí asistiré</option>
              <option value="no">No asistiré</option>
            </select>

            <input
              name="guestsAttending"
              type="number"
              min={1}
              max={guest.guestsAllowed}
              required
              className="w-full border rounded-lg p-3"
              placeholder={`Número de asistentes (máx ${guest.guestsAllowed})`}
            />

            <textarea
              name="message"
              rows={4}
              className="w-full border rounded-lg p-3"
              placeholder="Mensaje para los novios (opcional)"
            />

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-black text-white py-3 rounded-full hover:bg-gray-800 transition cursor-pointer disabled:opacity-50"
            >
              {submitting ? "Enviando..." : "Confirmar RSVP"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}