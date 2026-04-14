"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

export function UserResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = useMemo(() => searchParams.get("email") ?? "", [searchParams]);

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!email) {
      setError("Email is required.");
      return;
    }
    if (!otp || otp.length !== 6) {
      setError("Enter the 6-digit OTP from your email.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth/user/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp,
          newPassword,
        }),
      });

      const data = (await response.json()) as { error?: string; message?: string };
      if (!response.ok) {
        setError(data.error ?? "Unable to reset password.");
        return;
      }

      setMessage(data.message ?? "Password reset successful.");
      setTimeout(() => {
        router.push("/user/login");
        router.refresh();
      }, 1200);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-md px-6 py-20">
      <h1 className="text-3xl font-semibold">Reset password (user)</h1>
      <p className="mt-2 text-sm text-slate-600">
        Enter your email, OTP from your email, and choose a new password.
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
        <label className="block">
          <span className="mb-1 block text-sm font-medium">OTP</span>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            required
            value={otp}
            onChange={(event) =>
              setOtp(event.target.value.replace(/[^0-9]/g, "").slice(0, 6))
            }
            className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">New password</span>
          <input
            type="password"
            minLength={8}
            required
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Confirm password</span>
          <input
            type="password"
            minLength={8}
            required
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
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
          {isSubmitting ? "Resetting..." : "Reset password"}
        </button>

        <p className="text-center text-sm text-slate-600">
          <Link href="/user/login" className="font-medium text-slate-900 underline">
            Back to user sign-in
          </Link>
        </p>
      </form>
    </main>
  );
}
