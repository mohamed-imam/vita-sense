"use client";

import type { MouseEvent, ReactNode } from "react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function HomeSectionLink({ section, className, children }: {
  section: "services" | "contact";
  className: string;
  children: ReactNode;
}) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    try {
      window.sessionStorage.setItem("vitasense-pending-section", section);
      event.preventDefault();
      window.location.assign(`${basePath}/`);
    } catch {
      // The anchor still takes visitors to the requested section.
    }
  };

  return <a className={className} href={`${basePath}/#${section}`} onClick={handleClick}>{children}</a>;
}
