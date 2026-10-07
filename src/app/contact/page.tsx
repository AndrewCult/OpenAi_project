import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { SITE_INFO } from "@/data/siteInfo";

export const metadata: Metadata = {
  title: `Contact · ${SITE_INFO.appName}`,
};

export default function ContactPage() {
  return (
    <LegalPage
      title="Contact me"
      subtitle="Unlike our chefs, I actually reply."
    >
      <p>
        Hi, I&apos;m <strong>{SITE_INFO.ownerName}</strong>, the human behind
        the SummerCamp Bistrò. Feedback, bug reports, ideas for new chefs, or
        just a good laugh to share: you can find me and my contacts on my
        personal website.
      </p>

      <div className="contact-links">
        <a
          className="contact-button primary"
          href={SITE_INFO.personalSiteUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit my website
        </a>
        <a
          className="contact-button secondary"
          href={SITE_INFO.githubRepoUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          View the source on GitHub
        </a>
      </div>

      <p>
        Found a bug? Opening an issue on GitHub is the fastest way to report it.
        Please don&apos;t ask the waiter: he&apos;ll just put you on hold.
      </p>
    </LegalPage>
  );
}
