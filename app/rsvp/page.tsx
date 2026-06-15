"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const API_URL = "https://script.google.com/macros/s/AKfycbxDHavAQwnx2U-D2Up-eXZXC4kQebENmgLXN_rjVe_fWiO7Trt1k6ow1DLf2p2cvpGkRQ/exec";

type Guest = {
  name: string;
  email: string;
  guestsAllowed: number;
  message?: string;
  invited?: boolean;
  rsvpStatus?: string;
  guestsAttending?: number;
};

export default function RSVPPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const inviteID = searchParams.get("inviteID");

  const [guest, setGuest] = useState<Guest | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // 1. Fetch guest
  useEffect(() => {
    async function loadGuest() {
      if (!email || inviteID) {
        setLoading(false);
        return;
      }

      try {
        const query = inviteID ? `?inviteID=${inviteID}`:`?email=${email}`
        console.log(API_URL + query);
        const res = await fetch(API_URL + query)
        const data = await res.json();

        if (!data.error) {
          setGuest(data);
        }
      } catch (err) {
        console.error(err);
      }

      setLoading(false);
    }

    loadGuest();
  }, [email]);

  // 2. Submit RSVP
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    const form = new FormData(e.currentTarget);

    const payload = {
      email: guest?.email,
      rsvpStatus: form.get("rsvp"),
      guests: form.get("guests"),
      message: form.get("message"),
    };

    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    setSubmitting(false);
    setSubmitted(true);
  }

  // 3. Loading state
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        Loading invitation...
      </main>
    );
  }

  // 4. Invalid guest
  if (!email || !guest) {
    return (
      <main className="min-h-screen flex items-center justify-center text-center px-6">
        <div>
          <h1 className="text-xl font-semibold">
            Invitación no encontrada
          </h1>
          <p className="text-gray-500 mt-2">
            Por favor revisa tu enlace.
          </p>
        </div>
      </main>
    );
  }

  // 5. Success screen
  if (submitted) {
    return (
      <main className="min-h-screen flex items-center justify-center text-center px-6">
        <div>
          <h1 className="text-2xl font-bold">
            ¡Gracias, {guest.name}! 🎉
          </h1>
          <p className="text-gray-600 mt-2">
            Hemos recibido tu RSVP.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-lg space-y-6">

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">
            ¡Hola, {guest.name}! 💌
          </h1>

          {guest.message && (
            <p className="text-gray-600 italic">
              {guest.message}
            </p>
          )}
        </div>

        {/* Plus one info */}
        <div className="border rounded-2xl p-4 text-center">
          <p className="text-center">
            🎉 Tu invitacion es para {""}
            <span className="font-bold">
              {(guest.guestsAllowed+1)}
            </span>{" "}
            {guest.guestsAllowed === 1 ? "persona" : "personas"}.
          </p>
        </div>

        {/* RSVP form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <select
            name="rsvp"
            className="w-full border p-2 rounded"
            required
          >
            <option value="">¿Asistirás?</option>
            <option value="yes">Sí asistiré</option>
            <option value="no">No asistiré</option>
          </select>

          {guest.guestsAllowed > 1 && (
            <input
              name="guestsAttending"
              type="number"
              min={1}
              max={(guest.guestsAllowed+1)}
              className="w-full border p-2 rounded"
              placeholder={`Cuanta gente (max ${guest.guestsAllowed+1})`}
            />
          )}

          <textarea
            name="message"
            placeholder="Mensaje (opcional)"
            className="w-full border p-2 rounded"
          />

          <button
            disabled={submitting}
            className="w-full bg-black text-white py-2 rounded-full"
          >
            {submitting ? "Enviando..." : "Confirmar RSVP"}
          </button>

        </form>
      </div>
    </main>
  );
}