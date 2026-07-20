"use client";

import { useState, type FormEvent } from "react";
import { submitNetlifyForm } from "@/lib/forms";
import { TextAreaField, TextField } from "@/components/forms/Field";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set("form-name", "contact");

    setStatus("submitting");
    try {
      await submitNetlifyForm(formData);
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="border-t border-forest/15 pt-6">
        <p className="font-display text-2xl font-semibold text-ink">Message sent.</p>
        <p className="mt-2 text-base text-charcoal/75">
          Thanks — we’ll get back to you shortly. For faster help, give us a call.
        </p>
      </div>
    );
  }

  return (
    <form
      name="contact"
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      onSubmit={onSubmit}
      className="space-y-5"
    >
      <input type="hidden" name="form-name" value="contact" />
      <p className="hidden">
        <label>
          Don’t fill this out: <input name="bot-field" />
        </label>
      </p>

      <TextField label="Full name" name="name" required autoComplete="name" />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Email" name="email" type="email" required autoComplete="email" />
        <TextField label="Phone" name="phone" type="tel" autoComplete="tel" />
      </div>
      <TextAreaField label="Message" name="message" required />

      {status === "error" ? (
        <p className="text-sm font-medium text-red-700">
          Something went wrong. Please try again or call us directly.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex rounded-sm bg-forest px-6 py-3.5 text-sm font-bold text-cream transition hover:bg-leaf disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
