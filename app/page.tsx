export default function HomePage() {
  return (
    <main className="grid min-h-svh place-items-center px-5 py-12 sm:px-8">
      <section className="w-full max-w-2xl rounded-[2rem] border border-border bg-surface p-7 shadow-[0_20px_60px_rgba(42,48,43,0.08)] sm:p-12">
        <div className="mb-8 flex items-center gap-3">
          <span
            aria-hidden="true"
            className="size-2.5 rounded-full bg-brand"
          />

          <p className="text-sm font-semibold tracking-[0.18em] text-brand">
            RESTNEST
          </p>
        </div>

        <h1 className="max-w-xl text-4xl font-semibold tracking-[-0.04em] text-foreground sm:text-5xl sm:leading-[1.08]">
          A fresh foundation for easier renting.
        </h1>
      </section>
    </main>
  );
}