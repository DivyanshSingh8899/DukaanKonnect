import { Layout } from '@/components/Layout';

export default function Terms() {
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
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: July 2026</p>
        </div>
      </div>

      <div className="container mx-auto max-w-3xl px-4 py-12 space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            1. Using Dukaan Konnect
          </h2>
          <p>
            Dukaan Konnect connects customers with independent home service
            professionals for services such as cleaning, plumbing, electrical
            work, salon services, and more. By creating an account or booking
            a service, you agree to these terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            2. Bookings and Payments
          </h2>
          <p>
            Prices shown for each service are displayed before you confirm a
            booking. Payment is collected securely at checkout via Razorpay.
            A booking is confirmed once payment succeeds and moves through
            pending → confirmed → in_progress → completed.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            3. Cancellations
          </h2>
          <p>
            You can request cancellation of a booking from your Orders page.
            Refund eligibility depends on how far in advance the cancellation
            is made relative to the scheduled service time.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            4. Service Professionals
          </h2>
          <p>
            Professionals on Dukaan Konnect are independent providers. While
            we vet and onboard professionals, Dukaan Konnect acts as a
            platform connecting customers and professionals, and is not
            itself the employer of service professionals.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            5. Account Responsibility
          </h2>
          <p>
            You are responsible for keeping your account access (email
            verification codes) secure and for the accuracy of the addresses
            and details you provide for a booking.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            6. Changes to These Terms
          </h2>
          <p>
            We may update these terms from time to time. Continued use of
            Dukaan Konnect after changes are posted means you accept the
            revised terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            7. Contact Us
          </h2>
          <p>
            Questions about these terms can be sent to{' '}
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
