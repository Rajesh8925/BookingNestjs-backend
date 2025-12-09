import Link from "next/link";

export default function Nav() {
  return (
    <nav>
      <ul>
        <li>
          <Link href="/login">Login</Link>
        </li>
        <li>
          <Link href="/signup">Signup</Link>
        </li>
      </ul>
    </nav>
  );
}
