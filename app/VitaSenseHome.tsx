"use client";

import { useEffect, useRef, useState, type FormEvent, type MouseEvent } from "react";
import Image from "next/image";
import PhoneInput, { isValidPhoneNumber, type Value } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Activity, ArrowDown, ArrowRight, BrainCircuit, Check, CheckCircle2, Eye, HeartPulse, Info, Plus, ShieldCheck, TestTubeDiagonal, X } from "lucide-react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const sectionIds = ["services", "approach", "faq", "contact"] as const;
const pendingSectionKey = "vitasense-pending-section";
const appointmentEndpoint = "https://script.google.com/macros/s/AKfycbyBmeKwEsRM_m8ADtKL4uuDICQMXzzS6UV3mseb1wzdjLNNwDzuMRobOba1i6YYMubGtA/exec";

const services = [
  {
    number: "01",
    icon: BrainCircuit,
    title: "EEG",
    shortTitle: "EEG",
    subtitle: "Electroencephalogram",
    text: "Records the electrical activity of your brain.",
    points: ["Seizure investigation", "Unexplained loss of consciousness"],
    image: "test-eeg.png",
    imageAlt: "Clinician placing EEG electrodes on a patient's scalp",
    tagline: "A closer look at your brain’s electrical activity.",
    overview: "An EEG records electrical activity from the brain using small electrodes placed on the scalp. It can help a clinician investigate seizures and other concerns about brain activity.",
    recommended: ["Suspected seizures or epilepsy", "Episodes of altered awareness", "Monitoring a known neurological condition"],
    expect: ["Small electrodes are attached to your scalp.", "You rest while the recording is made.", "You may be asked to open and close your eyes, breathe deeply, or look at a flashing light."],
    preparation: "Arrive with clean, dry hair and avoid styling products. Follow any specific sleep or medication instructions given by your care team.",
    results: "A specialist reviews the recording alongside your symptoms and history. Your referring clinician explains the findings and any next steps.",
    source: "https://medlineplus.gov/ency/article/003931.htm",
    sourceLabel: "NIH MedlinePlus EEG information",
  },
  {
    number: "02",
    icon: Eye,
    title: "VNG",
    shortTitle: "VNG",
    subtitle: "Videonystagmography",
    text: "Records eye movements to help evaluate balance function.",
    points: ["Dizziness assessment", "Balance function testing"],
    image: "test-vng.png",
    imageAlt: "Patient wearing video goggles during a balance assessment",
    tagline: "Understanding dizziness and balance.",
    overview: "VNG uses camera-equipped goggles to record eye movements. The patterns can give clinicians information about how the balance system is working.",
    recommended: ["Persistent or recurring dizziness", "A spinning sensation (vertigo)", "Unsteadiness or balance difficulties"],
    expect: ["You wear video goggles while eye movements are recorded.", "You may follow visual targets or change head and body positions.", "Some assessments include warm or cool stimulation of the ears and may briefly cause dizziness."],
    preparation: "Your care team will send instructions for your specific assessment. Ask them before changing any medication; certain medicines and eye makeup may affect the test.",
    results: "The recordings are reviewed with your symptoms and medical history to help guide appropriate follow-up care.",
    source: "https://medlineplus.gov/lab-tests/videonystagmography-vng/",
    sourceLabel: "NIH MedlinePlus VNG information",
  },
  {
    number: "03",
    icon: TestTubeDiagonal,
    title: "Skin Allergy Test",
    shortTitle: "Allergy",
    subtitle: "Allergy testing",
    text: "Helps identify substances that may trigger allergic reactions.",
    points: ["Targeted allergen screening", "Clear follow-up guidance"],
    image: "test-allergy.png",
    imageAlt: "Clinician applying allergy test droplets to a patient's forearm",
    tagline: "Make sense of possible triggers.",
    overview: "A skin prick test checks for a reaction to selected allergens. Small drops are placed on the skin and the surface is gently pricked; the response is then measured and interpreted with your history.",
    recommended: ["Suspected reactions to pollen or dust mites", "Possible animal or food allergy", "Symptoms that need targeted investigation"],
    expect: ["Small drops of selected allergens are placed on your forearm.", "The skin is gently pricked through each drop.", "The team usually checks for a response after about 15 minutes."],
    preparation: "Some medicines, including antihistamines, can affect results. Follow your own appointment instructions and check with your care team before stopping any medication.",
    results: "A clinician interprets any skin response in the context of your symptoms. A positive result alone does not establish the whole diagnosis.",
    source: "https://medlineplus.gov/lab-tests/allergy-skin-test/",
    sourceLabel: "NIH MedlinePlus allergy skin test information",
  },
  {
    number: "04",
    icon: Activity,
    title: "NCV",
    shortTitle: "NCV",
    subtitle: "Nerve Conduction Velocity",
    text: "Measures how quickly electrical signals travel through your nerves.",
    points: ["Numbness or tingling", "Weakness assessment"],
    image: "test-ncv.png",
    imageAlt: "Clinician carrying out a nerve conduction study on a patient's arm",
    tagline: "See how your nerves are communicating.",
    overview: "A nerve conduction study measures responses to small electrical impulses delivered at the skin. It helps assess how signals travel through nerves in the arms or legs.",
    recommended: ["Numbness or pins and needles", "Muscle weakness", "Possible trapped nerve or nerve damage"],
    expect: ["Small recording electrodes are placed on the skin.", "Brief electrical pulses stimulate a nerve and its response is recorded.", "You may feel a short tapping or tingling sensation."],
    preparation: "Wear comfortable clothing that allows access to the area being tested. Bring a list of your medicines and follow any instructions from your care team.",
    results: "A specialist reviews the size and speed of the nerve responses alongside your symptoms and history, then shares a report with your referring clinician.",
    source: "https://medlineplus.gov/lab-tests/electromyography-emg-and-nerve-conduction-studies/",
    sourceLabel: "NIH MedlinePlus nerve conduction information",
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
  const [phoneNumber, setPhoneNumber] = useState<Value>();
  const [phoneError, setPhoneError] = useState(false);
  const [expandedService, setExpandedService] = useState<number | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailOrigin, setDetailOrigin] = useState({ x: "50%", y: "50%" });
  const detailCloseRef = useRef<HTMLButtonElement>(null);
  const detailPanelRef = useRef<HTMLElement>(null);
  const detailTriggerRef = useRef<HTMLButtonElement>(null);
  const formFrameRef = useRef<HTMLIFrameElement>(null);
  const messageDetailsRef = useRef<HTMLTextAreaElement>(null);
  const messagePayloadRef = useRef<HTMLInputElement>(null);
  const submissionTimeoutRef = useRef<number | undefined>(undefined);
  const submissionPendingRef = useRef(false);
  const activeDetail = services[expandedService ?? 0];

  useEffect(() => {
    if (!detailOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    detailCloseRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDetailOpen(false);
      if (event.key !== "Tab" || !detailPanelRef.current) return;
      const focusable = Array.from(detailPanelRef.current.querySelectorAll<HTMLElement>("button, a[href]"));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      detailTriggerRef.current?.focus();
    };
  }, [detailOpen]);

  const showService = (index: number, trigger: HTMLButtonElement) => {
    detailTriggerRef.current = trigger;
    if (detailPanelRef.current) detailPanelRef.current.scrollTop = 0;
    const bounds = trigger.getBoundingClientRect();
    setDetailOrigin({ x: `${bounds.left + bounds.width / 2}px`, y: `${bounds.top + bounds.height / 2}px` });
    setExpandedService(index);
    setDetailOpen(true);
  };

  useEffect(() => {
    let pendingSection = "";
    try {
      pendingSection = window.sessionStorage.getItem(pendingSectionKey) ?? "";
    } catch {
      // The link's hash remains a working fallback when storage is unavailable.
    }
    const sectionId = pendingSection || window.location.hash.slice(1);
    if (!sectionIds.some((id) => id === sectionId)) return;
    const frame = window.requestAnimationFrame(() => {
      if (pendingSection) {
        try { window.sessionStorage.removeItem(pendingSectionKey); } catch { /* The section still scrolls. */ }
      }
      document.getElementById(sectionId)?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      });
      window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

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
  const goToTop = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    closeMenu();
    window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search);
    window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };
  const goToSection = (sectionId: typeof sectionIds[number]) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    closeMenu();
    if (detailOpen) setDetailOpen(false);
    window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search);
    window.requestAnimationFrame(() => document.getElementById(sectionId)?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    }));
  };
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
        <a className="brand" href={`${basePath}/`} aria-label="VitaSense home" onClick={goToTop}>
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
          <a href="#services" onClick={goToSection("services")}>Tests</a>
          <a href="#approach" onClick={goToSection("approach")}>Our approach</a>
          <a href="#faq" onClick={goToSection("faq")}>FAQs</a>
          <a className="nav-cta" href="#contact" onClick={goToSection("contact")}>Request an appointment</a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy hero-enter">
          <div className="eyebrow"><span /> Diagnostic care, made personal</div>
          <h1>Clearer answers.<br /><em>Confident next steps.</em></h1>
          <p className="hero-lead">Expert EEG, VNG, allergy and nerve testing. A more thoughtful way to understand what your body is telling you.</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#contact" onClick={goToSection("contact")}>Request an appointment <ArrowRight aria-hidden="true" size={17} /></a>
            <a className="text-link" href="#services" onClick={goToSection("services")}>Explore our tests <ArrowDown className="down-arrow" aria-hidden="true" size={17} /></a>
          </div>
          <div className="trust-row" aria-label="Our commitments">
            <span><ShieldCheck aria-hidden="true" size={16} /> Professional testing</span>
            <span><CheckCircle2 aria-hidden="true" size={16} /> Clear explanations</span>
            <span><HeartPulse aria-hidden="true" size={16} /> Care-led experience</span>
          </div>
        </div>

        <div className="hero-visual hero-visual-enter" aria-label="Illustration of VitaSense diagnostic testing">
          <div className="hero-map-intro"><span aria-hidden="true" /> A clearer picture starts here</div>
          <div className="hero-visual-title" aria-hidden="true">Every signal<br />tells a story.</div>
          <Image className="hero-woman" src={`${basePath}/hero-neural-woman.png`} width={1216} height={1293} alt="Woman in profile illustrated with flowing diagnostic signal lines" priority />
          <a className="hero-visual-cta" href="#services" onClick={goToSection("services")}>Discover the tests <ArrowDown aria-hidden="true" size={18} /></a>
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
            <article className="service-card" data-reveal style={{ "--reveal-delay": `${index * 90}ms` } as React.CSSProperties} key={service.title}>
              <div className="service-image-wrap"><Image src={`${basePath}/${service.image}`} width={1664} height={1024} alt={service.imageAlt} className="service-image" /></div>
              <div className="service-card-copy">
                <div className="service-top"><span className="service-number">{service.number} / 04</span><span className="service-icon"><service.icon aria-hidden="true" size={24} strokeWidth={1.5} /></span></div>
                <h3>{service.title}</h3>
                <small className="service-subtitle">{service.subtitle}</small>
                <p>{service.text}</p>
                <button type="button" className="service-expand" aria-label={`Learn more about ${service.title}`} onClick={(event) => showService(index, event.currentTarget)}>
                  <span>Explore the test</span><span className="service-plus" aria-hidden="true"><Plus size={22} strokeWidth={1.8} /></span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className={`service-detail-backdrop${detailOpen ? " is-open" : ""}`} aria-hidden="true" onClick={() => setDetailOpen(false)} />
      <section ref={detailPanelRef} className={`service-detail${detailOpen ? " is-open" : ""}`} style={{ "--detail-origin-x": detailOrigin.x, "--detail-origin-y": detailOrigin.y } as React.CSSProperties} role="dialog" aria-modal={detailOpen} aria-label={`${activeDetail.title} test details`} aria-hidden={!detailOpen} inert={!detailOpen}>
        <div className="detail-inner">
          <div className="detail-topline"><span>VitaSense / Tests / {activeDetail.title}</span><button ref={detailCloseRef} type="button" className="detail-close" aria-label="Close test details and return to home" onClick={() => setDetailOpen(false)}><X size={22} strokeWidth={1.7} /></button></div>
          <div className="detail-intro"><div className="section-kicker">The test, explained</div><h2>{activeDetail.title}<span>.</span></h2><p>{activeDetail.tagline}</p></div>
          <div className="detail-hero-image"><Image src={`${basePath}/${activeDetail.image}`} width={1664} height={1024} alt={activeDetail.imageAlt} /></div>
          <div className="detail-lead-grid"><div className="detail-index">{activeDetail.number} / 04<br />{activeDetail.subtitle}</div><div><h3>What is {activeDetail.title}?</h3><p>{activeDetail.overview}</p></div></div>
          <div className="detail-info-grid">
            <div className="detail-info-block"><span className="detail-info-number">01</span><h3>When it may help.</h3><ul>{activeDetail.recommended.map((item) => <li key={item}>{item}</li>)}</ul></div>
            <div className="detail-info-block"><span className="detail-info-number">02</span><h3>What to expect.</h3><ul>{activeDetail.expect.map((item) => <li key={item}>{item}</li>)}</ul></div>
            <div className="detail-info-block"><span className="detail-info-number">03</span><h3>Before your test.</h3><p>{activeDetail.preparation}</p></div>
            <div className="detail-info-block"><span className="detail-info-number">04</span><h3>Understanding results.</h3><p>{activeDetail.results}</p></div>
          </div>
          <div className="detail-end"><div><p>Clear answers begin with a conversation.</p><small>Testing and preparation may vary. Your care team will confirm what applies to you.</small></div><a className="button button-primary" href="#contact" onClick={goToSection("contact")}>Request an appointment <ArrowRight size={17} aria-hidden="true" /></a></div>
          <div className="detail-footnote">Images are illustrative. Medical information: <a href={activeDetail.source} target="_blank" rel="noopener noreferrer">{activeDetail.sourceLabel}</a>.</div>
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
          <p>Testing can feel uncertain. We make the experience straightforward, respectful and centered around you — from your first question to your results.</p>
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
          <a className="text-link dark" href="#contact" onClick={goToSection("contact")}>Speak with our team <ArrowRight aria-hidden="true" size={17} /></a>
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
        <iframe ref={formFrameRef} className="form-response-frame" name="vitasense-form-target" title="Appointment form response" onLoad={handleFormFrameLoad} />
      </section>

      <footer>
        <a className="brand footer-brand" href={`${basePath}/`} aria-label="VitaSense home" onClick={goToTop}>
          <Image className="brand-logo" src={`${basePath}/vitasense-logo.png`} width={2172} height={724} alt="Vitasense" />
        </a>
        <p>Professional EEG, VNG, skin allergy and NCV testing.</p>
        <div className="footer-links"><a href="#services" onClick={goToSection("services")}>Tests</a><a href="#approach" onClick={goToSection("approach")}>Our approach</a><a href="#faq" onClick={goToSection("faq")}>FAQs</a><a href="#contact" onClick={goToSection("contact")}>Contact</a><a href={`${basePath}/connect/`}>Connect</a></div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} VitaSense. All rights reserved.</span><span>Precision · Trust · Care</span></div>
      </footer>
    </main>
  );
}
