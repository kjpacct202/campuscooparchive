import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Accessibility",
  description:
    "How the Campus COOP Archive works toward WCAG 2.1 AA, what we do, where we fall short, and how to report a problem.",
};

export default function Page() {
  return (
    <div>
      <div className="page-head">
        <div className="eyebrow">Accessibility</div>
        <h1>Accessibility</h1>
        <p className="lead">
          We want everyone to be able to use the archive, including people who
          navigate by keyboard, use a screen reader, or need a calmer, lower
          motion experience.
        </p>
      </div>
      <div className="prose">
        <div className="callout">
          We target WCAG 2.1 AA across the whole site.
        </div>

        <h2>What we do</h2>
        <p>
          Accessibility is part of how the archive is built, not something
          bolted on at the end. Here is what is in place today.
        </p>
        <ul>
          <li>
            Full keyboard navigation. Every interactive element can be reached
            and operated with the keyboard, including a skip-to-content link at
            the top of each page and a Cmd/Ctrl-K command palette for jumping
            straight to a plan, an institution, or a page.
          </li>
          <li>
            A light theme and a dark theme, both checked so that text and
            interface colors meet AA contrast ratios. You are not forced into a
            single look to stay readable.
          </li>
          <li>
            Visible focus indicators. When you tab through the page, the element
            you are on is clearly outlined, so you always know where you are.
          </li>
          <li>
            Touch targets of at least 44 by 44 pixels for buttons and links, so
            controls are easy to hit on phones and tablets.
          </li>
          <li>
            Screen-reader data tables behind the visuals. Every chart and the
            coverage map ship with an equivalent data table, so the underlying
            numbers are available to assistive technology and not locked inside
            a picture.
          </li>
          <li>
            Motion that respects your settings. All animation honors the
            prefers-reduced-motion preference, so if you have asked your system
            to reduce motion, the archive stays still.
          </li>
        </ul>

        <h2>Known limitations</h2>
        <p>
          We would rather be honest about the rough edges than pretend they are
          not there.
        </p>
        <ul>
          <li>
            Some of the wide data tables scroll horizontally on small screens.
            On a narrow phone you may need to swipe sideways to see every column.
          </li>
          <li>
            The dataset is dense. With 210 plans scored against a 22-component
            benchmark, some pages carry a lot of information at once, which can
            be a heavy load to take in, especially with a screen reader.
          </li>
        </ul>

        <h2>Reporting a problem</h2>
        <p>
          If something is hard to use, or impossible, we want to hear about it.
          Open an issue on{" "}
          <Link href="https://github.com/kjpacct202/campuscooparchive">
            our GitHub repository
          </Link>{" "}
          and describe what you ran into: the page, the device or assistive
          technology you were using, and what got in your way.
        </p>
        <p>
          We treat accessibility bugs as priority. If the archive is keeping
          someone out, that is a problem worth fixing first.
        </p>
      </div>
    </div>
  );
}
