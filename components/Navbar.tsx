import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="p-4 border-b">
      <ul className="flex gap-6 justify-center">
        <li>
          <Link href="/">Home</Link>
        </li>

        <li>
          <Link href="/historia">Nuestra Historia</Link>
        </li>

        <li>
          <Link href="/detalles">Detalles</Link>
        </li>

        <li>
          <Link href="/registro">Registro</Link>
        </li>

        <li>
          <Link href="/rsvp">RSVP</Link>
        </li>
      </ul>
    </nav>
  );
}
