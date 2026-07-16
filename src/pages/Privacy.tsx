import { Layout } from '@/components/Layout';

export default function Privacy() {
  return (
    <Layout>
      <div
        className="relative bg-muted/30 border-b"
        style={{
          backgroundImage:
            'radial-gradient(circle, var(--border) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      >
        <div className="container mx-auto max-w-6xl px-4 py-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: July 2026</p>
        </div>
      </div>

      <div className="container mx-auto max-w-3xl px-4 py-12 space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            1. Information We Collect
          </h2>
          <p>
            When you use Dukaan Konnect, we collect information you provide directly,
            such as your name, email address, phone number, and service addresses.
            We also collect booking details, payment information (processed securely
            via Razorpay — we never store your card details), and messages you send
            through our support chat.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            2. How We Use Your Information
          </h2>
          <p>
            We use your information to create and manage your account, process
            bookings and payments, connect you with service professionals,
            send booking confirmations and updates, and respond to support requests.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            3. Sharing of Information
          </h2>
          <p>
            We share the minimum necessary booking details (such as your name,
            address, and contact number) with the professional assigned to your
            booking so they can complete the service. We do not sell your
            personal information to third parties.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            4. Data Security
          </h2>
          <p>
            We use industry-standard measures to protect your data, including
            encrypted connections and secure payment processing. Access to your
            account is protected by one-time email verification codes.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            5. Your Choices
          </h2>
          <p>
            You can review and update your saved addresses and profile details
            at any time from your Profile page. To request deletion of your
            account or data, contact us using the details below.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            6. Contact Us
          </h2>
          <p>
            If you have questions about this Privacy Policy, reach out at{' '}
            <a
              href="mailto:support.dukaankonnect@gmail.com"
              className="text-blue-600 underline underline-offset-2"
            >
              support.dukaankonnect@gmail.com
            </a>
            .
          </p>
        </section>
      </div>
    </Layout>
  );
}
