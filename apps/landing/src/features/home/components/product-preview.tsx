import { PreviewTabs } from "./preview-tabs";

export function ProductPreview() {
  return (
    <div
      className="relative w-full py-8 pt-20 md:py-20 md:pt-28"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1710162734106-6932b5799f99?q=80&w=3132&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="dark absolute top-0 left-1/2 hidden h-13 -translate-x-1/2 items-center rounded-b-4xl bg-background px-5 md:flex">
        <div
          className="absolute top-0 -left-8 h-8 w-8"
          style={{
            background:
              "radial-gradient(circle at 0% 100%, transparent 32px, var(--color-white) 32.5px)",
          }}
        />
        <div
          className="absolute top-0 -right-8 h-8 w-8"
          style={{
            background:
              "radial-gradient(circle at 100% 100%, transparent 32px, var(--color-white) 32.5px)",
          }}
        />
        <PreviewTabs />
      </div>

      <div className="relative mx-auto max-w-5xl px-5">
        <img
          src="https://i.pinimg.com/736x/c8/e0/05/c8e005041ea9d8e1f7229e74e5eb4bb0.jpg"
          alt="Willow product preview (placeholder)"
          width={2880}
          height={1800}
          className="h-auto w-full rounded-4xl shadow-sm"
        />
      </div>
    </div>
  );
}
