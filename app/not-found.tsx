import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-[1024px] flex-col items-center justify-center px-4 py-24 text-center">
      <h1 className="headline text-[40px] md:text-[48px]">This scent has evaporated.</h1>
      <p className="mt-3 text-[19px] text-mute">The page you&apos;re looking for can&apos;t be found.</p>
      <Link href="/" className="btn-dark mt-8">
        Back to PERF PERF
      </Link>
    </section>
  );
}
