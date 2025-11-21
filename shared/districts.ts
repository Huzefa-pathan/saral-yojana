export interface DistrictInfo {
  name: string;
  aliases: string[];
}

export const MAHARASHTRA_DISTRICTS: DistrictInfo[] = [
  { name: "Ahmednagar", aliases: ["ahmednagar", "ahmedabad", "nagar"] },
  { name: "Akola", aliases: ["akola"] },
  { name: "Amravati", aliases: ["amravati", "amraoti"] },
  { name: "Aurangabad", aliases: ["aurangabad"] },
  { name: "Beed", aliases: ["beed", "bid"] },
  { name: "Bhandara", aliases: ["bhandara"] },
  { name: "Buldhana", aliases: ["buldhana", "buldana"] },
  { name: "Chandrapur", aliases: ["chandrapur", "chanda"] },
  { name: "Dhule", aliases: ["dhule"] },
  { name: "Gadchiroli", aliases: ["gadchiroli"] },
  { name: "Gondia", aliases: ["gondia", "gondiya"] },
  { name: "Hingoli", aliases: ["hingoli"] },
  { name: "Jalgaon", aliases: ["jalgaon"] },
  { name: "Jalna", aliases: ["jalna"] },
  { name: "Kolhapur", aliases: ["kolhapur"] },
  { name: "Latur", aliases: ["latur"] },
  { name: "Mumbai City", aliases: ["mumbai city", "mumbai", "bombay"] },
  { name: "Mumbai Suburban", aliases: ["mumbai suburban", "greater mumbai"] },
  { name: "Nagpur", aliases: ["nagpur"] },
  { name: "Nanded", aliases: ["nanded"] },
  { name: "Nandurbar", aliases: ["nandurbar"] },
  { name: "Nashik", aliases: ["nashik", "nasik"] },
  { name: "Osmanabad", aliases: ["osmanabad"] },
  { name: "Palghar", aliases: ["palghar"] },
  { name: "Parbhani", aliases: ["parbhani"] },
  { name: "Pune", aliases: ["pune", "poona"] },
  { name: "Raigad", aliases: ["raigad", "raigadh"] },
  { name: "Ratnagiri", aliases: ["ratnagiri"] },
  { name: "Sangli", aliases: ["sangli"] },
  { name: "Satara", aliases: ["satara"] },
  { name: "Sindhudurg", aliases: ["sindhudurg"] },
  { name: "Solapur", aliases: ["solapur", "sholapur"] },
  { name: "Thane", aliases: ["thane"] },
  { name: "Wardha", aliases: ["wardha"] },
  { name: "Washim", aliases: ["washim"] },
  { name: "Yavatmal", aliases: ["yavatmal", "yevatmal"] }
];

export function detectDistrict(text: string): string | null {
  const lowerText = text.toLowerCase();
  
  for (const district of MAHARASHTRA_DISTRICTS) {
    for (const alias of district.aliases) {
      if (lowerText.includes(alias)) {
        return district.name;
      }
    }
  }
  
  return null;
}
