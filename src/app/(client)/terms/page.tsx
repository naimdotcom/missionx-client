import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for the AI Messaging Platform BrainChat",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto max-w-4xl px-6 py-16">
        <header className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight">
            Terms of Service
          </h1>
          <p className="mt-2 text-sm text-foreground">
            Effective Date: <span className="font-medium">2025-12-17</span>
          </p>
        </header>

        <div className="space-y-10 text-sm leading-7">
          {/* 1. Acceptance of Terms */}
          <section>
            <h2 className="text-xl font-semibold">1. Acceptance of Terms</h2>
            <p className="mt-3">
              These Terms of Service (the “Terms”) govern your access to and use
              of the services, website, and applications provided by{" "}
              <strong>BrainChat</strong> (“we,” “us,” or “our”) that allow you
              to deploy and manage AI-powered messaging agents across various
              third-party social media and messaging channels (the “Service”).
            </p>
            <p className="mt-3">
              By creating an account, accessing, or using the Service, you agree
              to be bound by these Terms and our Privacy Policy. If you do not
              agree, you may not access or use the Service.
            </p>
          </section>

          {/* 2. The Service */}
          <section>
            <h2 className="text-xl font-semibold">2. The Service</h2>

            <h3 className="mt-4 font-medium">2.1 Description</h3>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Configure, train, and deploy AI messaging agents</li>
              <li>
                Connect agents to third-party social and messaging platforms
                (e.g., Facebook Messenger, Instagram, WhatsApp, X)
              </li>
              <li>
                Automate communication, responses, and data collection across
                connected channels
              </li>
            </ul>

            <h3 className="mt-4 font-medium">2.2 License</h3>
            <p className="mt-2">
              Subject to these Terms, we grant you a limited, non-exclusive,
              non-transferable, and revocable license to use the Service for
              your internal business purposes.
            </p>
          </section>

          {/* 3. User Accounts */}
          <section>
            <h2 className="text-xl font-semibold">
              3. User Accounts and Responsibility
            </h2>

            <h3 className="mt-4 font-medium">3.1 Account Creation</h3>
            <p className="mt-2">
              You must provide accurate and complete information when
              registering for an account. You are responsible for maintaining
              the confidentiality of your login credentials.
            </p>

            <h3 className="mt-4 font-medium">3.2 Account Security</h3>
            <p className="mt-2">
              You are responsible for all activities under your account and must
              notify us immediately of any unauthorized access or security
              breach.
            </p>

            <h3 className="mt-4 font-medium">3.3 Age Restriction</h3>
            <p className="mt-2">
              You must be at least 18 years old and legally capable of forming a
              binding contract.
            </p>
          </section>

          {/* 4. Third-Party Integrations */}
          <section>
            <h2 className="text-xl font-semibold">
              4. Integration with Third-Party Channels
            </h2>

            <h3 className="mt-4 font-medium">4.1 Third-Party Terms</h3>
            <p className="mt-2">
              Your use of Third-Party Channels is subject to their respective
              terms and privacy policies. You are solely responsible for
              compliance with those terms.
            </p>

            <h3 className="mt-4 font-medium">4.2 API Access</h3>
            <p className="mt-2">
              You grant us permission to access necessary APIs and data from
              your connected Third-Party Channels solely to operate the Service.
              We are not responsible for third-party availability or security.
            </p>
          </section>

          {/* 5. Data and Compliance */}
          <section>
            <h2 className="text-xl font-semibold">
              5. Data, Content, and Compliance
            </h2>

            <h3 className="mt-4 font-medium">5.1 User Content</h3>
            <p className="mt-2">
              You are solely responsible for all data, text, images, and content
              you upload or transmit through the Service (“User Content”).
            </p>

            <h3 className="mt-4 font-medium">
              5.2 Responsibility for Agent Output
            </h3>
            <p className="mt-2">
              AI-generated content may require human oversight. You bear full
              legal responsibility for all content generated by your AI agents,
              including compliance with applicable laws.
            </p>

            <h3 className="mt-4 font-medium">5.3 Legal Compliance</h3>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Violating any applicable law or regulation</li>
              <li>Sending spam or unauthorized promotions</li>
              <li>Engaging in fraud, phishing, or impersonation</li>
              <li>Infringing third-party intellectual property rights</li>
            </ul>
          </section>

          {/* 6. Intellectual Property */}
          <section>
            <h2 className="text-xl font-semibold">6. Intellectual Property</h2>

            <h3 className="mt-4 font-medium">6.1 Our Intellectual Property</h3>
            <p className="mt-2">
              All rights to the Service, excluding User Content, remain the
              exclusive property of <strong>BrainChat</strong>.
            </p>

            <h3 className="mt-4 font-medium">6.2 Your Content</h3>
            <p className="mt-2">
              You retain ownership of your User Content and grant us a
              non-exclusive, royalty-free license to use it solely to provide
              the Service.
            </p>
          </section>

          {/* 7. Fees and Termination */}
          <section>
            <h2 className="text-xl font-semibold">
              7. Fees, Payment, and Termination
            </h2>

            <p className="mt-2">
              Failure to pay applicable fees may result in suspension or
              termination. You may terminate your account at any time. We may
              suspend or terminate access for violations of these Terms.
            </p>
          </section>

          {/* 8. Disclaimers */}
          <section>
            <h2 className="text-xl font-semibold">
              8. Disclaimers and Limitation of Liability
            </h2>

            <p className="mt-2 uppercase text-xs tracking-wide text-foreground font-medium">
              The Service is provided “as is” and “as available” without
              warranties of any kind.
            </p>

            <p className="mt-3">
              To the fullest extent permitted by law, <strong>BrainChat</strong>{" "}
              shall not be liable for any indirect, incidental, or consequential
              damages.
            </p>
          </section>

          {/* 9. Indemnification */}
          <section>
            <h2 className="text-xl font-semibold">9. Indemnification</h2>
            <p className="mt-2">
              You agree to indemnify and hold harmless{" "}
              <strong>BrainChat</strong> from claims arising from your use of
              the Service or violation of these Terms.
            </p>
          </section>

          {/* 10. Governing Law */}
          <section>
            <h2 className="text-xl font-semibold">
              10. Governing Law and Dispute Resolution
            </h2>
            <p className="mt-2">
              These Terms are governed by the laws of{" "}
              <strong>California, United States</strong>. Disputes shall be
              resolved in <strong>San Francisco, California</strong> or via
              binding arbitration, as applicable.
            </p>
          </section>

          {/* 11. Changes */}
          <section>
            <h2 className="text-xl font-semibold">11. Changes to Terms</h2>
            <p className="mt-2">
              We may modify these Terms at any time. Continued use of the
              Service after changes take effect constitutes acceptance.
            </p>
          </section>

          {/* 12. Contact */}
          <section>
            <h2 className="text-xl font-semibold">12. Contact Information</h2>
            <p className="mt-2">
              <strong>BrainChat</strong>
              <br />
              San Francisco, CA
              <br />
              <a
                href="mailto:support@brainchat.ai"
                className="text-primary underline"
              >
                support@brainchat.ai
              </a>
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
