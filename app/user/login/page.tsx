import Link from "next/link";

export default function UserLoginPlaceholderPage() {
  return (
    <main className="mx-auto w-full max-w-md px-6 py-20">
      <h1 className="text-3xl font-semibold">User sign-in</h1>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">
        Interactive sign-in for normal users will be wired here later. Your account is created by
        an administrator; check your email for credentials.
      </p>
      <ul className="mt-6 list-inside list-disc space-y-2 text-sm text-slate-600">
        <li>
          <Link href="/user/forgot-password" className="font-medium text-slate-900 underline">
            Forgot password
          </Link>{" "}
          (OTP by email)
        </li>
        <li>
          <Link href="/" className="font-medium text-slate-900 underline">
            Back to site
          </Link>
        </li>
      </ul>
    </main>
  );
}
