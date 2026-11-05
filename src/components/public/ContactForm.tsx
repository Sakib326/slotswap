"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

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
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        website: "",
      });
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-border p-6 md:p-8 shadow-sm">
      <h2 className="text-2xl font-bold font-heading text-text mb-2">
        Send us a message
      </h2>
      <p className="text-sm text-text-muted mb-6">
        Fill out the form below and our team will get back to you shortly.
      </p>

      {status === "success" && (
        <div
          role="alert"
          className="mb-6 p-4 rounded-xl bg-success-soft border border-success/30 flex items-start gap-3 text-text"
        >
          <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-sm">Message received!</h3>
            <p className="text-xs text-text-muted mt-0.5">
              Thank you for reaching out. We have logged your request and will reply within 2 working days.
            </p>
          </div>
        </div>
      )}

      {status === "error" && (
        <div
          role="alert"
          className="mb-6 p-4 rounded-xl bg-danger-soft border border-danger/30 flex items-start gap-3 text-text"
        >
          <AlertCircle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-sm">Unable to send message</h3>
            <p className="text-xs text-text-muted mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Honeypot field (hidden from human users) */}
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
            className="block text-sm font-medium text-text mb-1.5"
          >
            Full Name <span className="text-danger">*</span>
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
            placeholder="e.g. John Doe"
            className={`w-full h-11 rounded-xl border bg-white px-3 text-sm text-text transition focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.name ? "border-danger ring-1 ring-danger" : "border-border"
            }`}
          />
          {errors.name && (
            <p id="name-error" className="mt-1 text-xs text-danger flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.name}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-text mb-1.5"
          >
            Email Address <span className="text-danger">*</span>
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
            placeholder="e.g. yourname@northsouth.edu"
            className={`w-full h-11 rounded-xl border bg-white px-3 text-sm text-text transition focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.email ? "border-danger ring-1 ring-danger" : "border-border"
            }`}
          />
          {errors.email && (
            <p id="email-error" className="mt-1 text-xs text-danger flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.email}
            </p>
          )}
        </div>

        {/* Subject */}
        <div>
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-text mb-1.5"
          >
            Subject <span className="text-danger">*</span>
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
            placeholder="e.g. Question about CSE327 section matching"
            className={`w-full h-11 rounded-xl border bg-white px-3 text-sm text-text transition focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.subject ? "border-danger ring-1 ring-danger" : "border-border"
            }`}
          />
          {errors.subject && (
            <p id="subject-error" className="mt-1 text-xs text-danger flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.subject}
            </p>
          )}
        </div>

        {/* Message */}
        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-text mb-1.5"
          >
            Message <span className="text-danger">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "message-error" : undefined}
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell us how we can help you..."
            className={`w-full rounded-xl border bg-white p-3 text-sm text-text transition focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.message ? "border-danger ring-1 ring-danger" : "border-border"
            }`}
          />
          {errors.message && (
            <p id="message-error" className="mt-1 text-xs text-danger flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full h-11 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold text-sm transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Sending message...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Send Message
            </>
          )}
        </button>
      </form>
    </div>
  );
}
