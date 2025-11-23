import { storage } from "./storage";
import { type InsertScheme } from "@shared/schema";

const LOCAL_SCHEMES: InsertScheme[] = [
  // CENTRAL GOVT - FARMERS
  {
    id: "pm-kisan",
    title: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
    category: "farmers",
    source: "Central",
    description: "₹6000 yearly income support to small & marginal farmers with direct bank transfer",
    fullDescription: "Financial assistance of ₹6000 per year in 3 installments of ₹2000 provided directly to the bank account of eligible farmers. This scheme supports small and marginal farmers across India.",
    eligibility: [
      "Farmer must own cultivable land",
      "Name must appear in PM-KISAN beneficiary list",
      "Institutional landholders NOT eligible",
      "Govt employees (except Group D) NOT eligible"
    ],
    benefits: [
      "₹6000/year in 3 installments of ₹2000",
      "Direct transfer to bank account"
    ],
    documentsRequired: [
      "Aadhaar",
      "Bank details",
      "Land ownership (7/12, or equivalent patta/khasra)"
    ],
    applyMode: "both",
    applyOnlineLink: "https://pmkisan.gov.in/",
    applyOfflineInfo: "Apply at CSC / Talathi / Agriculture office"
  },
  {
    id: "pm-fasal-bima",
    title: "PM Fasal Bima Yojana (PMFBY)",
    category: "farmers",
    source: "Central",
    description: "Crop insurance against damage due to rain, drought, flood, pests, hailstorm",
    fullDescription: "Comprehensive insurance scheme protecting farmers against crop losses due to natural calamities and unforeseen events. Premium is heavily subsidized by Central and State governments.",
    eligibility: [
      "Loanee farmers (compulsory)",
      "Non-loanee farmers (voluntary)",
      "Must be cultivating a notified crop"
    ],
    benefits: [
      "Premium very low: 2% for Kharif, 1.5% for Rabi, 5% for commercial crops",
      "Rest of premium paid by Central & State govt"
    ],
    documentsRequired: [
      "Aadhaar",
      "Bank account",
      "Crop sowing proof"
    ],
    applyMode: "both",
    applyOnlineLink: "https://pmfby.gov.in/",
    applyOfflineInfo: "Through banks / CSC / Agriculture office"
  },
  {
    id: "pm-krishi-sinchai",
    title: "PM Krishi Sinchai Yojana (PMKSY)",
    category: "farmers",
    source: "Central",
    description: "Irrigation facilities and micro-irrigation support (drip & sprinkler) with slogan 'Har Khet Ko Pani'",
    fullDescription: "Scheme to provide irrigation facilities and promote micro-irrigation techniques to improve agricultural productivity and sustainability.",
    eligibility: [
      "Any farmer with agricultural land",
      "Priority to dry / non-irrigated areas"
    ],
    benefits: [
      "Subsidy for micro-irrigation",
      "Support for irrigation infrastructure",
      "Water harvesting & watershed projects"
    ],
    documentsRequired: [
      "Aadhaar",
      "Land record",
      "Irrigation plan (if applicable)"
    ],
    applyMode: "offline",
    applyOfflineInfo: "Contact local Krishi office for application. Implementation through state agriculture departments"
  },
  {
    id: "nfsm",
    title: "National Food Security Mission (NFSM)",
    category: "farmers",
    source: "Central",
    description: "Increase production of rice, wheat, pulses, millet through improved farming techniques",
    fullDescription: "Central govt initiative to enhance food security through improved agricultural practices and technology adoption for target crops.",
    eligibility: [
      "Farmer cultivating NFSM-target crops"
    ],
    benefits: [
      "Subsidized seeds",
      "Soil & nutrient management support",
      "Training & demonstrations"
    ],
    documentsRequired: [
      "Aadhaar",
      "Land record",
      "Crop selection document"
    ],
    applyMode: "offline",
    applyOfflineInfo: "Via State Agriculture Department / local agriculture office"
  },
  {
    id: "rkvy",
    title: "Rashtriya Krishi Vikas Yojana (RKVY)",
    category: "farmers",
    source: "Central",
    description: "Financial support for agriculture innovation, yield improvement, and farming practices",
    fullDescription: "Central govt scheme providing financial support through state governments for promoting agricultural development and innovation.",
    eligibility: [
      "Farmers via state-approved projects",
      "Cooperatives",
      "FPOs"
    ],
    benefits: [
      "Funds for modern farming practices",
      "Support for startups in agriculture",
      "Training & development"
    ],
    documentsRequired: [
      "Depends on project / intervention"
    ],
    applyMode: "offline",
    applyOfflineInfo: "Apply through state agriculture department"
  },

  // MAHARASHTRA STATE - FARMERS
  {
    id: "state-agri-mech",
    title: "State Agricultural Mechanization Scheme",
    category: "farmers",
    district: "Maharashtra",
    source: "Maharashtra",
    description: "Subsidy for farm equipment — tractors, rotavators, seeders, harvesters",
    fullDescription: "Maharashtra govt scheme providing financial assistance for purchase of modern farm machinery to improve farming efficiency.",
    eligibility: [
      "Farmer of Maharashtra",
      "Must own farmland"
    ],
    benefits: [
      "50–70% subsidy on farm machinery",
      "Higher subsidy for SC/ST farmers"
    ],
    documentsRequired: [
      "Aadhaar",
      "7/12 land record",
      "Machinery quotation"
    ],
    applyMode: "online",
    applyOnlineLink: "https://mahadbt.maharashtra.gov.in/"
  },
  {
    id: "ihmd",
    title: "Integrated Horticulture Development Mission (IHMD)",
    category: "farmers",
    district: "Maharashtra",
    source: "Maharashtra",
    description: "Subsidy for fruit, vegetable, flower cultivation with poly-house support",
    fullDescription: "State scheme promoting horticulture sector through financial assistance and technical support for modern cultivation methods.",
    eligibility: [
      "Maharashtra farmers with suitable land"
    ],
    benefits: [
      "Subsidy for saplings",
      "Support for poly-houses",
      "Horticulture training"
    ],
    documentsRequired: [
      "Aadhaar",
      "7/12",
      "Crop proposal"
    ],
    applyMode: "online",
    applyOnlineLink: "https://mahadbt.maharashtra.gov.in/"
  },
  {
    id: "dryland-dev",
    title: "Dryland Area Development Program",
    category: "farmers",
    district: "Maharashtra",
    source: "Maharashtra",
    description: "Support for drought-prone areas with water conservation & soil improvement",
    fullDescription: "Programme to help farmers in water-scarce regions adopt sustainable farming practices and improve soil health.",
    eligibility: [
      "Land in dry/drought / rain-shadow district of Maharashtra"
    ],
    benefits: [
      "Soil moisture conservation",
      "Drought-resistant seeds",
      "Water storage support"
    ],
    documentsRequired: [
      "Aadhaar",
      "7/12",
      "Location verification"
    ],
    applyMode: "offline",
    applyOfflineInfo: "Through agriculture department"
  },
  {
    id: "dr-ambedkar-ag",
    title: "Dr. Babasaheb Ambedkar Agricultural Self-Reliance Scheme",
    category: "farmers",
    district: "Maharashtra",
    source: "Maharashtra",
    description: "Support SC farmers to start agriculture and become independent with financial assistance",
    fullDescription: "Special scheme for Scheduled Caste farmers providing comprehensive support including financial aid, tools, and training.",
    eligibility: [
      "Farmer must belong to Scheduled Caste"
    ],
    benefits: [
      "Financial assistance",
      "Tool/equipment subsidy",
      "Training support"
    ],
    documentsRequired: [
      "Aadhaar",
      "SC caste certificate",
      "7/12"
    ],
    applyMode: "online",
    applyOnlineLink: "https://mahadbt.maharashtra.gov.in/"
  },
  {
    id: "birsa-munda-tribal",
    title: "Birsa Munda Agricultural Revolution Scheme (for Tribal farmers)",
    category: "farmers",
    district: "Maharashtra",
    source: "Maharashtra",
    description: "Assist tribal farmers with farming tools, seeds, irrigation support",
    fullDescription: "Special agricultural support scheme for tribal farmers providing seeds, tools, and training.",
    eligibility: [
      "ST tribal farmers of Maharashtra"
    ],
    benefits: [
      "Subsidy for seeds & inputs",
      "Farm tools",
      "Training & awareness programs"
    ],
    documentsRequired: [
      "Aadhaar",
      "ST caste certificate",
      "7/12"
    ],
    applyMode: "offline",
    applyOfflineInfo: "Through Tribal Development Department (https://tribal.maharashtra.gov.in/)"
  },
  {
    id: "orchard-plantation",
    title: "Bhausaheb Fundkar Orchard Plantation Scheme",
    category: "farmers",
    district: "Maharashtra",
    source: "Maharashtra",
    description: "Support plantation of long-term fruit-bearing orchards (mango, citrus etc.)",
    fullDescription: "Scheme promoting fruit farming by providing financial support for orchard establishment and maintenance.",
    eligibility: [
      "Farmer with suitable land for orchard plantation"
    ],
    benefits: [
      "Subsidy for orchard plantation",
      "Maintenance support up to 3 years"
    ],
    documentsRequired: [
      "Aadhaar",
      "7/12",
      "Plantation plan"
    ],
    applyMode: "online",
    applyOnlineLink: "https://mahadbt.maharashtra.gov.in/"
  },
  {
    id: "cm-irrigation",
    title: "Chief Minister's Sustainable Agriculture Irrigation Scheme",
    category: "farmers",
    district: "Maharashtra",
    source: "Maharashtra",
    description: "Improve farm-level irrigation sustainability with subsidy for irrigation channels",
    fullDescription: "State scheme focused on creating sustainable irrigation infrastructure at farm level.",
    eligibility: [
      "Farmer with agricultural land",
      "Priority for drought-area farmers"
    ],
    benefits: [
      "Subsidy for creating irrigation channels",
      "Water harvesting structures"
    ],
    documentsRequired: [
      "Aadhaar",
      "7/12",
      "Water source details"
    ],
    applyMode: "offline",
    applyOfflineInfo: "Apply at Agriculture Department office"
  },
  {
    id: "gopinath-munde-disaster",
    title: "Gopinath Munde Farmers Disaster Compensation Grant Scheme",
    category: "farmers",
    district: "Maharashtra",
    source: "Maharashtra",
    description: "Compensation for farmers whose crops are damaged due to natural disasters",
    fullDescription: "Emergency relief scheme providing direct financial compensation to farmers affected by natural calamities.",
    eligibility: [
      "Farmers affected by flood, drought, hailstorm, cyclone etc."
    ],
    benefits: [
      "Direct financial compensation"
    ],
    documentsRequired: [
      "Aadhaar",
      "7/12",
      "Crop loss verification report"
    ],
    applyMode: "offline",
    applyOfflineInfo: "Assessment by Talathi / Patwari / Gram Sevak. Compensation credited directly to bank account"
  },

  // STUDENTS
  {
    id: "pm-yasasvi",
    title: "PM-YASASVI Scholarship (Young Achievers Scholarship Award Scheme)",
    category: "students",
    source: "Central",
    description: "Scholarship for OBC, EBC, DNT students for quality education in class 9–12",
    fullDescription: "Central govt scholarship scheme supporting meritorious students from economically weaker sections for secondary education.",
    eligibility: [
      "Student must belong to OBC / EBC / DNT",
      "Studying in Class 9–12",
      "Annual family income ≤ ₹2.5 lakh",
      "Student must be Indian citizen"
    ],
    benefits: [
      "₹75,000 – ₹1,25,000 per year depending on class & school type"
    ],
    documentsRequired: [
      "Aadhaar",
      "Income certificate",
      "Caste certificate",
      "School ID / enrollment"
    ],
    applyMode: "online",
    applyOnlineLink: "https://scholarships.gov.in/"
  },
  {
    id: "top-class-education",
    title: "Top Class Education Scheme (SC / ST / OBC)",
    category: "students",
    source: "Central",
    description: "Support for higher education — tuition + hostel + books + laptop",
    fullDescription: "Comprehensive scholarship scheme for higher education covering all major expenses including tuition, accommodation, and learning materials.",
    eligibility: [
      "Must be SC/ST/OBC",
      "Family income limit: SC/ST ≤ ₹8 lakh, OBC varies by category",
      "Admission to recognized institutions"
    ],
    benefits: [
      "Full tuition fee coverage",
      "Living allowance",
      "Books & laptop reimbursement"
    ],
    documentsRequired: [
      "Aadhaar",
      "Caste certificate",
      "Income certificate",
      "Admission letter"
    ],
    applyMode: "offline",
    applyOfflineInfo: "Contact the institution or nearest education ministry office"
  }
];

export async function seedLocalSchemes() {
  console.log("[Local Schemes] Starting to seed database...");
  
  for (const scheme of LOCAL_SCHEMES) {
    try {
      await storage.upsertScheme(scheme);
      console.log(`[Local Schemes] Seeded: ${scheme.title}`);
    } catch (error) {
      console.error(`[Local Schemes] Error seeding ${scheme.title}:`, error);
    }
  }
  
  console.log(`[Local Schemes] Completed! Total schemes: ${LOCAL_SCHEMES.length}`);
}
