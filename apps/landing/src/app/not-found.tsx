import Link from "next/link";
import { buttonVariants } from "@/shared/components/ui/button";
import { APP_URL } from "@/shared/lib/links";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-5 px-5 text-center">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight text-fg-4">
          We haven&apos;t written this one yet.
        </h1>
        <p className="max-w-md text-fg-3">
          That page doesn&apos;t exist. Head back home, or start writing straight away.
        </p>
      </div>
      <div className="flex flex-col items-center gap-3 md:flex-row">
        <Link
          href={APP_URL}
          className={buttonVariants({ variant: "primary", className: "h-11 px-5" })}
        >
          Start writing
        </Link>
        <Link
          href="/"
          className={buttonVariants({ variant: "secondary", className: "h-11 px-5" })}
        >
          Back home
        </Link>
      </div>
    </div>
  );
}
