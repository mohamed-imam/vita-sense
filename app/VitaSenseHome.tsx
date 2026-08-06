"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const services = [
  {
    number: "01",
    icon: "neuron",
    title: "Nerve testing",
    text: "A focused assessment to help understand changes in sensation, tingling, numbness or discomfort.",
    points: ["Clear, guided process", "Results explained simply"],
  },
  {
    number: "02",
    icon: "spore",
    title: "Allergy testing",
    text: "Practical testing designed to identify possible sensitivities and give you clearer next steps.",
    points: ["Considered assessment", "Personalised guidance"],
  },
  {
    number: "03",
    icon: "blood-drop",
    title: "Circulation testing",
    text: "A non-invasive check to assess blood flow and support a better understanding of your vascular health.",
    points: ["Comfort-first testing", "Easy-to-follow findings"],
  },
];

type ServiceIconName = (typeof services)[number]["icon"];

function ServiceIcon({ name }: { name: ServiceIconName }) {
  if (name === "neuron") {
    return (
      <svg viewBox="0 0 48 48" role="img" aria-label="Neuron" data-icon="neuron">
        <circle cx="24" cy="24" r="6" />
        <circle cx="8" cy="10" r="2" />
        <circle cx="39" cy="8" r="2" />
        <circle cx="41" cy="29" r="2" />
        <circle cx="34" cy="42" r="2" />
        <circle cx="9" cy="38" r="2" />
        <path d="M19.7 19.8 9.8 11.8M27.9 18.7 37.5 9.8M29.9 25.5l9.1 2.9M27.3 29.3l5.7 10.9M19.4 28.9l-8.8 7.7M18 24H7" />
        <path d="M13 15.2 9.7 19M33.7 14.2l4.4 1.1M34.8 34.8l4.8 1.1M13.5 31.5l-4.3-1" />
      </svg>
    );
  }

  if (name === "spore") {
    return (
      <svg viewBox="0 0 48 48" role="img" aria-label="Allergen spore" data-icon="spore">
        <circle cx="24" cy="24" r="11" />
        <circle cx="24" cy="24" r="3" />
        <circle cx="19" cy="19" r="1.4" />
        <circle cx="29.5" cy="20" r="1.2" />
        <circle cx="19.5" cy="29" r="1.2" />
        <circle cx="29" cy="29" r="1.5" />
        <path d="M24 13V7M24 41v-6M13 24H7M41 24h-6M16.2 16.2 12 12M36 36l-4.2-4.2M31.8 16.2 36 12M12 36l4.2-4.2" />
        <circle cx="24" cy="5" r="2" />
        <circle cx="24" cy="43" r="2" />
        <circle cx="5" cy="24" r="2" />
        <circle cx="43" cy="24" r="2" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 48 48" role="img" aria-label="Blood drop" data-icon="blood-drop">
      <path className="drop-fill" d="M24 5S11.5 20.3 11.5 29.2a12.5 12.5 0 0 0 25 0C36.5 20.3 24 5 24 5Z" />
      <path d="M17 30.2c2.4 2 4.8 2.9 7.2 2.9 2.2 0 4.5-.8 6.8-2.5" />
      <path d="M18.2 25.5c.7-2.7 2.4-5.8 5.1-9.3" />
    </svg>
  );
}

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

  useEffect(() => {
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
    return () => observer.disconnect();
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const submitRequest = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="VitaSense home" onClick={closeMenu}>
          <span className="brand-mark" aria-hidden="true"><Image src={`${basePath}/vitasense-logo.jpg`} width={1254} height={1254} alt="" priority /></span>
          <span className="brand-name">Vita<span>Sense</span></span>
        </a>
        <button
          className="menu-button"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span />
          <span />
        </button>
        <nav className={menuOpen ? "nav-links is-open" : "nav-links"} aria-label="Main navigation">
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
          <p className="hero-lead">Professional nerve, allergy and circulation testing, delivered with care and explained without the clinical jargon.</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#contact">Request an appointment <span aria-hidden="true">→</span></a>
            <a className="text-link" href="#services">Explore our tests <span aria-hidden="true">↓</span></a>
          </div>
          <div className="trust-row" aria-label="Our commitments">
            <span><i>✓</i> Professional testing</span>
            <span><i>✓</i> Clear explanations</span>
            <span><i>✓</i> Care-led experience</span>
          </div>
        </div>

        <div className="hero-visual hero-visual-enter" aria-label="VitaSense — Precision. Trust. Care.">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="logo-pulse logo-pulse-one" />
          <div className="logo-pulse logo-pulse-two" />
          <div className="logo-stage">
            <Image src={`${basePath}/vitasense-logo.jpg`} width={1254} height={1254} alt="VitaSense — Precision. Trust. Care." priority />
          </div>
          <div className="floating-card card-top">
            <span className="pulse-dot" />
            <div><small>Your health, made clearer</small><strong>Listen. Test. Explain.</strong></div>
          </div>
          <div className="floating-card card-bottom">
            <strong>3</strong>
            <div><small>Focused services</small><span>Nerve · Allergy · Circulation</span></div>
          </div>
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
              <div className="service-top"><span>{service.number}</span><span className="service-icon"><ServiceIcon name={service.icon} /></span></div>
              <h3>{service.title}</h3>
              <p>{service.text}</p>
              <ul>
                {service.points.map((point) => <li key={point}>{point}</li>)}
              </ul>
              <a href="#contact">Enquire about this test <span className="link-arrow" aria-hidden="true" /></a>
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
            <span className="care-icon">V</span>
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
          <a className="text-link dark" href="#contact">Speak with our team <span aria-hidden="true">→</span></a>
        </div>
        <div className="faq-list" data-reveal>
          {faqs.map((faq, index) => (
            <div className={openFaq === index ? "faq-item open" : "faq-item"} key={faq.question}>
              <button type="button" onClick={() => setOpenFaq(openFaq === index ? -1 : index)} aria-expanded={openFaq === index}>
                <span>{faq.question}</span><i aria-hidden="true">+</i>
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
          <div className="contact-note"><span>i</span><p>If you have urgent or severe symptoms, contact your doctor or emergency services.</p></div>
        </div>
        <form className="contact-form" data-reveal onSubmit={submitRequest}>
          {sent ? (
            <div className="success-message" role="status">
              <span>✓</span>
              <h3>Thank you</h3>
              <p>Your request has been noted. Connect this form to your preferred email or booking service before launch to receive enquiries.</p>
              <button type="button" className="text-link dark" onClick={() => setSent(false)}>Send another request</button>
            </div>
          ) : (
            <>
              <div className="form-heading"><span>Appointment request</span><small>All fields are required</small></div>
              <label>Full name<input type="text" name="name" autoComplete="name" placeholder="Your name" required /></label>
              <label>Email address<input type="email" name="email" autoComplete="email" placeholder="you@example.com" required /></label>
              <label>I’m interested in<select name="service" defaultValue="" required><option value="" disabled>Select a test</option><option>Nerve testing</option><option>Allergy testing</option><option>Circulation testing</option><option>I’m not sure yet</option></select></label>
              <label>How can we help?<textarea name="message" placeholder="Briefly tell us what you’re experiencing" rows={3} required /></label>
              <button className="button button-primary form-submit" type="submit">Request a call back <span aria-hidden="true">→</span></button>
              <small className="privacy-note">By submitting, you agree to be contacted about your enquiry.</small>
            </>
          )}
        </form>
      </section>

      <footer>
        <a className="brand footer-brand" href="#top" aria-label="VitaSense home">
          <span className="brand-mark" aria-hidden="true"><Image src={`${basePath}/vitasense-logo.jpg`} width={1254} height={1254} alt="" /></span>
          <span className="brand-name">Vita<span>Sense</span></span>
        </a>
        <p>Professional nerve, allergy and circulation testing.</p>
        <div className="footer-links"><a href="#services">Tests</a><a href="#approach">Our approach</a><a href="#faq">FAQs</a><a href="#contact">Contact</a></div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} VitaSense. All rights reserved.</span><span>Precision · Trust · Care</span></div>
      </footer>
    </main>
  );
}
