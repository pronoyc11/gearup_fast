"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <main className="mx-auto grid min-h-[calc(100vh-66px)] max-w-lg content-center px-4 py-10">
      <section className="panel space-y-4 p-6">
        <h1 className="text-2xl font-black">Something went wrong</h1>
        <p className="text-zinc-600">{error.message}</p>
        <button className="btn btn-primary" onClick={reset}>Try again</button>
      </section>
    </main>
  );
}
