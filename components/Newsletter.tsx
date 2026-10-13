"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (res.ok) {
      setStatus("done");
      setMessage("You're on the list. Watch your inbox for new arrivals.");
      setEmail("");
    } else {
      const data = await res.json().catch(() => ({}));
      setStatus("error");
      setMessage(data.error ?? "Something went wrong.");
    }
  }

  return (
    <div className="mx-auto mt-8 max-w-md">
      <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          className="input flex-1"
          aria-label="Email address"
        />
        <button type="submit" disabled={status === "loading"} className="btn-dark px-6 py-3.5 disabled:opacity-60">
          {status === "loading" ? "Joining…" : "Join"}
        </button>
      </form>
      {message && (
        <p className={`mt-3 text-[14px] ${status === "error" ? "text-red-600" : "text-mute"}`} role="status">
          {message}
        </p>
      )}
    </div>
  );
}
