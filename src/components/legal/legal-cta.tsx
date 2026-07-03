import { Mail } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

/** Closing strip — questions about the document route to Contact, not a sales CTA. */
export function LegalCta() {
  return (
    <section className="border-t border-line bg-surface-soft py-14">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-700">
              <Mail className="size-4" />
            </span>
            <div>
              <p className="text-base font-semibold text-ink">Questions about this document?</p>
              <p className="mt-1 text-sm text-muted">
                Our support team can walk you through any clause above.
              </p>
            </div>
          </div>
          <Button href="/contact" variant="primary" size="md">
            Contact support
          </Button>
        </div>
      </Container>
    </section>
  );
}
