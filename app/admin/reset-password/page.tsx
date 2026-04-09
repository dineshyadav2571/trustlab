import { Suspense } from "react";
import { ResetPasswordForm } from "./ResetPasswordForm";

function ResetPasswordFallback() {
  return (
    <main className="mx-auto w-full max-w-md px-6 py-20">
      <h1 className="text-3xl font-semibold">Reset Password</h1>
      <p className="mt-2 text-sm text-slate-600">Loading…</p>
      <div className="mt-8 h-96 animate-pulse rounded-xl border bg-slate-50" />
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
