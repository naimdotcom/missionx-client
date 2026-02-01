import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for the AI Messaging Platform BrainChat",
};

export default function PrivacyPolicyPage() {
  const companyName = "BrainChat";
  const effectiveDate = "2025-12-17";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto max-w-4xl px-6 py-16">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Effective Date: <span className="font-medium">{effectiveDate}</span>
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Your privacy is important to us. This Privacy Policy explains how{" "}
            <strong>{companyName}</strong> collects, uses, and protects your
            information when you use our AI-powered messaging platform.
          </p>
        </header>

        <div className="space-y-10 text-sm leading-7">
          {/* 1. Information We Collect */}
          <section>
            <h2 className="text-xl font-semibold">1. Information We Collect</h2>
            <p className="mt-3">
              We collect information you provide directly to us, including:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>
                <strong>Account Information:</strong> Name, email address,
                authentication credentials, and billing details.
              </li>
              <li>
                <strong>Configuration Data:</strong> Agent instructions,
                training documents, system prompts, and other configuration
                inputs.
              </li>
              <li>
                <strong>Communication Data:</strong> Messages sent to and from
                your AI agents through the Service.
              </li>
            </ul>
          </section>

          {/* 2. Third-Party Channel Data */}
          <section>
            <h2 className="text-xl font-semibold">
              2. Third-Party Channel Data
            </h2>
            <p className="mt-3">
              When you connect third-party messaging or social platforms (such
              as WhatsApp, Facebook, or similar services), we receive
              data through their official APIs, which may include:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>
                Recipient identifiers (e.g., phone numbers or user handles)
              </li>
              <li>Message timestamps and metadata</li>
              <li>Text or media content required to process messages</li>
            </ul>
          </section>

          {/* 3. How We Use Data */}
          <section>
            <h2 className="text-xl font-semibold">3. How We Use Your Data</h2>
            <p className="mt-3">We use collected data to:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Operate, maintain, and improve the Service</li>
              <li>Process and deliver AI-generated responses</li>
              <li>Provide customer support and technical assistance</li>
              <li>Ensure security, compliance, and abuse prevention</li>
            </ul>
          </section>

          {/* 4. AI & Machine Learning */}
          <section>
            <h2 className="text-xl font-semibold">
              4. AI &amp; Machine Learning
            </h2>

            <div className="mt-4 rounded-md border border-border bg-background px-4 py-3 text-sm">
              <p className="font-medium">Transparency Notice on AI Training</p>
              <p className="mt-1 text-foreground font-medium">
                Depending on your subscription plan, anonymized conversation
                data may be used to improve our AI systems. You may opt out of
                this usage through account settings or an Enterprise agreement.
              </p>
            </div>

            <p className="mt-4">
              Messages are processed using Large Language Models (LLMs) provided
              by industry-standard vendors. Where available, we rely on API
              privacy controls such as zero-retention or limited-retention
              policies.
            </p>
          </section>

          {/* 5. Data Sharing */}
          <section>
            <h2 className="text-xl font-semibold">5. Data Sharing</h2>
            <p className="mt-3">
              We do not sell your personal data. We may share data only with:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>
                <strong>Sub-processors:</strong> Infrastructure, hosting, and AI
                model providers
              </li>
              <li>
                <strong>Third-Party Integrations:</strong> Platforms you
                explicitly connect to the Service
              </li>
              <li>
                <strong>Legal Authorities:</strong> When required by law or to
                protect our legal rights
              </li>
            </ul>
          </section>

          {/* 6. Data Security */}
          <section>
            <h2 className="text-xl font-semibold">6. Data Security</h2>
            <p className="mt-3">
              We implement industry-standard security measures, including{" "}
              <strong>encryption at rest</strong> and{" "}
              <strong>encryption in transit</strong>. Access to customer data is
              restricted to authorized personnel only.
            </p>
          </section>

          {/* 7. Data Retention */}
          <section>
            <h2 className="text-xl font-semibold">7. Data Retention</h2>
            <p className="mt-3">
              We retain personal data only for as long as necessary to provide
              the Service or comply with legal obligations. You may request
              deletion of your data at any time.
            </p>
          </section>

          {/* 8. Your Rights */}
          <section>
            <h2 className="text-xl font-semibold">8. Your Rights</h2>
            <p className="mt-3">
              Depending on your jurisdiction (including GDPR and CCPA), you may
              have the right to:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Access and export your personal data</li>
              <li>Request deletion of your account and message history</li>
              <li>Object to or restrict certain data processing activities</li>
            </ul>
          </section>

          {/* 9. Contact */}
          <section>
            <h2 className="text-xl font-semibold">9. Contact Information</h2>
            <p className="mt-3">
              For privacy-related questions or data requests, contact:
            </p>
            <p className="mt-2">
              <strong>{companyName} Privacy Team</strong>
              <br />
              <a
                href="mailto:privacy@brainchat.ai"
                className="text-primary underline"
              >
                privacy@brainchat.ai
              </a>
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
