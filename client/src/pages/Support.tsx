import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ReviewSystem } from "@/components/ReviewSystem";

const SUPPORT_SECTIONS = [
  {
    title: "General Support",
    entries: [
      { label: "Citizen Services", value: "1800-120-8040" },
    ],
  },
  {
    title: "Women & Child Development",
    entries: [
      { label: "Women Helpline", value: "181" },
      { label: "Child Helpline", value: "1098" },
    ],
  },
  {
    title: "Agriculture & Farmers",
    entries: [
      { label: "Maha Krushi Seva", value: "1800-120-112-111" },
      { label: "Kisan Call Center", value: "1800-180-1551" },
    ],
  },
  {
    title: "Health Services",
    entries: [
      { label: "Health Helpline", value: "104" },
      { label: "Ambulance", value: "108" },
    ],
  },
  {
    title: "Social Justice",
    entries: [
      { label: "Senior Citizen Support", value: "1090" },
      { label: "Disability Support", value: "1800-221-123" },
    ],
  },
  {
    title: "Labour & Employment",
    entries: [
      { label: "Labour Helpline", value: "1800-121-3488" },
    ],
  },
  {
    title: "Food & Civil Supplies",
    entries: [
      { label: "Ration Card Helpline", value: "1800-22-4950" },
    ],
  },
];

export default function Support() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-12">
          <header className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-gray-900">Support Helplines</h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Here are the verified Government of Maharashtra helpline numbers below.
            </p>
          </header>

          <section className="space-y-8">
            {SUPPORT_SECTIONS.map((section) => (
              <div key={section.title} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">{section.title}</h2>
                <ul className="space-y-3">
                  {section.entries.map((entry) => (
                    <li key={entry.label} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-6">
                      <span className="text-gray-700 font-medium">{entry.label}</span>
                      <span className="text-xl font-semibold text-primary tracking-wide">{entry.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          <ReviewSystem />
        </div>
      </main>

      <Footer />
    </div>
  );
}
