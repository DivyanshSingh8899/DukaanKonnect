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
          <p className="text-muted-foreground">Effective Date: July 2026</p>
        </div>
      </div>

      <div className="container mx-auto max-w-3xl px-4 py-12 space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section>
          <p>
            Dukaan Konnect (&ldquo;Dukaan Konnect,&rdquo; &ldquo;the Company,&rdquo; &ldquo;we,&rdquo;
            &ldquo;us,&rdquo; or &ldquo;our&rdquo;) is a technology platform that connects customers
            seeking home services with independent, verified service professionals. We understand
            that trust is fundamental to the relationship we share with our customers and
            professionals, and we are committed to handling personal information responsibly,
            transparently, and in accordance with applicable law. This Privacy Policy explains how
            we collect, use, disclose, and safeguard information when you access or use our website,
            mobile application, and related services (collectively, the &ldquo;Platform&rdquo;). By
            creating an account or otherwise using the Platform, you acknowledge that you have read
            and understood the practices described in this Policy.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            1. Information We Collect
          </h2>
          <p>
            In the course of providing our services, Dukaan Konnect collects information that you
            provide to us directly, including your full name, email address, phone number, and the
            service addresses you save to your account. When you make a booking, we collect details
            relevant to the service requested, including the category of service, preferred
            scheduling, and any notes you provide to assist the professional. Where you elect to make
            a payment through the Platform, payment processing is handled by our payment partner,
            Razorpay, which collects and processes your payment card or banking details directly; at
            no point does Dukaan Konnect store your complete card number or banking credentials on
            its own systems. Should you choose to communicate with our support team through the
            in-app chat, we retain a record of that correspondence in order to assist you and to
            improve the quality of our support. We may also collect limited technical information,
            such as device and browser characteristics, for the purpose of maintaining the security
            and reliability of the Platform.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            2. How We Use Your Information
          </h2>
          <p>
            The information we collect is used for the purpose of operating, maintaining, and
            improving the Platform. This includes creating and authenticating your account,
            processing and fulfilling bookings, facilitating secure payments, and connecting you
            with an appropriately qualified professional in your area. We use your contact details to
            send booking confirmations, status updates, and, where necessary, important notices
            regarding your account or transactions. Information you share with our support team is
            used to resolve your inquiries and, in aggregate and de-identified form, to help us
            understand how our services can be improved. We do not use your personal information for
            any purpose that is incompatible with the purposes described in this Policy without first
            obtaining your consent.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            3. Disclosure and Sharing of Information
          </h2>
          <p>
            Dukaan Konnect discloses personal information only to the extent necessary to provide the
            services you have requested. When you confirm a booking, we share the minimum information
            required to complete the service — typically your name, service address, and contact
            number — with the professional assigned to that booking. Payment-related information is
            shared with Razorpay solely for the purpose of processing your transaction, in accordance
            with Razorpay&rsquo;s own privacy and security practices. We may also disclose information
            where required to do so by law, regulation, or a valid legal process, or where necessary
            to protect the rights, property, or safety of Dukaan Konnect, our users, or the public.
            Dukaan Konnect does not sell, rent, or trade your personal information to third parties
            for their own marketing purposes.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            4. Data Security
          </h2>
          <p>
            We employ administrative, technical, and physical safeguards designed to protect your
            personal information against unauthorized access, alteration, disclosure, or destruction.
            All data transmitted between your device and our servers is encrypted in transit, and
            access to your account is protected by one-time verification codes rather than static
            passwords, reducing the risk associated with credential theft. While we take these
            precautions seriously, no method of electronic transmission or storage is entirely
            immune to risk, and we encourage users to safeguard their own account access accordingly.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            5. Data Retention
          </h2>
          <p>
            We retain personal information for as long as your account remains active or as
            reasonably necessary to provide you with the Platform&rsquo;s services, comply with our
            legal and regulatory obligations, resolve disputes, and enforce our agreements. Where
            information is no longer required for these purposes, we take reasonable steps to
            delete or anonymize it.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            6. Your Rights and Choices
          </h2>
          <p>
            You retain control over much of the information you provide to us. You may review and
            update your saved addresses and profile details at any time through your Profile page,
            and you may discontinue use of the Platform at your discretion. Should you wish to
            request access to, correction of, or deletion of your personal information beyond what
            is available to you directly within the Platform, you may contact us using the details
            provided below, and we will respond to your request in accordance with applicable law.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            7. Children&rsquo;s Privacy
          </h2>
          <p>
            The Platform is intended for use by individuals who are at least eighteen years of age
            or who otherwise have the legal capacity to enter into a binding agreement. We do not
            knowingly collect personal information from children, and if we become aware that we
            have inadvertently done so, we will take reasonable steps to delete such information.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            8. Changes to This Policy
          </h2>
          <p>
            We may revise this Privacy Policy from time to time to reflect changes in our practices,
            technology, legal requirements, or other factors. Where changes are material, we will
            take reasonable steps to notify users through the Platform. Your continued use of Dukaan
            Konnect following the posting of any changes constitutes your acceptance of the revised
            Policy.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            9. Contact Us
          </h2>
          <p>
            If you have any questions, concerns, or requests regarding this Privacy Policy or our
            handling of your personal information, please contact us at{' '}
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
