import { createFileRoute } from "@tanstack/react-router";
import { StubPage, Card, stubHead } from "@/components/site/StubPage";
import { useBi } from "@/i18n/bi";

export const Route = createFileRoute("/{-$locale}/tickets/discounts")({
  head: stubHead(
    "Discounts",
    "Student, senior, family and group discounts on ENR fares.",
    "/tickets/discounts",
    "التخفيضات",
    "تخفيضات للطلاب وكبار السن والعائلات والمجموعات على أسعار تذاكر الهيئة.",
  ),
  component: DiscountsPage,
});

function DiscountsPage() {
  const bi = useBi();
  const discounts = [
    { title: bi("Students", "الطلاب"), meta: bi("25% off", "خصم 25٪"), body: bi("Valid student ID required at booking and boarding.", "يُشترط وجود بطاقة طالب سارية عند الحجز والصعود.") },
    { title: bi("Seniors (60+)", "كبار السن (60+)"), meta: bi("30% off", "خصم 30٪"), body: bi("Available on all standard fares outside peak hours.", "متاح على جميع الأسعار العادية خارج ساعات الذروة.") },
    { title: bi("Children (4–11)", "الأطفال (4–11)"), meta: bi("50% off", "خصم 50٪"), body: bi("Under 4s travel free when not occupying a seat.", "الأطفال دون الرابعة يسافرون مجاناً إذا لم يشغلوا مقعداً.") },
    { title: bi("Persons with disabilities", "ذوو الهمم"), meta: bi("50% off", "خصم 50٪"), body: bi("Includes one free companion ticket.", "يشمل تذكرة مرافق مجانية واحدة.") },
    { title: bi("Groups of 10+", "المجموعات (10+)"), meta: bi("15% off", "خصم 15٪"), body: bi("Free group coordinator support and priority boarding.", "دعم مجاني من منسّق المجموعات وأولوية في الصعود.") },
    { title: bi("Military", "العسكريون"), meta: bi("30% off", "خصم 30٪"), body: bi("Valid service ID required.", "يُشترط وجود بطاقة خدمة سارية.") },
  ];
  return (
    <StubPage
      eyebrow={bi("Tickets", "التذاكر")}
      title={bi("Discounts & concessions", "التخفيضات والامتيازات")}
      subtitle={bi("Reduced fares for eligible passengers.", "أسعار مخفّضة للركاب المستحقّين.")}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {discounts.map((d) => <Card key={d.title} {...d} />)}
      </div>
    </StubPage>
  );
}
