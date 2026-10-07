import Link from "next/link";

interface LegalPageProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

// Shared card layout for the Privacy, Terms and Contact pages
export default function LegalPage({
  title,
  subtitle,
  children,
}: LegalPageProps) {
  return (
    <article className="legal-page">
      <Link href="/" className="legal-back">
        ← Back to the bistrò
      </Link>
      <h1 className="legal-title gradient-text">{title}</h1>
      {subtitle && <p className="legal-subtitle">{subtitle}</p>}
      <div className="legal-content">{children}</div>
    </article>
  );
}
