import type { Metadata } from "next";
import Image from "next/image";
import { ArrowLeft, ArrowRight, CalendarDays, Globe2 } from "lucide-react";
import SocialLinks, { BrandIcon, channels } from "./SocialLinks";
import HomeSectionLink from "./HomeSectionLink";
import "./connect.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const siteUrl = "https://mohamed-imam.github.io/vita-sense/connect/";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Connect with VitaSense | Testing & Appointments",
  description: "Contact VitaSense about EEG, VNG, skin allergy and NCV testing, or request an appointment.",
  alternates: { canonical: siteUrl },
  openGraph: {
    title: "Connect with VitaSense",
    description: "Questions about diagnostic testing? Reach VitaSense or request an appointment.",
    url: siteUrl,
    images: [{ url: "https://mohamed-imam.github.io/vita-sense/og.png", width: 1730, height: 909, alt: "VitaSense diagnostic testing" }],
  },
};

export default function ConnectPage() {
  const contactChannels = channels.filter((channel) => channel.brand === "whatsapp" || channel.brand === "email");
  const socialChannels = channels.filter((channel) => channel.brand === "instagram" || channel.brand === "facebook" || channel.brand === "linkedin");

  return (
    <main className="connect-page">
      <div className="connect-blue">
        <div className="connect-shell">
          <header className="connect-header">
            <a className="connect-brand" href={`${basePath}/`} aria-label="VitaSense home">
              <Image src={`${basePath}/vitasense-logo.png`} width={2172} height={724} alt="VitaSense" priority />
            </a>
            <a className="connect-back" href={`${basePath}/`}><ArrowLeft size={16} aria-hidden="true" /> Website</a>
          </header>
          <div className="connect-hero">
            <span className="connect-kicker">VITASENSE / CONNECT</span>
            <h1>Connect.</h1>
            <p>Testing, appointments, and direct contact.</p>
            <SocialLinks />
          </div>
        </div>
      </div>
      <div className="connect-shell connect-lower">
        <div className="connect-card">
          <section className="connect-group" aria-labelledby="connect-start">
            <div className="connect-group-heading"><span>01</span><h2 id="connect-start">Start here</h2></div>
            <HomeSectionLink className="connect-row" section="services">
              <span className="connect-row-icon"><Globe2 size={20} strokeWidth={1.7} aria-hidden="true" /></span>
              <span className="connect-row-copy"><strong>Explore our tests</strong><small>EEG · VNG · Skin allergy · NCV</small></span>
              <ArrowRight className="connect-row-arrow" size={18} aria-hidden="true" />
            </HomeSectionLink>
            <HomeSectionLink className="connect-row connect-row-accent" section="contact">
              <span className="connect-row-icon"><CalendarDays size={20} strokeWidth={1.7} aria-hidden="true" /></span>
              <span className="connect-row-copy"><strong>Request an appointment</strong><small>Tell us how we can help</small></span>
              <ArrowRight className="connect-row-arrow" size={18} aria-hidden="true" />
            </HomeSectionLink>
          </section>

          <section className="connect-group" aria-labelledby="connect-talk">
            <div className="connect-group-heading"><span>02</span><h2 id="connect-talk">Talk with us</h2></div>
            {contactChannels.map((channel) => (
              <a className="connect-row" href={channel.href} target={channel.external ? "_blank" : undefined} rel={channel.external ? "noopener noreferrer" : undefined} key={channel.brand}>
                <span className={`connect-row-icon connect-icon-${channel.brand}`}><BrandIcon brand={channel.brand} /></span>
                <span className="connect-row-copy"><strong>{channel.name === "Email" ? "Email VitaSense" : `Chat on ${channel.name}`}</strong><small>{channel.detail}</small></span>
                <ArrowRight className="connect-row-arrow" size={18} aria-hidden="true" />
              </a>
            ))}
          </section>

          <section className="connect-group" aria-labelledby="connect-follow">
            <div className="connect-group-heading"><span>03</span><h2 id="connect-follow">Follow along</h2></div>
            {socialChannels.map((channel) => (
              <a className="connect-row" href={channel.href} target="_blank" rel="noopener noreferrer" key={channel.brand}>
                <span className={`connect-row-icon connect-icon-${channel.brand}`}><BrandIcon brand={channel.brand} /></span>
                <span className="connect-row-copy"><strong>{channel.name}</strong><small>{channel.detail}</small></span>
                <ArrowRight className="connect-row-arrow" size={18} aria-hidden="true" />
              </a>
            ))}
          </section>
        </div>
        <footer className="connect-footer">© {new Date().getFullYear()} VitaSense</footer>
      </div>
    </main>
  );
}
