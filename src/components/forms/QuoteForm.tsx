"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { services } from "@/data/services";
import { submitNetlifyForm } from "@/lib/forms";
import { TextAreaField, TextField } from "@/components/forms/Field";

export function QuoteForm() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set("form-name", "quote");

    const selected = services
      .map((service) => service.slug)
      .filter((slug) => formData.get(`service-${slug}`) === "on");
    formData.set("services", selected.join(", ") || "not specified");
    for (const slug of services.map((s) => s.slug)) {
      formData.delete(`service-${slug}`);
    }

    setStatus("submitting");
    try {
      await submitNetlifyForm(formData);
      router.push("/quote/thanks");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form
      name="quote"
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      onSubmit={onSubmit}
      className="space-y-5"
    >
      <input type="hidden" name="form-name" value="quote" />
      <p className="hidden">
        <label>
          Don’t fill this out: <input name="bot-field" />
        </label>
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Full name" name="name" required autoComplete="name" />
        <TextField label="Phone" name="phone" type="tel" required autoComplete="tel" />
      </div>
      <TextField label="Email" name="email" type="email" required autoComplete="email" />
      <TextField
        label="Property address"
        name="address"
        required
        autoComplete="street-address"
        placeholder="Street, city"
      />

      <fieldset>
        <legend className="text-sm font-semibold text-ink">Services needed</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {services.map((service) => (
            <label
              key={service.slug}
              className="flex items-center gap-2 text-sm text-charcoal/80"
            >
              <input
                type="checkbox"
                name={`service-${service.slug}`}
                className="accent-leaf"
              />
              {service.name}
            </label>
          ))}
        </div>
      </fieldset>

      <TextAreaField
        label="Project details"
        name="details"
        placeholder="Lot size, current condition, timing, anything we should know…"
      />

      {status === "error" ? (
        <p className="text-sm font-medium text-red-700">
          Something went wrong. Please try again or call us directly.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex rounded-sm bg-gold px-6 py-3.5 text-sm font-bold text-forest-deep transition hover:bg-gold-soft disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Request free quote"}
      </button>
    </form>
  );
}
