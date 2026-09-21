"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Activity, ArrowDown, ArrowRight, BrainCircuit, Check, CheckCircle2, Eye, HeartPulse, Info, Plus, ShieldCheck, TestTubeDiagonal } from "lucide-react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const appointmentEndpoint = "https://script.google.com/macros/s/AKfycbzpvWQiMYgpodilD8IkLhHUPz56SNI39to1UMRiiMyFKzfWqms6UoFaH4gJ97dDjv3saw/exec";

const services = [
  {
    number: "01",
    icon: BrainCircuit,
    title: "EEG",
    shortTitle: "EEG",
    subtitle: "Electroencephalogram",
    text: "Records the electrical activity of your brain.",
    points: ["Seizure investigation", "Unexplained loss of consciousness"],
  },
  {
    number: "02",
    icon: Eye,
    title: "VNG",
    shortTitle: "VNG",
    subtitle: "Videonystagmography",
    text: "Records eye movements to help evaluate balance function.",
    points: ["Dizziness assessment", "Balance function testing"],
  },
  {
    number: "03",
    icon: TestTubeDiagonal,
    title: "Skin Allergy Test",
    shortTitle: "Allergy",
    subtitle: "Allergy testing",
    text: "Helps identify substances that may trigger allergic reactions.",
    points: ["Targeted allergen screening", "Clear follow-up guidance"],
  },
  {
    number: "04",
    icon: Activity,
    title: "NCV",
    shortTitle: "NCV",
    subtitle: "Nerve Conduction Velocity",
    text: "Measures how quickly electrical signals travel through your nerves.",
    points: ["Numbness or tingling", "Weakness assessment"],
  },
] as const;

const faqs = [
  {
    question: "What happens during an appointment?",
    answer: "We begin by listening to your concerns, then explain the test before we start. Your results and suitable next steps are discussed in clear, everyday language.",
  },
  {
    question: "How should I prepare?",
    answer: "Preparation can vary by test. Once your appointment is confirmed, we will send simple guidance tailored to the assessment you have booked.",
  },
  {
    question: "Can I ask questions about my results?",
    answer: "Absolutely. We make space to talk through your findings so you leave with a clear understanding of what they mean and what to do next.",
  },
];

export default function VitaSenseHome() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [selectedHeroTest, setSelectedHeroTest] = useState(0);
  const formFrameRef = useRef<HTMLIFrameElement>(null);
  const submissionTimeoutRef = useRef<number | undefined>(undefined);
  const submissionPendingRef = useRef(false);
  const activeHeroTest = services[selectedHeroTest];

  useEffect(() => {
    const handleFormResponse = (event: MessageEvent) => {
      const responseHost = (() => {
        try {
          return new URL(event.origin).hostname;
        } catch {
          return "";
        }
      })();
      const isGoogleScriptResponse = responseHost === "script.google.com" || responseHost.endsWith(".googleusercontent.com");
      if (!isGoogleScriptResponse || event.data?.type !== "vitasense-form") return;

      if (submissionTimeoutRef.current !== undefined) window.clearTimeout(submissionTimeoutRef.current);
      submissionPendingRef.current = false;
      setSubmitting(false);
      setSubmitError(!event.data.success);
      setSent(Boolean(event.data.success));
    };

    window.addEventListener("message", handleFormResponse);

    const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -45px" },
    );

    elements.forEach((element) => observer.observe(element));
    return () => {
      observer.disconnect();
      window.removeEventListener("message", handleFormResponse);
      if (submissionTimeoutRef.current !== undefined) window.clearTimeout(submissionTimeoutRef.current);
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);
  const handleFormSubmit = () => {
    submissionPendingRef.current = true;
    setSubmitting(true);
    setSubmitError(false);
    if (submissionTimeoutRef.current !== undefined) window.clearTimeout(submissionTimeoutRef.current);
    submissionTimeoutRef.current = window.setTimeout(() => {
      submissionPendingRef.current = false;
      setSubmitting(false);
      setSubmitError(true);
    }, 12000);
  };
  const handleFormFrameLoad = () => {
    if (!submissionPendingRef.current) return;
    submissionPendingRef.current = false;
    if (submissionTimeoutRef.current !== undefined) window.clearTimeout(submissionTimeoutRef.current);
    setSubmitting(false);
    setSubmitError(false);
    setSent(true);
  };

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="VitaSense home" onClick={closeMenu}>
          <Image className="brand-logo" src={`${basePath}/vitasense-logo.png`} width={2172} height={724} alt="Vitasense" priority />
        </a>
        <button
          className="menu-button"
          type="button"
          aria-label="Toggle navigation"
          aria-controls="main-navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span />
          <span />
        </button>
        <nav id="main-navigation" className={menuOpen ? "nav-links is-open" : "nav-links"} aria-label="Main navigation">
          <a href="#services" onClick={closeMenu}>Tests</a>
          <a href="#approach" onClick={closeMenu}>Our approach</a>
          <a href="#faq" onClick={closeMenu}>FAQs</a>
          <a className="nav-cta" href="#contact" onClick={closeMenu}>Request an appointment</a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy hero-enter">
          <div className="eyebrow"><span /> Precision-led health testing</div>
          <h1>Clearer answers.<br /><em>Confident next steps.</em></h1>
          <p className="hero-lead">Professional EEG, VNG, skin allergy and NCV testing, delivered with care and explained without the clinical jargon.</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#contact">Request an appointment <ArrowRight aria-hidden="true" size={17} /></a>
            <a className="text-link" href="#services">Explore our tests <ArrowDown className="down-arrow" aria-hidden="true" size={17} /></a>
          </div>
          <div className="trust-row" aria-label="Our commitments">
            <span><ShieldCheck aria-hidden="true" size={16} /> Professional testing</span>
            <span><CheckCircle2 aria-hidden="true" size={16} /> Clear explanations</span>
            <span><HeartPulse aria-hidden="true" size={16} /> Care-led experience</span>
          </div>
        </div>

        <div className="hero-visual hero-visual-enter" aria-label="Interactive map of VitaSense diagnostic tests">
          <div className="hero-map-intro"><span aria-hidden="true" /> Select a signal</div>
          <Image className="hero-woman" src={`${basePath}/hero-neural-woman.png`} width={1216} height={1293} alt="Woman in profile illustrated with flowing diagnostic signal lines" priority />
          <div className="test-hotspots" role="tablist" aria-label="Choose a diagnostic test">
            {services.map((service, index) => (
              <button
                className={`test-hotspot hotspot-${index + 1}${selectedHeroTest === index ? " is-active" : ""}`}
                type="button"
                role="tab"
                aria-selected={selectedHeroTest === index}
                aria-controls="hero-test-detail"
                key={service.title}
                onClick={() => setSelectedHeroTest(index)}
              >
                <span className="hotspot-number">{service.number}</span>
                <span className="hotspot-label">{service.shortTitle}</span>
              </button>
            ))}
          </div>
          <article id="hero-test-detail" className="hero-test-detail" role="tabpanel" aria-live="polite" key={activeHeroTest.title}>
            <div className="hero-test-heading">
              <span>{activeHeroTest.number}</span>
              <div><small>{activeHeroTest.subtitle}</small><strong>{activeHeroTest.title}</strong></div>
            </div>
            <p>{activeHeroTest.text}</p>
            <a href="#services">Explore this test <ArrowRight aria-hidden="true" size={15} /></a>
          </article>
        </div>
      </section>

      <section className="intro-section" id="services">
        <div className="section-kicker" data-reveal>How we can help</div>
        <div className="section-heading" data-reveal>
          <h2>Focused testing.<br />Thoughtful care.</h2>
          <p>When something doesn’t feel right, clarity matters. Our assessments are designed to give you useful insight in a calm, supportive setting.</p>
        </div>
        <div className="service-grid">
          {services.map((service, index) => (
            <article className="service-card" data-reveal style={{ "--reveal-delay": `${index * 110}ms` } as React.CSSProperties} key={service.title}>
              <div className="service-top">
                <span className="service-icon">
                  <service.icon aria-hidden="true" size={34} strokeWidth={1.55} />
                </span>
                <span className="service-number">{service.number}</span>
              </div>
              <h3>{service.title}</h3>
              <small className="service-subtitle">{service.subtitle}</small>
              <p>{service.text}</p>
              <ul>
                {service.points.map((point) => <li key={point}>{point}</li>)}
              </ul>
              <a href="#contact">Enquire about this test <span className="service-link-icon" aria-hidden="true"><ArrowRight size={16} /></span></a>
            </article>
          ))}
        </div>
      </section>

      <section className="approach-section" id="approach">
        <div className="approach-visual">
          <div className="signal-lines" aria-hidden="true">
            <span /><span /><span /><span /><span />
          </div>
          <div className="care-card" data-reveal>
            <span className="care-icon" aria-hidden="true"><HeartPulse size={25} strokeWidth={1.7} /></span>
            <p>“We believe good healthcare starts with being heard.”</p>
            <small>The VitaSense approach</small>
          </div>
        </div>
        <div className="approach-copy" data-reveal>
          <div className="section-kicker light">Why VitaSense</div>
          <h2>Clinical precision,<br /><em>human care.</em></h2>
          <p>Testing can feel uncertain. We make the experience straightforward, respectful and centred around you — from your first question to your results.</p>
          <ol className="steps-list">
            <li><span>01</span><div><strong>We listen first</strong><p>Your symptoms and concerns shape the assessment.</p></div></li>
            <li><span>02</span><div><strong>We test with care</strong><p>A considered, comfort-focused experience at every step.</p></div></li>
            <li><span>03</span><div><strong>We explain clearly</strong><p>Useful answers and practical next steps, without confusion.</p></div></li>
          </ol>
        </div>
      </section>

      <section className="values-strip">
        <div data-reveal><strong>Precision</strong><span>Thoughtful assessments</span></div>
        <div data-reveal style={{ "--reveal-delay": "100ms" } as React.CSSProperties}><strong>Trust</strong><span>Clear, honest guidance</span></div>
        <div data-reveal style={{ "--reveal-delay": "200ms" } as React.CSSProperties}><strong>Care</strong><span>Your comfort matters</span></div>
      </section>

      <section className="faq-section" id="faq">
        <div data-reveal>
          <div className="section-kicker">Good to know</div>
          <h2>Questions,<br />answered simply.</h2>
          <p className="faq-intro">Still unsure which test may be right for you? Get in touch and we’ll help you find the best starting point.</p>
          <a className="text-link dark" href="#contact">Speak with our team <ArrowRight aria-hidden="true" size={17} /></a>
        </div>
        <div className="faq-list" data-reveal>
          {faqs.map((faq, index) => (
            <div className={openFaq === index ? "faq-item open" : "faq-item"} key={faq.question}>
              <button type="button" onClick={() => setOpenFaq(openFaq === index ? -1 : index)} aria-expanded={openFaq === index}>
                <span>{faq.question}</span><span className="faq-toggle" aria-hidden="true"><Plus size={17} /></span>
              </button>
              <div className="faq-answer"><p>{faq.answer}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div className="contact-copy" data-reveal>
          <div className="section-kicker light">Take the first step</div>
          <h2>Ready for a little<br /><em>more clarity?</em></h2>
          <p>Tell us what’s been concerning you. Our team will get in touch to discuss the most suitable assessment and appointment options.</p>
          <div className="contact-note"><span aria-hidden="true"><Info size={13} /></span><p>If you have urgent or severe symptoms, contact your doctor or emergency services.</p></div>
        </div>
        <form className="contact-form" data-reveal action={appointmentEndpoint} method="POST" target="vitasense-form-target" acceptCharset="UTF-8" onSubmit={handleFormSubmit}>
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
              <label>I’m interested in<select name="service" defaultValue="" required><option value="" disabled>Select a test</option><option>EEG</option><option>VNG</option><option>Skin Allergy Test</option><option>NCV</option><option>I’m not sure yet</option></select></label>
              <label>How can we help?<textarea name="message" placeholder="Briefly tell us what you’re experiencing" rows={3} required /></label>
              <button className="button button-primary form-submit" type="submit" disabled={submitting} aria-busy={submitting}>
                {submitting ? "Sending…" : "Request a call back"} {!submitting && <ArrowRight aria-hidden="true" size={17} />}
              </button>
              {submitError && <p className="form-error" role="alert">We couldn’t send your request. Please try again or email info@vita-sense.com.</p>}
              <small className="privacy-note">Your details are sent directly to VitaSense through Google Workspace and used only to respond to this enquiry.</small>
            </>
          )}
        </form>
        <iframe ref={formFrameRef} className="form-response-frame" name="vitasense-form-target" title="Appointment form response" onLoad={handleFormFrameLoad} />
      </section>

      <footer>
        <a className="brand footer-brand" href="#top" aria-label="VitaSense home">
          <Image className="brand-logo" src={`${basePath}/vitasense-logo.png`} width={2172} height={724} alt="Vitasense" />
        </a>
        <p>Professional EEG, VNG, skin allergy and NCV testing.</p>
        <div className="footer-links"><a href="#services">Tests</a><a href="#approach">Our approach</a><a href="#faq">FAQs</a><a href="#contact">Contact</a></div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} VitaSense. All rights reserved.</span><span>Precision · Trust · Care</span></div>
      </footer>
    </main>
  );
}
