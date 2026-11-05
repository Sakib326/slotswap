"use client";

import React, { useState } from "react";

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
  website: string; // Honeypot field
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormState>({
    name: "",
    email: "",
    subject: "",
    message: "",
    website: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const validate = () => {
    const errs: Partial<Record<keyof FormState, string>> = {};

    if (!formData.name.trim() || formData.name.length < 2 || formData.name.length > 80) {
      errs.name = "Name must be between 2 and 80 characters.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      errs.email = "Please enter a valid university or personal email.";
    }

    if (!formData.subject.trim() || formData.subject.length < 3 || formData.subject.length > 120) {
      errs.subject = "Subject must be between 3 and 120 characters.";
    }

    if (!formData.message.trim() || formData.message.length < 10 || formData.message.length > 2000) {
      errs.message = "Message must be between 10 and 2000 characters.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormState]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!validate()) {
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Failed to submit message. Please try again.");
      }

      setStatus("success");
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "An unexpected error occurred. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="border border-ink/15 rounded-[12px] p-6 bg-white/70 text-left">
        <h3 className="font-heading font-bold text-lg text-ink mb-2">
          Message sent
        </h3>
        <p className="text-sm text-ink/80 leading-relaxed">
          Thank you for reaching out. We received your message and will reply within two working days.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-ink/15 rounded-[12px] p-6 sm:p-8 bg-white/70 text-left">
      <h2 className="font-heading font-bold text-xl text-ink mb-2">
        Send a message
      </h2>
      <p className="text-xs sm:text-sm text-ink/70 mb-6">
        All fields marked with an asterisk are required.
      </p>

      {status === "error" && (
        <div
          role="alert"
          className="mb-5 p-3 rounded-[6px] border border-signal/30 bg-marker-pink/30 text-xs text-signal font-medium"
        >
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Honeypot field */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input
            id="website"
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={formData.website}
            onChange={handleChange}
          />
        </div>

        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-xs font-semibold uppercase tracking-wider text-ink/75 mb-1"
          >
            Name *
          </label>
          <input
            id="name"
            type="text"
            name="name"
            required
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
            className={`w-full h-10 rounded-[8px] border bg-white px-3 text-sm text-ink transition focus:outline-none focus:ring-2 focus:ring-pine ${
              errors.name ? "border-signal" : "border-ink/20"
            }`}
          />
          {errors.name && (
            <p id="name-error" className="mt-1 text-xs text-signal">
              {errors.name}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-semibold uppercase tracking-wider text-ink/75 mb-1"
          >
            University or personal email *
          </label>
          <input
            id="email"
            type="email"
            name="email"
            required
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            value={formData.email}
            onChange={handleChange}
            placeholder="student@university.edu"
            className={`w-full h-10 rounded-[8px] border bg-white px-3 text-sm text-ink transition focus:outline-none focus:ring-2 focus:ring-pine ${
              errors.email ? "border-signal" : "border-ink/20"
            }`}
          />
          {errors.email && (
            <p id="email-error" className="mt-1 text-xs text-signal">
              {errors.email}
            </p>
          )}
        </div>

        {/* Subject */}
        <div>
          <label
            htmlFor="subject"
            className="block text-xs font-semibold uppercase tracking-wider text-ink/75 mb-1"
          >
            Subject *
          </label>
          <input
            id="subject"
            type="text"
            name="subject"
            required
            aria-invalid={!!errors.subject}
            aria-describedby={errors.subject ? "subject-error" : undefined}
            value={formData.subject}
            onChange={handleChange}
            placeholder="e.g. Question about CSE327 cycle matching"
            className={`w-full h-10 rounded-[8px] border bg-white px-3 text-sm text-ink transition focus:outline-none focus:ring-2 focus:ring-pine ${
              errors.subject ? "border-signal" : "border-ink/20"
            }`}
          />
          {errors.subject && (
            <p id="subject-error" className="mt-1 text-xs text-signal">
              {errors.subject}
            </p>
          )}
        </div>

        {/* Message */}
        <div>
          <label
            htmlFor="message"
            className="block text-xs font-semibold uppercase tracking-wider text-ink/75 mb-1"
          >
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={4}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "message-error" : undefined}
            value={formData.message}
            onChange={handleChange}
            placeholder="Describe your inquiry..."
            className={`w-full rounded-[8px] border bg-white p-3 text-sm text-ink transition focus:outline-none focus:ring-2 focus:ring-pine ${
              errors.message ? "border-signal" : "border-ink/20"
            }`}
          />
          {errors.message && (
            <p id="message-error" className="mt-1 text-xs text-signal">
              {errors.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full h-11 rounded-[8px] bg-pine hover:bg-pine-hover text-paper font-semibold text-sm transition disabled:opacity-50 cursor-pointer"
        >
          {status === "loading" ? "Sending message..." : "Send message"}
        </button>
      </form>
    </div>
  );
}
