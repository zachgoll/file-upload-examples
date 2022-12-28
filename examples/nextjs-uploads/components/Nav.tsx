import Link from "next/link";
import { useRouter } from "next/router";

const paths = [
  {
    path: "/basic",
    display: "Basic uploads",
  },
  {
    path: "/vanilla-signed-urls",
    display: "Vanilla signed URLs",
  },
  {
    path: "/uppy-signed-urls",
    display: "Uppy signed URLs",
  },
];

export default function Nav() {
  const router = useRouter();

  return (
    <nav className="max-w-screen-sm mb-8 mt-2 bg-slate-50 w-full">
      <ul className="flex items-center justify-around gap-2 p-4">
        {paths.map((path) => (
          <li
            key={path.path}
            className={
              router.asPath === path.path
                ? "underline text-sky-500"
                : "hover:text-sky-500 hover:underline"
            }
          >
            <Link href={path.path}>{path.display}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
