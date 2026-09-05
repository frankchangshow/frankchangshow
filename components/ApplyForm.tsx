"use client";

import { useState, type FormEvent } from "react";
import { apply, site } from "@/lib/content";

const ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT;

type Status = "idle" | "sending" | "sent" | "error";

export function ApplyForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const message = String(data.get("message") ?? "");

    if (!ENDPOINT) {
      // No form backend configured yet: hand off to the visitor's mail client.
      const subject = encodeURIComponent(`Coaching application — ${name}`);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nWhat I'm working through:\n${message}`,
      );
      window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
      setStatus("sent");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div
        role="status"
        className="rounded-card border border-line bg-surface p-8 sm:p-10"
      >
        <p className="display text-3xl">{apply.success.title}</p>
        <p className="mt-3 leading-relaxed text-muted">{apply.success.body}</p>
      </div>
    );
  }

  const field =
    "w-full rounded-field border border-line bg-canvas px-4 py-3.5 text-ink placeholder:text-muted/70 transition-colors focus:border-accent";

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate={false}>
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-medium">{apply.fields.name}</span>
          <input
            name="name"
            type="text"
            required
            autoComplete="name"
            className={field}
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium">{apply.fields.email}</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className={field}
          />
        </label>
      </div>
      <label className="block">
        <span className="mb-2 block text-sm font-medium">{apply.fields.message}</span>
        <textarea
          name="message"
          required
          rows={7}
          placeholder={apply.fields.messagePlaceholder}
          className={`${field} resize-y leading-relaxed`}
        />
      </label>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex h-13 items-center justify-center rounded-btn bg-accent px-7 font-medium text-accent-fg transition-[filter,transform] hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : apply.submit}
        </button>
        <p className="text-sm text-muted">
          Everything you write here is confidential.
        </p>
      </div>
      {status === "error" ? (
        <p role="alert" className="text-sm text-accent">
          Something went wrong sending your application. Please email{" "}
          <a href={`mailto:${site.email}`} className="underline">
            {site.email}
          </a>{" "}
          directly.
        </p>
      ) : null}
    </form>
  );
}
