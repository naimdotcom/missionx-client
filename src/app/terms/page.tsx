// Data structure for the Table of Contents
const SECTIONS = [
  { id: "acceptance", title: "1. Acceptance of Terms" },
  { id: "service", title: "2. The Service" },
  { id: "accounts", title: "3. User Accounts" },
  { id: "third-party", title: "4. Third-Party Channels" },
  { id: "compliance", title: "5. Data & Compliance" },
  { id: "intellectual-property", title: "6. Intellectual Property" },
  { id: "payment", title: "7. Fees & Termination" },
  { id: "liability", title: "8. Limitation of Liability" },
  { id: "indemnification", title: "9. Indemnification" },
  { id: "governing-law", title: "10. Governing Law" },
  { id: "changes", title: "11. Changes" },
  { id: "contact", title: "12. Contact" },
];

export default function TermsOfService() {
  const companyName = "MissionX";
  const platformName = "MissionX";
  const effectiveDate = "2025-12-17";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-20 flex flex-col md:flex-row gap-12">
        {/* Sidebar Navigation - Hidden on mobile, sticky on desktop */}
        <aside className="hidden md:block w-64 shrink-0">
          <nav className="sticky top-24 space-y-1">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
              Table of Contents
            </p>
            {SECTIONS.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="block py-2 text-sm text-slate-600 hover:text-blue-600 transition-colors border-l-2 border-transparent hover:border-blue-600 pl-4"
              >
                {section.title}
              </a>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <article className="flex-1 bg-white border border-slate-200 shadow-sm rounded-2xl p-8 md:p-12 prose prose-slate max-w-none">
          <header className="mb-10 border-b border-slate-100 pb-8">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
              Terms of Service
            </h1>
            <p className="text-slate-500 font-medium">
              Last Updated: {effectiveDate}
            </p>
          </header>

          <section id="acceptance" className="mb-12 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
            <p>
              These Terms of Service (the "Terms") govern your access to and use
              of the services, website, and applications provided by{" "}
              {companyName} ("we," "us," or "our") that allow you to deploy and
              manage AI-powered messaging agents across various third-party
              social media and messaging channels (the "Service").
            </p>
            <p className="mt-4">
              By creating an account, accessing, or using the Service, you agree
              to be bound by these Terms and our Privacy Policy. If you do not
              agree to these Terms, you may not access or use the Service.
            </p>
          </section>

          <section id="service" className="mb-12 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-4">2. The Service</h2>
            <h3 className="text-lg font-semibold mt-4">2.1 Description</h3>
            <p>The Service is a platform that enables users to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Configure, train, and deploy AI messaging agents.</li>
              <li>
                Connect these agents to third-party social media and messaging
                platforms (e.g., Facebook Messenger, Instagram, WhatsApp, X,
                etc.) ("Third-Party Channels").
              </li>
              <li>
                Automate communication, response, and data collection via these
                agents across the connected channels.
              </li>
            </ul>
            <h3 className="text-lg font-semibold mt-6">2.2 License</h3>
            <p>
              Subject to these Terms, we grant you a limited, non-exclusive,
              non-transferable, and revocable license to use the Service for
              your internal business purposes.
            </p>
          </section>

          <section id="accounts" className="mb-12 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-4">
              3. User Accounts and Responsibility
            </h2>
            <p>
              <strong>3.1 Account Creation:</strong> You must provide accurate
              and complete information when registering for an account. You are
              solely responsible for maintaining the confidentiality of your
              credentials.
            </p>
            <p className="mt-4">
              <strong>3.2 Account Security:</strong> You must notify us
              immediately upon becoming aware of any breach of security or
              unauthorized use of your account.
            </p>
            <p className="mt-4">
              <strong>3.3 Age Restriction:</strong> The Service is intended for
              users who are at least 18 years of age.
            </p>
          </section>

          <section id="third-party" className="mb-12 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-4">
              4. Integration with Third-Party Channels
            </h2>
            <p>
              The Service requires integration with Third-Party Channels. You
              acknowledge that your use is subject to the terms and privacy
              policies of those third-party providers. You are solely
              responsible for compliance with all applicable Third-Party Channel
              terms.
            </p>
            <p className="mt-4">
              You grant us permission to access the necessary APIs solely for
              the purpose of providing and operating the Service.
            </p>
          </section>

          <section id="compliance" className="mb-12 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-4">
              5. Data, Content, and Compliance
            </h2>
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 my-6">
              <p className="text-amber-800 font-semibold">
                Important: Responsibility for Agent Output
              </p>
              <p className="text-amber-700 text-sm mt-1">
                You acknowledge that the AI agent's output is generated and may
                require human oversight. You bear full legal responsibility for
                all messages and content generated by your deployed AI agents.
              </p>
            </div>
            <p>
              You agree not to use the Service to violate laws, transmit spam,
              conduct phishing, or infringe upon third-party rights.
            </p>
          </section>

          <section id="intellectual-property" className="mb-12 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-4">
              6. Intellectual Property
            </h2>
            <p>
              All right, title, and interest in and to the Service (excluding
              User Content) remain the exclusive property of {companyName}. You
              retain all ownership rights in your User Content and Customer
              Data.
            </p>
          </section>

          <section id="liability" className="mb-12 scroll-mt-24 uppercase">
            <h2 className="text-2xl font-bold mb-4 normal-case">
              8. Disclaimer & Limitation of Liability
            </h2>
            <p className="text-sm border p-4 bg-slate-50 border-slate-200">
              THE SERVICE IS PROVIDED "AS IS." TO THE FULLEST EXTENT PERMITTED
              BY LAW, IN NO EVENT SHALL {companyName} BE LIABLE FOR ANY
              INDIRECT, INCIDENTAL, OR SPECIAL DAMAGES RESULTING FROM YOUR USE
              OF THE SERVICE OR THE OUTPUT OF AI AGENTS.
            </p>
          </section>

          <section
            id="contact"
            className="mb-12 scroll-mt-24 border-t border-slate-100 pt-8"
          >
            <h2 className="text-2xl font-bold mb-4">12. Contact Information</h2>
            <div className="bg-slate-50 p-6 rounded-lg">
              <p className="font-bold text-slate-900">{companyName}</p>
              <p className="text-slate-600">[Your Company Address]</p>
              <p className="text-blue-600 mt-2 font-medium">
                [Your Support Email Address]
              </p>
            </div>
          </section>
        </article>
      </div>
    </div>
  );
}
