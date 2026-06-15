export default function WeddingDetailsPage() {
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
      name: "Hotel Coral Marina",
      reservation: "https://www.hotelcoral.com/",
      maps: "https://maps.app.goo.gl/saZ69PC9wjxXJCpH9",
    },
  ];

  const linkClass =
    "text-blue-600 underline hover:text-blue-800 transition";

  const buttonPrimary =
    "px-4 py-2 bg-black text-white rounded-full text-center hover:bg-gray-800 transition";

  const buttonSecondary =
    "px-4 py-2 border border-gray-300 rounded-full text-center hover:bg-gray-100 transition";

  return (
    <main className="min-h-screen flex flex-col items-center text-center px-6 py-16 space-y-14">

      {/* Title */}
      <h1 className="text-4xl font-semibold tracking-tight">
        Detalles sobre la Misa y Recepción
      </h1>

      {/* Intro */}
      <div className="max-w-2xl space-y-4 text-gray-700 leading-relaxed">
        <p>
          Muchas gracias por acompañarnos al Valle de Guadalupe en esta ocasión tan importante para nosotros.
        </p>

        <p>
          La misa será a las 3:30pm en la Capilla X de la Madre, para los que gusten acompañarnos.
        </p>

        <p>
          La recepción iniciará a las 5:00pm en IMANHA.
        </p>
      </div>

      {/* Venue */}
      <div className="max-w-xl w-full border rounded-2xl p-6 bg-white shadow-sm">
        <h2 className="font-semibold text-lg">IMANHA</h2>

        <a
          href="https://maps.app.goo.gl/yWLM1V2Bep94eHXk9"
          target="_blank"
          className={linkClass}
        >
          Lote Francisco, Zarco, 22753 Francisco Zarco, B.C., Mexico
        </a>
      </div>

      {/* Hotels Section */}
      <div className="w-full max-w-5xl space-y-12">

        <h2 className="text-2xl font-semibold">
          Detalles sobre el hospedaje
        </h2>

        {/* Inside Valley */}
        <div className="space-y-6">
          <p className="font-medium underline">
            Dentro del Valle:
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            {hotelsInValley.map((hotel) => (
              <div
                key={hotel.name}
                className="border rounded-2xl p-6 bg-white shadow-sm hover:shadow-md transition text-left"
              >
                <h3 className="text-lg font-semibold">
                  🏨 {hotel.name}
                </h3>

                <div className="mt-4 flex flex-col gap-3">

                  <a
                    href={hotel.reservation}
                    target="_blank"
                    className={buttonPrimary}
                  >
                    🔖 Reservaciones
                  </a>

                  <a
                    href={hotel.maps}
                    target="_blank"
                    className={buttonSecondary}
                  >
                    📍 Ver en Google Maps
                  </a>

                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Outside Valley */}
        <div className="space-y-6">
          <p className="font-medium underline">
            Fuera del Valle:
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            {hotelsOutsideValley.map((hotel) => (
              <div
                key={hotel.name}
                className="border rounded-2xl p-6 bg-white shadow-sm hover:shadow-md transition text-left"
              >
                <h3 className="text-lg font-semibold">
                  🏨 {hotel.name}
                </h3>

                <div className="mt-4 flex flex-col gap-3">

                  <a
                    href={hotel.reservation}
                    target="_blank"
                    className={buttonPrimary}
                  >
                    🔖 Reservaciones
                  </a>

                  <a
                    href={hotel.maps}
                    target="_blank"
                    className={buttonSecondary}
                  >
                    📍 Ver en Google Maps
                  </a>

                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full max-w-4xl">
          <h2 className="text-2xl font-bold mb-4">
            Ubicación del evento y hospedaje
          </h2>

          <iframe
            src="https://www.google.com/maps/d/embed?mid=1rCUmqy9BCmaMsxqlHVjMYwG2ggMvwS4&ehbc=2E312F&noprof=1"
            className="w-full h-[400px] rounded-2xl border shadow-sm"
            loading="lazy"
          />
        </div>
      </div>
    </main>
  );
}