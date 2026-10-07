import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { SITE_INFO } from "@/data/siteInfo";

export const metadata: Metadata = {
  title: `Privacy Policy · ${SITE_INFO.appName}`,
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      subtitle={`Last updated: ${SITE_INFO.lastUpdated}`}
    >
      <p className="legal-callout">
        Short version: there are no accounts, no cookies and no tracking. The
        messages you type are sent to an AI provider to generate the replies,
        and we don&apos;t store them.
      </p>

      <h2>1. Who is responsible for your data</h2>
      <p>
        The data controller is <strong>{SITE_INFO.ownerName}</strong>, who runs
        this website as a personal, non-commercial project. You can get in touch
        through the contact details on{" "}
        <a
          href={SITE_INFO.personalSiteUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          my personal website
        </a>
        .
      </p>

      <h2>2. What data is processed</h2>
      <ul>
        <li>
          <strong>Chat messages.</strong> What you type in the chat is sent to
          our server and forwarded to an AI provider to generate the
          waiter&apos;s and the chefs&apos; replies. The conversation lives only
          in your browser tab: we don&apos;t save it, and it disappears when you
          reload or close the page.
        </li>
        <li>
          <strong>Technical data.</strong> Like any website, the hosting
          provider automatically processes technical information such as your IP
          address, browser type and the time of your requests, in order to
          deliver the site and keep it secure.
        </li>
      </ul>
      <p>
        <strong>
          Please don&apos;t type personal or sensitive information in the chat
        </strong>{" "}
        (names, addresses, health details and so on). The chefs won&apos;t need
        it, and they won&apos;t give you a real recipe anyway.
      </p>

      <h2>3. Cookies and tracking</h2>
      <p>
        This website does not set cookies and does not use analytics,
        advertising or tracking tools. The &quot;loyalty card&quot; statistics
        are kept in your browser&apos;s memory only for as long as the page is
        open.
      </p>

      <h2>4. Third-party services</h2>
      <ul>
        <li>
          <strong>Vercel Inc.</strong> (USA) hosts the website. See the{" "}
          <a
            href="https://vercel.com/legal/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vercel Privacy Policy
          </a>
          .
        </li>
        <li>
          <strong>Groq, Inc.</strong> (USA) generates the AI replies from your
          chat messages. See the{" "}
          <a
            href="https://groq.com/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Groq Privacy Policy
          </a>
          .
        </li>
      </ul>
      <p>
        Because these providers are based in the United States, your data may be
        transferred outside the European Union. Such transfers rely on the
        safeguards described in each provider&apos;s policy, such as the EU
        Standard Contractual Clauses or the EU-U.S. Data Privacy Framework.
      </p>

      <h2>5. Why we process data (legal basis)</h2>
      <ul>
        <li>
          Chat messages: to provide the service you request by using the chat
          (Art. 6(1)(b) GDPR).
        </li>
        <li>
          Technical data: our legitimate interest in running a working and
          secure website (Art. 6(1)(f) GDPR).
        </li>
      </ul>

      <h2>6. How long data is kept</h2>
      <p>
        We don&apos;t keep your conversations. Technical logs and the data
        processed by the AI provider are retained by Vercel and Groq according
        to their own policies linked above.
      </p>

      <h2>7. Your rights</h2>
      <p>
        Under the GDPR you have the right to access, rectify and erase your
        data, to restrict or object to its processing, and to data portability.
        To exercise these rights, use the contact details on{" "}
        <a
          href={SITE_INFO.personalSiteUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          my personal website
        </a>
        . You also have the right to lodge a complaint with a supervisory
        authority; in Italy, this is the{" "}
        <a
          href="https://www.garanteprivacy.it"
          target="_blank"
          rel="noopener noreferrer"
        >
          Garante per la protezione dei dati personali
        </a>
        .
      </p>

      <h2>8. Children</h2>
      <p>This website is not intended for children under 14.</p>

      <h2>9. Changes to this policy</h2>
      <p>
        If this policy changes, the new version will be published on this page
        with an updated date.
      </p>
    </LegalPage>
  );
}
