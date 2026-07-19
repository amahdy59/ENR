/**
 * Booking-flow progress indicator. Thin wrapper over PageStepper that
 * defines the four canonical steps of the ticket booking journey with
 * localised labels. Use this instead of copy-pasting a stepper into
 * each booking route.
 */
import { PageStepper, type Step } from "./PageStepper";
import { useBi } from "@/i18n/bi";

type BookingStepIndex = 1 | 2 | 3 | 4;

export function BookingProgress({ current }: { current: BookingStepIndex }) {
  const bi = useBi();
  const labels = [
    { label: bi("Journey", "الرحلة"), sub: bi("Choose your journey", "اختر رحلتك") },
    { label: bi("Class", "الدرجة"), sub: bi("Select class & seat", "اختر الدرجة والمقعد") },
    { label: bi("Passenger Details", "بيانات الراكب"), sub: bi("Enter passenger info", "أدخل بيانات الراكب") },
    { label: bi("Payment", "الدفع"), sub: bi("Complete payment", "إتمام الدفع") },
  ];
  const steps: Step[] = labels.map((l, i) => ({
    ...l,
    state: i + 1 < current ? "done" : i + 1 === current ? "current" : "todo",
  }));
  const statusLabel = bi(
    `Step ${current} of 4 — ${labels[current - 1].label}`,
    `الخطوة ${["١","٢","٣","٤"][current - 1]} من ٤ — ${labels[current - 1].label}`,
  );
  return <PageStepper steps={steps} statusLabel={statusLabel} />;
}
