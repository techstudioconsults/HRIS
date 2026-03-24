import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@workspace/ui/components/accordion';

export default function Page() {
  return (
    <main className="min-h-screen bg-white px-6 py-16 text-gray-900">
      <section className="mx-auto w-full max-w-2xl">
        <h1 className="mb-6 text-3xl font-semibold tracking-tight">HRIS FAQs</h1>
        <Accordion type="single" collapsible className="w-full rounded-xl border border-gray-200 px-5">
          <AccordionItem value="item-1">
            <AccordionTrigger>How do I request leave?</AccordionTrigger>
            <AccordionContent>
              Go to Leave, choose dates, select leave type, and submit your request for approval.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Can I edit my profile details?</AccordionTrigger>
            <AccordionContent>Yes. Open your profile settings, update your details, and click save.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Where can I see my payslips?</AccordionTrigger>
            <AccordionContent>
              You can find all issued payslips in the Payroll section under Payslip History.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </main>
  );
}
