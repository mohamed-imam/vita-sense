"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowRight, CalendarDays, X } from "lucide-react";
import AppointmentForm from "../AppointmentForm";

export default function AppointmentRequest() {
  const [open, setOpen] = useState(false);
  const [origin, setOrigin] = useState({ x: "50%", y: "50%" });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const trigger = triggerRef.current;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => {
      panelRef.current?.scrollTo({ top: 0 });
      closeRef.current?.focus({ preventScroll: true });
    }, 60);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); return; }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input:not([disabled]):not([tabindex="-1"]), select:not([disabled]), textarea:not([disabled])',
      ));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleKeyDown);
      trigger?.focus();
    };
  }, [open]);

  const showForm = () => {
    const bounds = triggerRef.current?.getBoundingClientRect();
    if (bounds) setOrigin({ x: `${bounds.left + bounds.width / 2}px`, y: `${bounds.top + bounds.height / 2}px` });
    if (panelRef.current) panelRef.current.scrollTop = 0;
    setOpen(true);
  };

  return (
    <>
      <button ref={triggerRef} className="connect-row connect-row-accent connect-appointment-trigger" type="button" aria-haspopup="dialog" aria-expanded={open} aria-controls="connect-appointment-dialog" onClick={showForm}>
        <span className="connect-row-icon"><CalendarDays size={20} strokeWidth={1.7} aria-hidden="true" /></span>
        <span className="connect-row-copy"><strong>Request an appointment</strong><small>Tell us how we can help</small></span>
        <ArrowRight className="connect-row-arrow" size={18} aria-hidden="true" />
      </button>
      <div className={`service-detail-backdrop${open ? " is-open" : ""}`} aria-hidden="true" onClick={() => setOpen(false)} />
      <section ref={panelRef} id="connect-appointment-dialog" className={`service-detail appointment-dialog${open ? " is-open" : ""}`} style={{ "--detail-origin-x": origin.x, "--detail-origin-y": origin.y } as CSSProperties} role="dialog" aria-modal={open} aria-label="Request an appointment" aria-hidden={!open} inert={!open}>
        <div className="appointment-dialog-inner">
          <div className="appointment-dialog-topline"><span>Request an appointment</span><button ref={closeRef} type="button" className="detail-close" aria-label="Close appointment request" onClick={() => setOpen(false)}><X size={22} strokeWidth={1.7} /></button></div>
          <div className="appointment-dialog-intro"><h2>How can we help?</h2><p>Tell us a little about what you need, and we’ll be in touch.</p></div>
          <AppointmentForm />
        </div>
      </section>
    </>
  );
}
