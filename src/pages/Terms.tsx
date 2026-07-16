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
          <p className="text-muted-foreground">Effective Date: July 2026</p>
        </div>
      </div>

      <div className="container mx-auto max-w-3xl px-4 py-12 space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section>
          <p>
            These Terms of Service (the &ldquo;Terms&rdquo;) constitute a binding agreement between
            you and Dukaan Konnect (&ldquo;Dukaan Konnect,&rdquo; &ldquo;the Company,&rdquo;
            &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) governing your access to and use
            of our website, mobile application, and related services (collectively, the
            &ldquo;Platform&rdquo;). Dukaan Konnect operates a marketplace that connects customers
            seeking home services — including cleaning, plumbing, electrical work, salon and spa
            services, carpentry, painting, appliance repair, and pest control — with independent,
            verified service professionals. By creating an account, browsing our services, or
            confirming a booking, you affirm that you have read, understood, and agree to be bound
            by these Terms. If you do not agree with any part of these Terms, you should refrain
            from using the Platform.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            1. Eligibility and Account Registration
          </h2>
          <p>
            To access certain features of the Platform, you may be required to register for an
            account using a valid email address, which is verified through a one-time code sent at
            the time of sign-in. You are responsible for maintaining the confidentiality of your
            account access and for the accuracy of the information you provide, including the name,
            contact details, and addresses associated with your bookings. You agree to notify us
            promptly of any unauthorized use of your account.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            2. Bookings and Payments
          </h2>
          <p>
            When you request a service through the Platform, the applicable price is displayed to
            you prior to confirmation. Payment is collected securely at the time of checkout through
            our payment partner, Razorpay, and a booking is considered confirmed once payment has
            been successfully processed. From that point, your booking will proceed through the
            following stages: pending, confirmed, in progress, and completed, each of which is
            reflected on your Orders page. You agree to provide accurate service details and
            addresses so that the assigned professional may complete the requested service without
            delay.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            3. Cancellations and Refunds
          </h2>
          <p>
            You may request the cancellation of a booking directly from your Orders page. Refund
            eligibility, where applicable, is determined by how far in advance the cancellation is
            made relative to the scheduled service time; cancellations made closer to the scheduled
            appointment may be subject to reduced or no refund, in order to fairly compensate
            professionals who have reserved time for the engagement. Any refund approved will be
            processed back to the original payment method through Razorpay.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            4. Service Professionals
          </h2>
          <p>
            Professionals made available through the Platform are independent contractors and not
            employees, agents, or representatives of Dukaan Konnect. While we take reasonable steps
            to vet and onboard professionals prior to allowing them to accept bookings, Dukaan
            Konnect functions solely as a marketplace connecting customers with these independent
            providers, and does not itself perform the services booked through the Platform.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            5. User Conduct
          </h2>
          <p>
            You agree to use the Platform in a manner consistent with applicable law and these
            Terms, and not to misuse the Platform in any way that could harm Dukaan Konnect, its
            professionals, or other users. This includes, without limitation, providing false
            information at the time of booking, attempting to circumvent payments due through the
            Platform, or engaging in abusive conduct toward a professional or a member of our
            support team.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            6. Limitation of Liability
          </h2>
          <p>
            To the fullest extent permitted by applicable law, Dukaan Konnect shall not be liable
            for any indirect, incidental, or consequential damages arising out of your use of the
            Platform or the services performed by an independent professional. Our aggregate
            liability arising out of or relating to these Terms or your use of the Platform shall
            not exceed the amount paid by you for the specific booking giving rise to the claim.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            7. Changes to These Terms
          </h2>
          <p>
            We may revise these Terms from time to time to reflect changes in our services, legal
            requirements, or business practices. Where changes are material, we will take reasonable
            steps to notify users through the Platform. Your continued use of Dukaan Konnect
            following the posting of any changes constitutes your acceptance of the revised Terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            8. Contact Us
          </h2>
          <p>
            If you have any questions regarding these Terms, please contact us at{' '}
            <a
              href="mailto:support.dukaankonnect@gmail.com"
              className="text-blue-600 underline underline-offset-2"
            >
              support.dukaankonnect@gmail.com
            </a>
            . We take all such inquiries seriously and will endeavor to respond in a timely manner.
          </p>
        </section>
      </div>
    </Layout>
  );
}
