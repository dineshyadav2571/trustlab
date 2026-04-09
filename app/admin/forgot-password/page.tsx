"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = (await response.json()) as { error?: string; message?: string };

      if (!response.ok) {
        setError(data.error ?? "Unable to send reset email.");
        return;
      }

      setMessage(
        data.message ?? "If this email exists, a password reset OTP was sent.",
      );
      setTimeout(() => {
        router.push(`/admin/reset-password?email=${encodeURIComponent(email)}`);
      }, 800);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-md px-6 py-20">
      <h1 className="text-3xl font-semibold">Forgot Password</h1>
      <p className="mt-2 text-sm text-slate-600">
        Enter your admin email to receive a one-time OTP code.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-xl border p-6">
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
          />
        </label>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {message ? <p className="text-sm text-emerald-700">{message}</p> : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-slate-900 px-4 py-2 text-white disabled:opacity-60"
        >
          {isSubmitting ? "Sending..." : "Send OTP"}
        </button>

        <p className="text-center text-sm text-slate-600">
          <Link href="/admin/login" className="font-medium text-slate-900 underline">
            Back to login
          </Link>
        </p>
      </form>
    </main>
  );
}
