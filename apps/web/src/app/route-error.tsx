import { isRouteErrorResponse, useNavigate, useRouteError } from "react-router";
import { buttonVariants } from "@/shared/components/ui/button";

function describe(error: unknown) {
  if (isRouteErrorResponse(error)) {
    return error.status === 404
      ? { title: "Page not found", detail: "That link doesn't lead anywhere." }
      : { title: `${error.status} ${error.statusText}`, detail: error.data as string };
  }
  if (error instanceof Error) {
    return { title: "Something went wrong", detail: error.message };
  }
  return { title: "Something went wrong", detail: "An unexpected error occurred." };
}

export function RouteError() {
  const error = useRouteError();
  const navigate = useNavigate();
  const { title, detail } = describe(error);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-[15px] font-semibold text-ink">{title}</h1>
        {detail && <p className="max-w-sm text-[13px] text-ink-muted">{detail}</p>}
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => void navigate("/")}
          className={buttonVariants({ variant: "primary" })}
        >
          Back to documents
        </button>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className={buttonVariants({ variant: "secondary" })}
        >
          Reload
        </button>
      </div>
    </div>
  );
}
