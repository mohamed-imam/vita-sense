type Brand = "whatsapp" | "instagram" | "facebook" | "linkedin" | "email";

export const channels: { name: string; detail: string; href: string; brand: Brand; external: boolean }[] = [
  { name: "WhatsApp", detail: "Chat with our team", href: "https://wa.link/vzhy40", brand: "whatsapp", external: true },
  { name: "Instagram", detail: "@vitasensetests", href: "https://www.instagram.com/vitasensetests", brand: "instagram", external: true },
  { name: "Facebook", detail: "VitaSense updates", href: "https://www.facebook.com/share/1EvGHcTGgj/?mibextid=wwXIfr", brand: "facebook", external: true },
  { name: "LinkedIn", detail: "Professional updates", href: "https://www.linkedin.com/in/Vitasensetest", brand: "linkedin", external: true },
  { name: "Email", detail: "info@vita-sense.com", href: "mailto:info@vita-sense.com", brand: "email", external: false },
];

export function BrandIcon({ brand }: { brand: Brand }) {
  if (brand === "facebook") return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M14.2 21v-7.9h2.7l.4-3.1h-3.1V8c0-.9.3-1.5 1.6-1.5h1.7V3.7c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V10H8v3.1h2.8V21h3.4Z" /></svg>;
  if (brand === "linkedin") return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5.1 8.7H2V21h3.1V8.7ZM3.55 3A1.8 1.8 0 1 0 3.6 6.6 1.8 1.8 0 0 0 3.55 3ZM8 8.7V21h3.1v-6.1c0-1.6.3-3.1 2.3-3.1s2 1.8 2 3.2V21h3.2v-6.7c0-3.4-.8-5.9-4.6-5.9-1.8 0-3 1-3.5 2V8.7H8Z" /></svg>;
  if (brand === "instagram") return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.4" cy="6.7" r="1" fill="currentColor" stroke="none" /></svg>;
  if (brand === "whatsapp") return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.5 11.8a8.5 8.5 0 0 1-12.6 7.4L3 20.7l1.5-4.8a8.5 8.5 0 1 1 16-4.1Z" /><path d="M8.2 7.8c-.5.4-.8 1-.8 1.7 0 2.5 3 5.7 5.7 6.5 1.3.4 2.4 0 3.1-.9l-2.3-1.1-1.1.9c-1.2-.6-2.3-1.7-3-2.9l.9-1.1-1.2-2.5c-.3-.5-.8-.8-1.3-.6Z" /></svg>;
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2.5" y="5" width="19" height="14" rx="2.5" /><path d="m3.5 7 8.5 6.5L20.5 7" /></svg>;
}

export default function SocialLinks() {
  return (
    <nav className="social-strip-connect" aria-label="Connect with VitaSense">
      <div className="social-strip-list">
        {channels.map(({ name, href, brand, external }) => (
          <a className={`social-link social-link-${brand}`} href={href} aria-label={name === "Email" ? "Email VitaSense" : `VitaSense on ${name}`} title={name} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} key={brand}>
            <span className="social-link-icon"><BrandIcon brand={brand} /></span>
          </a>
        ))}
      </div>
    </nav>
  );
}
