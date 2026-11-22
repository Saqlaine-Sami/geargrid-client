import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-extrabold text-teal-700 mb-2">404</p>
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
        Page Not Found
      </h1>
      <p className="text-slate-600 max-w-md mb-6">
        The page or equipment you are looking for does not exist or has been moved.
      </p>
      <Link href="/" className="btn-brand">
        Go Back Home
      </Link>
    </div>
  );
}
