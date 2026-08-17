import { useState } from "react";
import { ArrowUpRight, Check, X } from "@phosphor-icons/react";

type Panel = "engage" | "service" | "project" | null;

const services = [
  ["01", "WEB DEVELOPMENT", "Modern websites, dashboards, applications and custom platforms.", "React / TypeScript / Vite"],
  ["02", "AI & AUTOMATION", "Agents, intelligent workflows, integrations and business automation.", "AI SDK / APIs / Workflows"],
  ["03", "CHATBOTS", "WhatsApp bots, customer support automation and conversational systems.", "Conversational AI / Webhooks"],
  ["04", "INTERNET SOLUTIONS", "WiFi deployment, ISP systems, VPN and connectivity architecture.", "Networks / Security / VPN"],
  ["05", "CLOUD & VPS", "Hosting, infrastructure, server management and deployment systems.", "Linux / Docker / Cloud"],
  ["06", "DIGITAL DESIGN", "Brand identity, UI systems, promotional graphics and digital experiences.", "Figma / UI Systems / Motion"],
  ["07", "CUSTOM SOFTWARE", "Specialized business platforms built around the way your team works.", "Full-stack / Data / Integrations"],
] as const;

const projects = [
  ["ANONYMIKETECH V2", "PLATFORM", "LIVE", "React / Vite / Motion", "The cinematic operating surface for the ANONYMIKETECH ecosystem."],
  ["SYNTH", "AI SYSTEM", "IN DEVELOPMENT", "AI / Agents / Workflows", "Autonomous development intelligence for understanding, building and validating software."],
  ["NETWORK OPERATIONS", "INFRASTRUCTURE", "CONCEPT", "Networks / Cloud", "A technical command center for connectivity, telemetry and managed infrastructure."],
];

function SectionEyebrow({ code, children }: { code: string; children: string }) {
  return <div className="platform-eyebrow"><span>{code}</span>{children}</div>;
}

function SynthWorkflow() {
  const steps = ["USER REQUEST", "CONTEXT ANALYSIS", "PLANNING", "CODE GENERATION", "VALIDATION", "TESTING", "DEPLOYMENT", "SYSTEM READY"];
  return (
    <section id="synth" className="platform-section platform-section--synth">
      <div className="platform-container">
        <SectionEyebrow code="SYS / 01">SYNTH DEVELOPMENT INTELLIGENCE</SectionEyebrow>
        <div className="platform-split">
          <div>
            <p className="platform-kicker">AUTONOMOUS DEVELOPMENT INTELLIGENCE</p>
            <h2>SYNTH <span>is building the next interface between intent and software.</span></h2>
            <p className="platform-copy">SYNTH will inspect context, plan implementation, generate changes and validate the system before deployment. This is the development command center in progress.</p>
            <div className="platform-status"><i /> SYSTEM IN DEVELOPMENT <b>42%</b></div>
          </div>
          <div className="synth-workflow" aria-label="SYNTH development workflow">
            {steps.map((step, index) => <div className="synth-step" key={step}><span>{String(index + 1).padStart(2, "0")}</span><strong>{step}</strong>{index < steps.length - 1 && <em>↓</em>}</div>)}
          </div>
        </div>
        <div className="module-grid">{[["CORE ENGINE", "IN DEVELOPMENT"], ["CODE INTELLIGENCE", "IN DEVELOPMENT"], ["VISION", "PLANNED"], ["AUTONOMOUS WORKFLOWS", "PLANNED"], ["DEPLOYMENT AGENT", "PLANNED"], ["SEARCH + DOCS", "PLANNED"]].map(([name, status]) => <div className="module-card" key={name}><span>{status}</span><strong>{name}</strong><small>MODULE // {status === "PLANNED" ? "QUEUED" : "ACTIVE"}</small></div>)}</div>
      </div>
    </section>
  );
}

function SystemsSection() {
  const systems = ["AI SYSTEMS", "WEB SYSTEMS", "CLOUD SYSTEMS", "NETWORK SYSTEMS", "AUTOMATION", "SECURITY", "DIGITAL INFRASTRUCTURE"];
  return <section id="systems" className="platform-section"><div className="platform-container"><SectionEyebrow code="SYS / 02">SYSTEMS ARCHITECTURE</SectionEyebrow><div className="platform-split"><div><p className="platform-kicker">THE ECOSYSTEM</p><h2>Systems that stay <span>clear under pressure.</span></h2><p className="platform-copy">From the interface to the infrastructure underneath it, ANONYMIKETECH designs connected systems that are observable, extensible and built to move.</p></div><div className="system-grid">{systems.map((system, i) => <button className="system-node" key={system} onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}><span>{String(i + 1).padStart(2, "0")}</span><strong>{system}</strong><i>ONLINE</i></button>)}</div></div></div></section>;
}

function ServicesSection({ onOpen }: { onOpen: (panel: Panel, value?: string) => void }) {
  return <section id="services" className="platform-section platform-section--services"><div className="platform-container"><SectionEyebrow code="SYS / 03">SERVICE MODULES</SectionEyebrow><div className="platform-section-heading"><div><p className="platform-kicker">WHAT WE BUILD</p><h2>Capabilities with a <span>point of view.</span></h2></div><p className="platform-copy">Choose a module to inspect the capability, technology layer and next action.</p></div><div className="service-grid">{services.map(([code, name, description, tech]) => <article className="service-card" key={name}><span className="service-code">{code}</span><h3>{name}</h3><p>{description}</p><small>{tech}</small><button onClick={() => onOpen("service", name)}>VIEW SERVICE <ArrowUpRight size={14} /></button></article>)}</div></div></section>;
}

function ArchiveSection({ onOpen }: { onOpen: (panel: Panel, value?: string) => void }) {
  return <section id="archive" className="platform-section"><div className="platform-container"><SectionEyebrow code="SYS / 04">PROJECT ARCHIVE</SectionEyebrow><div className="platform-section-heading"><div><p className="platform-kicker">SELECTED SYSTEMS</p><h2>Work in <span>motion.</span></h2></div></div><div className="archive-grid">{projects.map(([name, category, status, tech, description]) => <article className="project-card" key={name}><div className="project-visual"><span>{category}</span><strong>{name.slice(0, 2)}</strong></div><div className="project-meta"><span>{status}</span><small>{tech}</small></div><h3>{name}</h3><p>{description}</p><button onClick={() => onOpen("project", name)}>VIEW PROJECT <ArrowUpRight size={14} /></button></article>)}</div></div></section>;
}

function EngagementPanel({ onClose }: { onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  return <div className="platform-modal" role="dialog" aria-modal="true" aria-label="Start a project"><div className="engage-panel"><button className="modal-close" onClick={onClose} aria-label="Close panel"><X size={20} /></button>{submitted ? <div className="form-success"><Check size={28} /><p>REQUEST QUEUED</p><small>Your project brief is staged locally. Connect a backend to transmit it.</small><button onClick={onClose}>RETURN TO PLATFORM</button></div> : <><SectionEyebrow code="LINK / 01">START A PROJECT</SectionEyebrow><h2>Let&apos;s make the next <span>system.</span></h2><form onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}><div className="form-grid"><label>NAME<input required name="name" /></label><label>EMAIL<input required type="email" name="email" /></label><label>PHONE / WHATSAPP<input name="phone" /></label><label>PROJECT TYPE<select name="type" defaultValue="Web Development">{services.map(([, name]) => <option key={name}>{name}</option>)}</select></label></div><label>PROJECT DESCRIPTION<textarea required name="description" rows={4} /></label><label>BUDGET RANGE<select name="budget" defaultValue="To be discussed"><option>To be discussed</option><option>Under $5,000</option><option>$5,000 — $15,000</option><option>$15,000+</option></select></label><button className="form-submit" type="submit">REQUEST CONSULTATION <ArrowUpRight size={16} /></button></form></>}</div></div>;
}

export function PlatformExperience() {
  const [panel, setPanel] = useState<Panel>(null);
  const [panelValue, setPanelValue] = useState("");
  const open = (next: Panel, value = "") => { setPanelValue(value); setPanel(next); };
  return <>
    <SynthWorkflow />
    <SystemsSection />
    <ServicesSection onOpen={open} />
    <ArchiveSection onOpen={open} />
    <section id="engage" className="platform-cta"><div className="platform-container"><SectionEyebrow code="LINK / 02">OPEN CHANNEL</SectionEyebrow><h2>Have a system in mind?</h2><button onClick={() => open("engage")}>ENGAGE ANONYMIKETECH <ArrowUpRight size={18} /></button></div></section>
    {panel === "engage" && <EngagementPanel onClose={() => setPanel(null)} />}
    {panel === "service" && <div className="platform-modal" role="dialog" aria-modal="true"><div className="detail-panel"><button className="modal-close" onClick={() => setPanel(null)} aria-label="Close panel"><X size={20} /></button><SectionEyebrow code="MODULE / ACTIVE">SERVICE DETAIL</SectionEyebrow><h2>{panelValue}</h2><p className="platform-copy">This capability is available for a scoped consultation. We will map the right architecture, delivery path and measurable outcome for your team.</p><div className="detail-list"><span>DISCOVERY + SCOPE</span><span>ARCHITECTURE REVIEW</span><span>DELIVERY ROADMAP</span></div><button onClick={() => open("engage")}>START A CONVERSATION <ArrowUpRight size={16} /></button></div></div>}
    {panel === "project" && <div className="platform-modal" role="dialog" aria-modal="true"><div className="detail-panel"><button className="modal-close" onClick={() => setPanel(null)} aria-label="Close panel"><X size={20} /></button><SectionEyebrow code="ARCHIVE / RECORD">PROJECT DETAIL</SectionEyebrow><h2>{panelValue}</h2><p className="platform-copy">This record is part of the ANONYMIKETECH build archive. Status and scope are intentionally transparent: live systems are distinguished from concepts and active development.</p><div className="detail-list"><span>STATUS TRACE</span><span>TECHNOLOGY MAP</span><span>BUILD NOTES</span></div></div></div>}
  </>;
}
