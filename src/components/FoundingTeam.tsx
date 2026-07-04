import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface FounderProps {
  name: string;
  role: string;
  institute: string;
  index: number;
}

function FounderCard({ name, role, institute, index }: FounderProps) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('');

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <Card className="text-center hover:shadow-lg transition-all">
        <CardContent className="pt-8 pb-6 px-6 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 shadow-md">
            <span className="text-2xl font-bold text-primary-foreground">
              {initials}
            </span>
          </div>
          <h3 className="text-lg font-semibold mb-1">{name}</h3>
          <Badge variant="secondary" className="mb-3">
            {role}
          </Badge>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <GraduationCap className="w-4 h-4" />
            <span>{institute}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function FoundingTeam() {
  return (
    <section className="py-12 md:py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-2xl mx-auto mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Meet the Founding Team
          </h2>
          <p className="text-muted-foreground">
            Built by students passionate about making home services simple and reliable.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <FounderCard
            name="Vivek Kumar Singh"
            role="Founder"
            institute="RGIPT"
            index={0}
          />
          <FounderCard
            name="Divyansh Singh"
            role="Co-Founder"
            institute="VIT Vellore"
            index={1}
          />
        </div>
      </div>
    </section>
  );
}
