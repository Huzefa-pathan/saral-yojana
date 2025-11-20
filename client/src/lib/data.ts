export interface Scheme {
  id: string;
  title: string;
  district?: string;
  category: string;
  source: "PIB" | "IndiaGov" | "MyGov" | "StateGov";
  publishDate: string;
  description: string;
  link: string;
  relevanceScore: number;
  tags: string[];
}

export interface Category {
  id: string;
  name: string;
  iconName: string; // Lucide icon name
  color: string;
  description: string;
}

export const CATEGORIES: Category[] = [
  {
    id: "farmers",
    name: "Farmers & Agriculture",
    iconName: "Tractor",
    color: "bg-green-100 text-green-700",
    description: "Crop insurance, subsidies, and farming support"
  },
  {
    id: "students",
    name: "Students & Education",
    iconName: "GraduationCap",
    color: "bg-blue-100 text-blue-700",
    description: "Scholarships, loans, and skill development"
  },
  {
    id: "women-child",
    name: "Women & Child",
    iconName: "Baby",
    color: "bg-pink-100 text-pink-700",
    description: "Maternity benefits, nutrition, and safety"
  },
  {
    id: "health",
    name: "Health & Wellness",
    iconName: "HeartPulse",
    color: "bg-red-100 text-red-700",
    description: "Insurance, hospitals, and medical aid"
  },
  {
    id: "housing",
    name: "Housing & Infra",
    iconName: "Home",
    color: "bg-orange-100 text-orange-700",
    description: "Rural housing, roads, and sanitation"
  },
  {
    id: "skill-dev",
    name: "Skill Development",
    iconName: "Wrench",
    color: "bg-purple-100 text-purple-700",
    description: "Vocational training and employment"
  },
  {
    id: "social-security",
    name: "Social Security",
    iconName: "ShieldCheck",
    color: "bg-teal-100 text-teal-700",
    description: "Pensions, insurance, and disability aid"
  },
  {
    id: "tribal",
    name: "Tribal Welfare",
    iconName: "Users",
    color: "bg-amber-100 text-amber-700",
    description: "Development schemes for tribal communities"
  }
];

export const DISTRICTS = [
  "Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara", "Buldhana", 
  "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna", 
  "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded", 
  "Nandurbar", "Nashik", "Osmanabad", "Palghar", "Parbhani", "Pune", "Raigad", 
  "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha", 
  "Washim", "Yavatmal"
];

export const MOCK_SCHEMES: Scheme[] = [
  {
    id: "1",
    title: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    category: "farmers",
    district: "All Districts",
    source: "IndiaGov",
    publishDate: "2025-02-18",
    description: "A flagship crop insurance scheme providing financial support to farmers suffering crop loss/damage arising out of unforeseen events. Covers all food & oilseed crops and annual commercial/horticultural crops.",
    link: "#",
    relevanceScore: 10,
    tags: ["insurance", "crop", "farmers"]
  },
  {
    id: "2",
    title: "Dr. Panjabrao Deshmukh Vasatigruh Nirvah Bhatta Yojna",
    category: "students",
    district: "Pune",
    source: "StateGov",
    publishDate: "2025-02-15",
    description: "Financial assistance for hostel maintenance allowance to children of registered laborers and farmers pursuing higher education in Maharashtra.",
    link: "#",
    relevanceScore: 9,
    tags: ["scholarship", "hostel", "education"]
  },
  {
    id: "3",
    title: "Majhi Kanya Bhagyashree Scheme",
    category: "women-child",
    district: "All Districts",
    source: "StateGov",
    publishDate: "2025-02-10",
    description: "An initiative to improve the girl child ratio and provide financial incentives to families for the education and health of girl children.",
    link: "#",
    relevanceScore: 8,
    tags: ["girl child", "women", "financial aid"]
  },
  {
    id: "4",
    title: "Mahatma Jyotirao Phule Shetkari Karjmukti Yojana",
    category: "farmers",
    district: "Nagpur",
    source: "PIB",
    publishDate: "2025-02-12",
    description: "Loan waiver scheme for farmers in Maharashtra. Eligible farmers will get a waiver of up to Rs. 2 lakhs on their crop loans.",
    link: "#",
    relevanceScore: 10,
    tags: ["loan waiver", "farmers", "debt relief"]
  },
  {
    id: "5",
    title: "Ramai Awas Yojana",
    category: "housing",
    district: "All Districts",
    source: "StateGov",
    publishDate: "2025-01-28",
    description: "Housing scheme for SC/ST families in rural areas of Maharashtra to provide pukka houses to homeless families.",
    link: "#",
    relevanceScore: 7,
    tags: ["housing", "rural", "sc/st"]
  },
  {
    id: "6",
    title: "Chief Minister's Employment Generation Programme (CMEGP)",
    category: "skill-dev",
    district: "Mumbai City",
    source: "MyGov",
    publishDate: "2025-02-05",
    description: "Credit-linked subsidy programme to generate employment opportunities in rural and urban areas of Maharashtra through setting up of new self-employment ventures.",
    link: "#",
    relevanceScore: 6,
    tags: ["employment", "business", "subsidy"]
  }
];
