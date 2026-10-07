import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/LegalPage";
import { SITE_INFO } from "@/data/siteInfo";

export const metadata: Metadata = {
  title: `Terms of Service · ${SITE_INFO.appName}`,
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      subtitle={`Last updated: ${SITE_INFO.lastUpdated}`}
    >
      <p className="legal-callout">
        <strong>This is a joke, not a cookbook.</strong> The chefs are designed
        to be unhelpful, and their recipes are intentionally wrong. Never cook
        from them, and never rely on them for allergens or dietary information.
      </p>

      <h2>1. What this website is</h2>
      <p>
        {SITE_INFO.appName} (&quot;SummerCamp Bistrò&quot;) is a free,
        non-commercial, humorous experiment in human–AI interaction, run by{" "}
        {SITE_INFO.ownerName}. By using it, you accept these terms. If you
        don&apos;t, please don&apos;t use the website.
      </p>

      <h2>2. AI-generated content</h2>
      <p>
        All replies from the waiter and the chefs are generated automatically by
        an AI model. They may be inaccurate, absurd, unexpected or occasionally
        inappropriate, and they do not represent the opinions of the owner.
        Nothing on this website is professional advice of any kind: culinary,
        nutritional, medical or otherwise.
      </p>

      <h2>3. Fictional characters</h2>
      <p>
        The waiter, the chefs and the bistrò are fictional. Any resemblance to
        real people or restaurants is purely coincidental. The &quot;loyalty
        card&quot; and its rewards are part of the joke: no reward can be
        redeemed, now or ever.
      </p>

      <h2>4. Acceptable use</h2>
      <p>Please don&apos;t:</p>
      <ul>
        <li>
          try to disrupt, overload or attack the website or the services it
          relies on;
        </li>
        <li>use bots or scripts to send messages automatically;</li>
        <li>use the chat to produce illegal, hateful or harmful content;</li>
        <li>
          enter personal or sensitive information about yourself or others.
        </li>
      </ul>

      <h2>5. Availability and liability</h2>
      <p>
        The website is provided &quot;as is&quot;, without warranties of any
        kind. It may be unavailable, change, or be discontinued at any time
        without notice. To the maximum extent permitted by law, the owner is not
        liable for any damage arising from its use, including anything you
        decide to cook.
      </p>

      <h2>6. Source code</h2>
      <p>
        The source code is available on{" "}
        <a
          href={SITE_INFO.githubRepoUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
        .
      </p>

      <h2>7. Privacy</h2>
      <p>
        How your data is handled is explained in the{" "}
        <Link href="/privacy">Privacy Policy</Link>.
      </p>

      <h2>8. Changes and governing law</h2>
      <p>
        These terms may be updated from time to time; the current version is
        always the one on this page. These terms are governed by Italian law,
        without prejudice to any mandatory consumer protection rules of your
        country of residence.
      </p>
    </LegalPage>
  );
}
