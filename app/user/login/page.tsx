import { Suspense } from "react";
import { UserLoginForm } from "./UserLoginForm";

export default function UserLoginPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto w-full max-w-md px-6 py-20 text-sm text-slate-600">Loading…</main>
      }
    >
      <UserLoginForm />
    </Suspense>
  );
}
