import { Layout } from '@/components/Layout';
import { Mail, Phone, Clock } from 'lucide-react';

export default function Contact() {
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
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Contact Us</h1>
          <p className="text-muted-foreground">
            We'd love to hear from you. Reach out any time.
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-3xl px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <a
            href="mailto:support.dukaankonnect@gmail.com"
            className="flex flex-col items-center text-center gap-3 rounded-xl border p-6 hover:border-blue-400 hover:bg-blue-50/50 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium">Email</p>
              <p className="text-sm text-muted-foreground break-all">
                support.dukaankonnect@gmail.com
              </p>
            </div>
          </a>

          <a
            href="tel:+919115224050"
            className="flex flex-col items-center text-center gap-3 rounded-xl border p-6 hover:border-blue-400 hover:bg-blue-50/50 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium">Phone</p>
              <p className="text-sm text-muted-foreground">+91 9115224050</p>
            </div>
          </a>

          <div className="flex flex-col items-center text-center gap-3 rounded-xl border p-6">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium">Availability</p>
              <p className="text-sm text-muted-foreground">24/7 support</p>
            </div>
          </div>
        </div>

        <p className="mt-10 text-center text-sm text-muted-foreground">
          For questions about an existing booking, please check your{' '}
          <a href="/orders" className="text-blue-600 underline underline-offset-2">
            Orders page
          </a>{' '}
          first — our support team can help with anything else.
        </p>
      </div>
    </Layout>
  );
}
