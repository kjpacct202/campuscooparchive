import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "The Campus COOP Archive is a static website that collects nothing: no cookies, no tracking, no accounts, no analytics.",
};

export default function Page() {
  return (
    <div>
      <div className="page-head">
        <div className="eyebrow">Privacy</div>
        <h1>Privacy</h1>
        <p className="lead">
          This is a static website that collects nothing. There are no cookies,
          no trackers, no accounts, and no analytics. Nothing about your visit
          is recorded by us.
        </p>
      </div>
      <div className="prose">
        <h2>The short version</h2>
        <div className="callout">
          No cookies. No tracking. No accounts. No analytics. No data
          collection. The Campus COOP Archive is a set of static files served
          from a content delivery network (CDN), so there is nothing for us to
          collect and nowhere for your information to go.
        </div>

        <h2>What we don&apos;t collect</h2>
        <p>
          We do not collect any personal data. We do not ask for your name,
          your email, or anything else, and there is no form here that sends
          information to a server.
        </p>
        <p>
          There is no behavioral tracking. We do not log what pages you read,
          what you click, or how long you stay. There are no advertising
          pixels, no fingerprinting, and no session profiles.
        </p>
        <p>
          There are no third-party scripts. The site does not load Google
          Analytics, ad networks, social media widgets, or any other outside
          code that could watch you on our behalf.
        </p>

        <h2>Data you choose to download</h2>
        <p>
          Some pages let you export data, for example as a CSV or JSON file.
          Those exports are generated right in your browser from data the page
          already loaded. Nothing about your export is sent anywhere, and we
          never see what you download or what you do with it.
        </p>

        <h2>Hosting</h2>
        <p>
          The site is served through Vercel&apos;s CDN. Like any web host,
          Vercel may keep standard server request logs (things like IP
          addresses and timestamps) for basic operations and security. Those
          logs are outside our control, and we do not access them, use them, or
          build anything on top of them.
        </p>

        <h2>Changes</h2>
        <p>
          If this page ever changes, the new version will simply replace this
          one here. There is no mailing list to update because we do not have
          your address. If you have a question about privacy, the best way to
          reach us is to open an issue on the{" "}
          <Link href="https://github.com/kjpacct202/campuscooparchive">
            project&apos;s GitHub repository
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
