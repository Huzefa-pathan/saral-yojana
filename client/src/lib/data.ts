export interface Scheme {
  id: string;
  title: string;
  districtDetected?: string | null;
  categoryDetected: string | null;
  source: "PIB" | "IndiaGov" | "MyGov" | "StateGov";
  publishedDate: string | null;
  description: string;
  link: string;
  relevanceScore: number;
  fetchedAt: string;
}

export interface Category {
  id: string;
  name: string;
  iconName: string;
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
