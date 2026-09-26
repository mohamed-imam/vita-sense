"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import PhoneInput, { isValidPhoneNumber, type Value } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { ArrowRight, Check } from "lucide-react";

const appointmentEndpoint = "https://script.google.com/macros/s/AKfycbyBmeKwEsRM_m8ADtKL4uuDICQMXzzS6UV3mseb1wzdjLNNwDzuMRobOba1i6YYMubGtA/exec";

export default function AppointmentForm({ reveal = false }: { reveal?: boolean }) {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<Value>();
  const [phoneError, setPhoneError] = useState(false);
  const messageDetailsRef = useRef<HTMLTextAreaElement>(null);
  const messagePayloadRef = useRef<HTMLInputElement>(null);
  const responseFrameRef = useRef<HTMLIFrameElement>(null);
  const submissionTimeoutRef = useRef<number | undefined>(undefined);
  const submissionPendingRef = useRef(false);

  useEffect(() => {
    const handleFormResponse = (event: MessageEvent) => {
      const responseHost = (() => {
        try { return new URL(event.origin).hostname; } catch { return ""; }
      })();
      const isGoogleScriptResponse = responseHost === "script.google.com" || responseHost.endsWith(".googleusercontent.com");
      if (!isGoogleScriptResponse || event.source !== responseFrameRef.current?.contentWindow ||
          !submissionPendingRef.current || event.data?.type !== "vitasense-form") return;

      if (submissionTimeoutRef.current !== undefined) window.clearTimeout(submissionTimeoutRef.current);
      submissionPendingRef.current = false;
      setSubmitting(false);
      setSubmitError(event.data.success !== true);
      setSent(event.data.success === true);
    };

    window.addEventListener("message", handleFormResponse);
    return () => {
      window.removeEventListener("message", handleFormResponse);
      if (submissionTimeoutRef.current !== undefined) window.clearTimeout(submissionTimeoutRef.current);
    };
  }, []);

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (!phoneNumber || !isValidPhoneNumber(phoneNumber)) {
      event.preventDefault();
      setPhoneError(true);
      return;
    }
    if (messagePayloadRef.current) {
      messagePayloadRef.current.value = `Mobile number: ${phoneNumber}\n\nMessage:\n${messageDetailsRef.current?.value ?? ""}`;
    }
    submissionPendingRef.current = true;
    setSubmitting(true);
    setSubmitError(false);
    setPhoneError(false);
    if (submissionTimeoutRef.current !== undefined) window.clearTimeout(submissionTimeoutRef.current);
    submissionTimeoutRef.current = window.setTimeout(() => {
      submissionPendingRef.current = false;
      setSubmitting(false);
      setSubmitError(true);
    }, 12000);
  };
  return (
    <>
      <form className="contact-form" data-reveal={reveal ? "" : undefined} action={appointmentEndpoint} method="POST" target="vitasense-form-target" acceptCharset="UTF-8" onSubmit={handleFormSubmit}>
        {sent ? (
          <div className="success-message" role="status">
            <span aria-hidden="true"><Check size={25} /></span>
            <h3>Thank you</h3>
            <p>Your request has been sent to VitaSense. A confirmation email should arrive shortly, and our team will be in touch.</p>
            <button type="button" className="text-link dark" onClick={() => { setSent(false); setSubmitError(false); }}>Send another request</button>
          </div>
        ) : (
          <>
            <label className="honey-field" aria-hidden="true">Leave this field empty<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
            <div className="form-heading"><span>Appointment request</span><small>All fields are required</small></div>
            <label>Full name<input type="text" name="name" autoComplete="name" placeholder="Your name" required /></label>
            <label>Email address<input type="email" name="email" autoComplete="email" placeholder="you@example.com" required /></label>
            <label className="phone-field">Mobile number
              <PhoneInput
                defaultCountry="US"
                international
                withCountryCallingCode
                countryCallingCodeEditable={false}
                value={phoneNumber}
                onChange={(value) => { setPhoneNumber(value); if (value) setPhoneError(false); }}
                name="phone"
                autoComplete="tel"
                aria-label="Mobile number"
                required
              />
              {phoneError && <span className="field-error" role="alert">Enter a valid mobile number.</span>}
            </label>
            <label>I’m interested in<select name="service" defaultValue="" required><option value="" disabled>Select a test</option><option>EEG</option><option>VNG</option><option>Skin Allergy Test</option><option>NCV</option><option>I’m not sure yet</option></select></label>
            <label>How can we help?<textarea ref={messageDetailsRef} name="details" placeholder="Briefly tell us what you’re experiencing" rows={3} required /></label>
            <input ref={messagePayloadRef} type="hidden" name="message" />
            <button className="button button-primary form-submit" type="submit" disabled={submitting} aria-busy={submitting}>
              {submitting ? "Sending…" : "Request a call back"} {!submitting && <ArrowRight aria-hidden="true" size={17} />}
            </button>
            {submitError && <p className="form-error" role="alert">We couldn’t send your request. Please try again or email info@vita-sense.com.</p>}
            <small className="privacy-note">Your details are sent directly to VitaSense through Google Workspace and used only to respond to this inquiry.</small>
          </>
        )}
      </form>
      <iframe ref={responseFrameRef} className="form-response-frame" name="vitasense-form-target" title="Appointment form response" />
    </>
  );
}
