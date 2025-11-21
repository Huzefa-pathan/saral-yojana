import { storage } from "./storage";
import { type InsertScheme } from "@shared/schema";

const SEED_SCHEMES: InsertScheme[] = [
  {
    id: "pm-kisan-maharashtra",
    title: "PM-KISAN Yojana - Direct Benefit Transfer for Farmers",
    description: "Financial assistance of Rs.6000 per year to all landholding farmers' families in Maharashtra under PM-KISAN scheme. The amount is transferred directly to bank accounts in three equal installments of Rs.2000 each every four months. Eligible farmers can register through Common Service Centers or online portal.",
    link: "https://pmkisan.gov.in",
    publishedDate: new Date("2025-01-15"),
    source: "PIB",
    relevanceScore: 10,
    districtDetected: "Pune",
    categoryDetected: "farmers"
  },
  {
    id: "mahatma-jyotiba-phule-scholarship",
    title: "Mahatma Jyotiba Phule Jan Arogya Yojana - Health Insurance",
    description: "Free health insurance scheme for economically weaker sections of Maharashtra. Covers hospitalization expenses up to Rs.1.50 lakh per family per year. Includes cashless treatment at empaneled hospitals across the state. No premium payment required from beneficiaries.",
    link: "https://www.jeevandayee.gov.in",
    publishedDate: new Date("2025-02-10"),
    source: "IndiaGov",
    relevanceScore: 9,
    districtDetected: "Mumbai City",
    categoryDetected: "health"
  },
  {
    id: "pradhan-mantri-awas-yojana-mh",
    title: "Pradhan Mantri Awas Yojana (Gramin) - Rural Housing Scheme",
    description: "Housing assistance for rural families in Maharashtra who are homeless or living in kutcha houses. Financial assistance of Rs.1.20 lakh provided for construction of pucca house with basic amenities like toilet, electricity, LPG connection. Priority given to SC/ST, minorities, and women-headed households.",
    link: "https://pmayg.nic.in",
    publishedDate: new Date("2025-01-28"),
    source: "MyGov",
    relevanceScore: 8,
    districtDetected: "Nashik",
    categoryDetected: "housing"
  },
  {
    id: "skill-india-mh-youth",
    title: "Skill India Mission - Vocational Training for Maharashtra Youth",
    description: "Free skill development training program for youth aged 18-35 years in Maharashtra. Offers courses in IT, hospitality, retail, construction, healthcare, and agriculture sectors. Certificate provided on completion. Placement assistance available through NSDC partner training centers.",
    link: "https://www.skillindia.gov.in",
    publishedDate: new Date("2025-02-05"),
    source: "PIB",
    relevanceScore: 8,
    districtDetected: "Nagpur",
    categoryDetected: "skill-dev"
  },
  {
    id: "msk-scholarship-students",
    title: "Maharashtra State Scholarship for SC/ST Students",
    description: "Post-matric scholarship for SC/ST students studying in Maharashtra. Covers tuition fees, maintenance allowance, and other educational expenses. Available for students from Class 11 onwards including undergraduate and postgraduate courses. Annual renewal based on academic performance.",
    link: "https://mahadbt.maharashtra.gov.in",
    publishedDate: new Date("2025-01-20"),
    source: "IndiaGov",
    relevanceScore: 9,
    districtDetected: null,
    categoryDetected: "students"
  },
  {
    id: "majhi-kanya-bhagyashree-yojana",
    title: "Majhi Kanya Bhagyashree Yojana - Girl Child Welfare",
    description: "Financial assistance scheme for families with girl children in Maharashtra. Provides Rs.50,000 on birth of first girl child and Rs.1 lakh for second girl child. Additional education support of Rs.25,000 when girl completes SSC. Encourages family planning and girl child education.",
    link: "https://womenchild.maharashtra.gov.in",
    publishedDate: new Date("2025-02-12"),
    source: "MyGov",
    relevanceScore: 9,
    districtDetected: "Solapur",
    categoryDetected: "women-child"
  },
  {
    id: "atal-pension-yojana-mh",
    title: "Atal Pension Yojana - Social Security for Unorganized Workers",
    description: "Pension scheme for unorganized sector workers in Maharashtra aged 18-40 years. Guaranteed monthly pension of Rs.1000 to Rs.5000 after age 60 based on contribution. Government co-contributes 50% of premium for eligible beneficiaries. Managed by PFRDA with nomination facility.",
    link: "https://npscra.nsdl.co.in/atal-pension-yojana",
    publishedDate: new Date("2025-01-18"),
    source: "PIB",
    relevanceScore: 7,
    districtDetected: null,
    categoryDetected: "social-security"
  },
  {
    id: "crop-insurance-pradhan-mantri",
    title: "Pradhan Mantri Fasal Bima Yojana - Crop Insurance for Farmers",
    description: "Comprehensive crop insurance scheme for farmers in Maharashtra. Covers losses due to drought, flood, pest attack, natural calamities. Premium subsidy provided by government. Claims settled within 60 days. Voluntary for non-loanee farmers and mandatory for crop loan beneficiaries.",
    link: "https://pmfby.gov.in",
    publishedDate: new Date("2025-02-08"),
    source: "PIB",
    relevanceScore: 10,
    districtDetected: "Ahmednagar",
    categoryDetected: "farmers"
  },
  {
    id: "tribal-development-eklavya",
    title: "Eklavya Model Residential Schools - Tribal Education",
    description: "Quality education for tribal children in Maharashtra through residential schools. Free education, boarding, lodging, and uniforms provided. Focus on preserving tribal culture while providing modern education. Sports and extracurricular activities included. Located in tribal-majority districts.",
    link: "https://tribal.nic.in",
    publishedDate: new Date("2025-01-25"),
    source: "IndiaGov",
    relevanceScore: 8,
    districtDetected: "Gadchiroli",
    categoryDetected: "tribal"
  },
  {
    id: "swachh-bharat-rural-toilet",
    title: "Swachh Bharat Mission - Individual Household Toilet Construction",
    description: "Financial assistance for construction of individual household toilets in rural Maharashtra. Rs.12,000 incentive per household for toilet construction. Technical support and awareness programs provided. Part of Swachh Bharat Abhiyan to achieve Open Defecation Free (ODF) status.",
    link: "https://swachhbharatmission.gov.in",
    publishedDate: new Date("2025-02-03"),
    source: "MyGov",
    relevanceScore: 7,
    districtDetected: "Satara",
    categoryDetected: "housing"
  },
  {
    id: "ayushman-bharat-pmjay",
    title: "Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana",
    description: "World's largest health insurance scheme covering over 10 crore poor families. Provides health coverage of Rs.5 lakh per family per year for secondary and tertiary care hospitalization. Cashless treatment at empaneled hospitals across Maharashtra. E-cards issued to beneficiaries.",
    link: "https://pmjay.gov.in",
    publishedDate: new Date("2025-01-30"),
    source: "IndiaGov",
    relevanceScore: 10,
    districtDetected: "Thane",
    categoryDetected: "health"
  },
  {
    id: "kisan-credit-card-mh",
    title: "Kisan Credit Card - Agricultural Credit at Subsidized Rates",
    description: "Credit facility for farmers in Maharashtra to meet short-term crop production needs. Interest subvention of 2% provided. Additional 3% incentive on prompt repayment. Covers agricultural expenses including seeds, fertilizers, pesticides, and labor. Valid for 5 years with annual review.",
    link: "https://www.nabard.org/kcc.aspx",
    publishedDate: new Date("2025-02-14"),
    source: "PIB",
    relevanceScore: 9,
    districtDetected: "Latur",
    categoryDetected: "farmers"
  },
  {
    id: "student-laptop-scheme-mh",
    title: "Digital Maharashtra - Free Laptop Distribution for Students",
    description: "Free laptop distribution to meritorious students from economically weaker sections in Maharashtra. Available for students scoring above 75% in SSC or HSC exams. One-time benefit per student. Pre-loaded with educational software and e-learning content. Registration through school authorities.",
    link: "https://digitalsevakendra.maharashtra.gov.in",
    publishedDate: new Date("2025-01-22"),
    source: "MyGov",
    relevanceScore: 8,
    districtDetected: "Aurangabad",
    categoryDetected: "students"
  },
  {
    id: "widow-pension-scheme-mh",
    title: "Sanjay Gandhi Niradhar Yojana - Widow Pension Scheme",
    description: "Monthly financial assistance for widows in Maharashtra. Rs.600 per month for widows aged 18-65 years. Additional benefits for disabled widows. Direct Benefit Transfer to bank accounts. Income ceiling of Rs.21,000 per annum. Aadhaar-based authentication for disbursement.",
    link: "https://sjsa.maharashtra.gov.in",
    publishedDate: new Date("2025-02-06"),
    source: "IndiaGov",
    relevanceScore: 8,
    districtDetected: null,
    categoryDetected: "social-security"
  },
  {
    id: "maternity-benefit-janani-suraksha",
    title: "Janani Suraksha Yojana - Safe Motherhood Scheme",
    description: "Cash assistance to pregnant women in Maharashtra for institutional delivery. Rs.1400 for rural areas and Rs.1000 for urban areas. Free delivery services and postnatal care at government hospitals. Promotes institutional delivery to reduce maternal and infant mortality. ASHA workers facilitate registration.",
    link: "https://nhm.gov.in/jsy",
    publishedDate: new Date("2025-01-27"),
    source: "PIB",
    relevanceScore: 9,
    districtDetected: "Kolhapur",
    categoryDetected: "women-child"
  }
];

export async function seedDatabase() {
  console.log("[Seed] Starting database seeding...");
  
  for (const scheme of SEED_SCHEMES) {
    try {
      await storage.upsertScheme(scheme);
      console.log(`[Seed] Upserted: ${scheme.title}`);
    } catch (error) {
      console.error(`[Seed] Error upserting ${scheme.title}:`, error);
    }
  }
  
  console.log("[Seed] Database seeding completed!");
}
