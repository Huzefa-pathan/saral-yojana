import { storage } from "./storage";

interface SchemeData {
  id: string;
  title: string;
  category: string;
  district?: string | null;
  source: string;
  description: string;
  fullDescription?: string | null;
  applyMode: string;
  applyOnlineLink?: string | null;
  applyOfflineInfo?: string | null;
  eligibility: string[];
  benefits: string[];
  documents: string[];
}

const ALL_SCHEMES: SchemeData[] = [
  // CENTRAL GOVT - FARMERS
  {
    id: "pm-kisan",
    title: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
    category: "farmers",
    source: "central",
    description: "₹6000 yearly income support to small & marginal farmers with direct bank transfer",
    fullDescription: "Financial assistance of ₹6000 per year in 3 installments of ₹2000 provided directly to the bank account of eligible farmers.",
    eligibility: ["Farmer must own cultivable land", "Name must appear in PM-KISAN beneficiary list", "Institutional landholders NOT eligible", "Govt employees (except Group D) NOT eligible"],
    benefits: ["₹6000/year in 3 installments of ₹2000", "Direct transfer to bank account"],
    documents: ["Aadhaar", "Bank details", "Land ownership (7/12, or equivalent patta/khasra)"],
    applyMode: "both",
    applyOnlineLink: "https://pmkisan.gov.in/",
    applyOfflineInfo: "Apply at CSC / Talathi / Agriculture office"
  },
  {
    id: "pm-fasal-bima",
    title: "PM Fasal Bima Yojana (PMFBY)",
    category: "farmers",
    source: "central",
    description: "Crop insurance against damage due to rain, drought, flood, pests, hailstorm",
    fullDescription: "Comprehensive insurance scheme protecting farmers against crop losses due to natural calamities.",
    eligibility: ["Loanee farmers (compulsory)", "Non-loanee farmers (voluntary)", "Must be cultivating a notified crop"],
    benefits: ["Premium very low: 2% for Kharif, 1.5% for Rabi, 5% for commercial crops", "Rest paid by Central & State govt"],
    documents: ["Aadhaar", "Bank account", "Crop sowing proof"],
    applyMode: "both",
    applyOnlineLink: "https://pmfby.gov.in/",
    applyOfflineInfo: "Through banks / CSC / Agriculture office"
  },
  {
    id: "pm-krishi-sinchai",
    title: "PM Krishi Sinchai Yojana (PMKSY)",
    category: "farmers",
    source: "central",
    description: "Irrigation facilities and micro-irrigation support (drip & sprinkler)",
    fullDescription: "Scheme to provide irrigation facilities and promote micro-irrigation techniques.",
    eligibility: ["Any farmer with agricultural land", "Priority to dry / non-irrigated areas"],
    benefits: ["Subsidy for micro-irrigation", "Support for irrigation infrastructure", "Water harvesting & watershed projects"],
    documents: ["Aadhaar", "Land record", "Irrigation plan (if applicable)"],
    applyMode: "offline",
    applyOfflineInfo: "Contact local Krishi office for application"
  },
  {
    id: "nfsm",
    title: "National Food Security Mission (NFSM)",
    category: "farmers",
    source: "central",
    description: "Increase production of rice, wheat, pulses, millet through improved farming techniques",
    fullDescription: "Central govt initiative to enhance food security through improved agricultural practices.",
    eligibility: ["Farmer cultivating NFSM-target crops"],
    benefits: ["Subsidized seeds", "Soil & nutrient management support", "Training & demonstrations"],
    documents: ["Aadhaar", "Land record", "Crop selection document"],
    applyMode: "offline",
    applyOfflineInfo: "Via State Agriculture Department / local agriculture office"
  },
  {
    id: "rkvy",
    title: "Rashtriya Krishi Vikas Yojana (RKVY)",
    category: "farmers",
    source: "central",
    description: "Financial support for agriculture innovation, yield improvement, and farming practices",
    fullDescription: "Central govt scheme providing financial support for promoting agricultural development.",
    eligibility: ["Farmers via state-approved projects", "Cooperatives", "FPOs"],
    benefits: ["Funds for modern farming practices", "Support for startups in agriculture", "Training & development"],
    documents: ["Depends on project / intervention"],
    applyMode: "offline",
    applyOfflineInfo: "Apply through state agriculture department"
  },

  // MAHARASHTRA - FARMERS
  {
    id: "state-agri-mech",
    title: "State Agricultural Mechanization Scheme",
    category: "farmers",
    district: "Maharashtra",
    source: "state",
    description: "Subsidy for farm equipment — tractors, rotavators, seeders, harvesters",
    fullDescription: "Maharashtra govt scheme providing financial assistance for purchase of modern farm machinery.",
    eligibility: ["Farmer of Maharashtra", "Must own farmland"],
    benefits: ["50–70% subsidy on farm machinery", "Higher subsidy for SC/ST farmers"],
    documents: ["Aadhaar", "7/12 land record", "Machinery quotation"],
    applyMode: "online",
    applyOnlineLink: "https://mahadbt.maharashtra.gov.in/"
  },
  {
    id: "ihmd",
    title: "Integrated Horticulture Development Mission (IHMD)",
    category: "farmers",
    district: "Maharashtra",
    source: "state",
    description: "Subsidy for fruit, vegetable, flower cultivation with poly-house support",
    fullDescription: "State scheme promoting horticulture sector through financial assistance.",
    eligibility: ["Maharashtra farmers with suitable land"],
    benefits: ["Subsidy for saplings", "Support for poly-houses", "Horticulture training"],
    documents: ["Aadhaar", "7/12", "Crop proposal"],
    applyMode: "online",
    applyOnlineLink: "https://mahadbt.maharashtra.gov.in/"
  },
  {
    id: "dryland-dev",
    title: "Dryland Area Development Program",
    category: "farmers",
    district: "Maharashtra",
    source: "state",
    description: "Support for drought-prone areas with water conservation & soil improvement",
    fullDescription: "Programme to help farmers in water-scarce regions adopt sustainable farming practices.",
    eligibility: ["Land in dry/drought / rain-shadow district of Maharashtra"],
    benefits: ["Soil moisture conservation", "Drought-resistant seeds", "Water storage support"],
    documents: ["Aadhaar", "7/12", "Location verification"],
    applyMode: "offline",
    applyOfflineInfo: "Through agriculture department"
  },
  {
    id: "dr-ambedkar-ag",
    title: "Dr. Babasaheb Ambedkar Agricultural Self-Reliance Scheme",
    category: "farmers",
    district: "Maharashtra",
    source: "state",
    description: "Support SC farmers to start agriculture and become independent",
    fullDescription: "Special scheme for Scheduled Caste farmers providing comprehensive support.",
    eligibility: ["Farmer must belong to Scheduled Caste"],
    benefits: ["Financial assistance", "Tool/equipment subsidy", "Training support"],
    documents: ["Aadhaar", "SC caste certificate", "7/12"],
    applyMode: "online",
    applyOnlineLink: "https://mahadbt.maharashtra.gov.in/"
  },
  {
    id: "birsa-munda-tribal",
    title: "Birsa Munda Agricultural Revolution Scheme (for Tribal farmers)",
    category: "farmers",
    district: "Maharashtra",
    source: "state",
    description: "Assist tribal farmers with farming tools, seeds, irrigation support",
    fullDescription: "Special agricultural support scheme for tribal farmers.",
    eligibility: ["ST tribal farmers of Maharashtra"],
    benefits: ["Subsidy for seeds & inputs", "Farm tools", "Training & awareness programs"],
    documents: ["Aadhaar", "ST caste certificate", "7/12"],
    applyMode: "offline",
    applyOfflineInfo: "Through Tribal Development Department"
  },
  {
    id: "orchard-plantation",
    title: "Bhausaheb Fundkar Orchard Plantation Scheme",
    category: "farmers",
    district: "Maharashtra",
    source: "state",
    description: "Support plantation of long-term fruit-bearing orchards (mango, citrus etc.)",
    fullDescription: "Scheme promoting fruit farming by providing financial support.",
    eligibility: ["Farmer with suitable land for orchard plantation"],
    benefits: ["Subsidy for orchard plantation", "Maintenance support up to 3 years"],
    documents: ["Aadhaar", "7/12", "Plantation plan"],
    applyMode: "online",
    applyOnlineLink: "https://mahadbt.maharashtra.gov.in/"
  },
  {
    id: "cm-irrigation",
    title: "Chief Minister's Sustainable Agriculture Irrigation Scheme",
    category: "farmers",
    district: "Maharashtra",
    source: "state",
    description: "Improve farm-level irrigation sustainability with subsidy for irrigation channels",
    fullDescription: "State scheme focused on creating sustainable irrigation infrastructure.",
    eligibility: ["Farmer with agricultural land", "Priority for drought-area farmers"],
    benefits: ["Subsidy for creating irrigation channels", "Water harvesting structures"],
    documents: ["Aadhaar", "7/12", "Water source details"],
    applyMode: "offline",
    applyOfflineInfo: "Apply at Agriculture Department office"
  },
  {
    id: "gopinath-munde-disaster",
    title: "Gopinath Munde Farmers Disaster Compensation Grant Scheme",
    category: "farmers",
    district: "Maharashtra",
    source: "state",
    description: "Compensation for farmers whose crops are damaged due to natural disasters",
    fullDescription: "Emergency relief scheme providing direct financial compensation to farmers.",
    eligibility: ["Farmers affected by flood, drought, hailstorm, cyclone etc."],
    benefits: ["Direct financial compensation"],
    documents: ["Aadhaar", "7/12", "Crop loss verification report"],
    applyMode: "offline",
    applyOfflineInfo: "Assessment by Talathi / Patwari / Gram Sevak"
  },

  // STUDENTS - CENTRAL
  {
    id: "pm-yasasvi",
    title: "PM-YASASVI Scholarship (Young Achievers Scholarship Award Scheme)",
    category: "students",
    source: "central",
    description: "Scholarship for OBC, EBC, DNT students for quality education in class 9–12",
    fullDescription: "Central govt scholarship scheme supporting meritorious students from economically weaker sections.",
    eligibility: ["Student must belong to OBC / EBC / DNT", "Studying in Class 9–12", "Annual family income ≤ ₹2.5 lakh", "Student must be Indian citizen"],
    benefits: ["₹75,000 – ₹1,25,000 per year depending on class & school type"],
    documents: ["Aadhaar", "Income certificate", "Caste certificate", "School ID / enrollment"],
    applyMode: "online",
    applyOnlineLink: "https://scholarships.gov.in/"
  },
  {
    id: "top-class-education",
    title: "Top Class Education Scheme (SC / ST / OBC)",
    category: "students",
    source: "central",
    description: "Support for higher education — tuition + hostel + books + laptop",
    fullDescription: "Comprehensive scholarship scheme for higher education covering major expenses.",
    eligibility: ["Must be SC/ST/OBC", "Family income limit: SC/ST ≤ ₹8 lakh, OBC varies", "Admission to recognized institutions"],
    benefits: ["Full tuition fee coverage", "Living allowance", "Books & laptop reimbursement"],
    documents: ["Aadhaar", "Caste certificate", "Income certificate", "Admission letter"],
    applyMode: "online",
    applyOnlineLink: "https://scholarships.gov.in/"
  },
  {
    id: "merit-cum-means",
    title: "Merit-cum-Means Scholarship (for technical & professional degrees)",
    category: "students",
    source: "central",
    description: "Financial assistance for students pursuing professional courses",
    fullDescription: "Scholarship based on merit and family income for professional education.",
    eligibility: ["Based on merit + family income", "Annual income ≤ ₹2.5–₹8 lakh", "Student enrolled in professional courses"],
    benefits: ["Maintenance allowance", "Tuition fee support"],
    documents: ["Aadhaar", "Income certificate", "Course admission proof"],
    applyMode: "online",
    applyOnlineLink: "https://scholarships.gov.in/"
  },
  {
    id: "inspire-scholarship",
    title: "INSPIRE Scholarship (Innovation in Science Pursuit)",
    category: "students",
    source: "central",
    description: "Encourage students to pursue science and research careers",
    fullDescription: "Scholarship for top science students pursuing BSc, MSc, or research.",
    eligibility: ["Top 1% in 12th board OR Rank in JEE / NEET", "Pursuing BSc / MSc / Research"],
    benefits: ["₹80,000/year"],
    documents: ["Aadhaar", "Marksheet", "Admission letter"],
    applyMode: "online",
    applyOnlineLink: "https://online-inspire.gov.in/"
  },
  {
    id: "aicte-scholarships",
    title: "AICTE Scholarships (Technical Education Scholarships)",
    category: "students",
    source: "central",
    description: "Scholarships for engineering/polytechnic students (Pragati, Saksham)",
    fullDescription: "Scholarships including Pragati (girls) and Saksham (differently-abled).",
    eligibility: ["Enrolled in AICTE-approved institutions"],
    benefits: ["₹50,000/year"],
    documents: ["Aadhaar", "Admission proof", "Caste certificate / disability proof if applicable"],
    applyMode: "online",
    applyOnlineLink: "https://www.aicte-india.org/schemes/students-development-schemes"
  },
  {
    id: "ugc-scholarships",
    title: "UGC Scholarships",
    category: "students",
    source: "central",
    description: "Financial support for higher education, postgraduate & PhD students",
    fullDescription: "Support from UGC for research and higher education at recognized universities.",
    eligibility: ["Enrolled in UGC-recognized university"],
    benefits: ["Variable depending on scholarship", "Stipend for research", "Tuition coverage"],
    documents: ["Aadhaar", "Admission letter"],
    applyMode: "online",
    applyOnlineLink: "https://ugc.ac.in/ugc_schemes/"
  },

  // STUDENTS - MAHARASHTRA
  {
    id: "rajarshi-chhatrapati",
    title: "Rajarshi Chhatrapati Shahu Maharaj Scholarship",
    category: "students",
    district: "Maharashtra",
    source: "state",
    description: "Scholarship for meritorious & economically backward students",
    fullDescription: "Scholarship for merit and economically backward students in Maharashtra.",
    eligibility: ["Maharashtra domicile", "Performance based on marks", "Income limit — varies by category"],
    benefits: ["Tuition & exam fees covered"],
    documents: ["Aadhaar", "Income certificate", "Marksheet"],
    applyMode: "online",
    applyOnlineLink: "https://mahadbt.maharashtra.gov.in/"
  },
  {
    id: "post-matric-sc",
    title: "Post-Matric Scholarship SC (Maharashtra)",
    category: "students",
    district: "Maharashtra",
    source: "state",
    description: "Financial support for Scheduled Caste students for higher education",
    fullDescription: "Support for SC students pursuing higher education in Maharashtra.",
    eligibility: ["SC category", "Income ≤ ₹2.5 lakh", "Studying in recognized institution"],
    benefits: ["Tuition fee", "Hostel allowance", "Books & allowances"],
    documents: ["SC Caste Certificate", "Aadhaar", "Income Certificate", "7/12 or residency proof"],
    applyMode: "online",
    applyOnlineLink: "https://mahadbt.maharashtra.gov.in/"
  },
  {
    id: "post-matric-vjnt",
    title: "Post-Matric Scholarship VJNT / SBC / OBC",
    category: "students",
    district: "Maharashtra",
    source: "state",
    description: "Support for students from VJNT / SBC / OBC caste categories",
    fullDescription: "Scholarship for VJNT, SBC, and OBC students in Maharashtra.",
    eligibility: ["Belong to VJNT / SBC / OBC", "Family income ≤ ₹1 lakh", "Maharashtra resident"],
    benefits: ["Tuition fee reimbursement", "Exam fee coverage"],
    documents: ["Caste certificate", "Income certificate", "Aadhaar"],
    applyMode: "online",
    applyOnlineLink: "https://mahadbt.maharashtra.gov.in/"
  },
  {
    id: "dr-punjabrao-hostel",
    title: "Dr. Punjabrao Deshmukh Hostel Scheme",
    category: "students",
    district: "Maharashtra",
    source: "state",
    description: "Hostel fee assistance for students staying away from home",
    fullDescription: "Hostel allowance for rural students studying in urban cities.",
    eligibility: ["Rural students studying in urban city", "Maharashtra domicile"],
    benefits: ["₹30,000–₹35,000 per year hostel allowance"],
    documents: ["Aadhaar", "Hostel receipt", "Admission letter"],
    applyMode: "online",
    applyOnlineLink: "https://mahadbt.maharashtra.gov.in/"
  },
  {
    id: "vocational-education",
    title: "Vocational Education Fee Reimbursement",
    category: "students",
    district: "Maharashtra",
    source: "state",
    description: "Fee support for diploma/certificate vocational courses",
    fullDescription: "Reimbursement for vocational education course fees.",
    eligibility: ["Vocational course students", "Income limit applicable"],
    benefits: ["Reimbursement of educational fees"],
    documents: ["Aadhaar", "Course enrollment proof", "Income certificate"],
    applyMode: "online",
    applyOnlineLink: "https://mahadbt.maharashtra.gov.in/"
  },
  {
    id: "ebc-scholarship",
    title: "Economically Backward Category Scholarship (EBC)",
    category: "students",
    district: "Maharashtra",
    source: "state",
    description: "Scholarship for students from low-income general category",
    fullDescription: "Support for economically backward students in Maharashtra.",
    eligibility: ["Income ≤ ₹8 lakh", "Maharashtra residence", "Student enrolled in recognized institute"],
    benefits: ["Tuition & exam fee reimbursement — up to 50–100%"],
    documents: ["Aadhaar", "Income certificate", "Admission letter"],
    applyMode: "online",
    applyOnlineLink: "https://mahadbt.maharashtra.gov.in/"
  },

  // WOMEN & CHILD
  {
    id: "majhi-ladki-bahin",
    title: "Majhi Ladki Bahin Yojana (Maharashtra)",
    category: "women_child",
    district: "Maharashtra",
    source: "state",
    description: "Monthly financial assistance to women aged 21 to 60",
    fullDescription: "State assistance program supporting independent income for women.",
    eligibility: ["Woman must be resident of Maharashtra", "Age between 21–60", "One beneficiary per household"],
    benefits: ["₹1500 per month", "Direct bank transfer to Aadhaar-linked account"],
    documents: ["Aadhaar", "Bank account", "Address proof"],
    applyMode: "online",
    applyOnlineLink: "https://mahadbt.maharashtra.gov.in/"
  },
  {
    id: "sukanya-samriddhi",
    title: "Sukanya Samriddhi Yojana (Central Govt)",
    category: "women_child",
    source: "central",
    description: "Long-term savings plan for girl child",
    fullDescription: "High-return savings scheme for girl children with tax-free returns.",
    eligibility: ["Girl child under age 10"],
    benefits: ["High interest rate", "Tax-free returns", "Money for education or marriage"],
    documents: ["Birth certificate", "Aadhaar", "Parent ID"],
    applyMode: "offline",
    applyOfflineInfo: "Apply at Post Office or bank branches"
  },
  {
    id: "pradhan-mantri-matru-vandana",
    title: "Pradhan Mantri Matru Vandana Yojana (Central Govt)",
    category: "women_child",
    source: "central",
    description: "Financial support during pregnancy & after childbirth",
    fullDescription: "Support for pregnant and lactating women.",
    eligibility: ["First live birth", "Pregnant & lactating women"],
    benefits: ["₹5000 paid in installments", "Helps in nutrition & health care"],
    documents: ["Aadhaar", "Pregnancy medical card", "Bank details"],
    applyMode: "both",
    applyOnlineLink: "https://pmmvy.wcd.gov.in/",
    applyOfflineInfo: "Apply via Anganwadi or hospital"
  },
  {
    id: "poshan-abhiyan",
    title: "POSHAN Abhiyan (Central Govt)",
    category: "women_child",
    source: "central",
    description: "National nutrition program to reduce malnutrition among children & mothers",
    fullDescription: "Nutrition program for children and mothers with growth monitoring.",
    eligibility: ["Children 0–6", "Pregnant women", "Breastfeeding mothers"],
    benefits: ["Nutrition supplements", "Growth monitoring", "Regular health checkups"],
    documents: ["Aadhaar", "Health card"],
    applyMode: "offline",
    applyOfflineInfo: "Through local Anganwadi centers"
  },
  {
    id: "beti-bachao-beti-padhao",
    title: "Beti Bachao Beti Padhao (Central Govt)",
    category: "women_child",
    source: "central",
    description: "Awareness & advocacy campaign for girl child education & protection",
    fullDescription: "Government program for girl child education and safety.",
    eligibility: ["Public beneficiary program (no individual application)"],
    benefits: ["Encourages girls' education", "Government-run awareness & funding programs"],
    documents: [],
    applyMode: "offline",
    applyOfflineInfo: "No application — government policy implementation"
  },
  {
    id: "working-women-hostel",
    title: "Working Women Hostel Scheme (Central Govt)",
    category: "women_child",
    source: "central",
    description: "Safe & affordable hostels for working women in urban areas",
    fullDescription: "Subsidised accommodation for working women with daycare support.",
    eligibility: ["Working women", "Job seekers / trainees", "Widowed / divorced / single women"],
    benefits: ["Subsidised accommodation", "Daycare support for young children (in some hostels)"],
    documents: ["Aadhaar", "Employment or training proof"],
    applyMode: "offline",
    applyOfflineInfo: "Apply at hostel directly via state nodal department"
  },

  // SOCIAL SECURITY & PENSIONS
  {
    id: "sanjay-gandhi-niradhar",
    title: "Sanjay Gandhi Niradhar Anudan Yojana (Maharashtra)",
    category: "social_security",
    district: "Maharashtra",
    source: "state",
    description: "Financial assistance to the poor, destitute, handicapped, and extremely needy individuals",
    fullDescription: "Monthly pension for vulnerable populations below poverty line.",
    eligibility: ["Age 18–65", "Income below poverty line", "Includes: destitute, orphans, HIV patients, deserted women"],
    benefits: ["₹600 per month for single beneficiary", "₹900 per month for family with more than one beneficiary"],
    documents: ["Aadhaar", "Income certificate", "Medical / disability certificate (if applicable)", "Residence proof"],
    applyMode: "both",
    applyOnlineLink: "https://mahadbt.maharashtra.gov.in/",
    applyOfflineInfo: "Apply offline at Taluka Social Welfare Office"
  },
  {
    id: "shravanbal-seva-pension",
    title: "Shravanbal Seva Rajya Nivrutt Vetan Yojana (Maharashtra)",
    category: "social_security",
    district: "Maharashtra",
    source: "state",
    description: "Pension for senior citizens aged above 65",
    fullDescription: "Monthly pension scheme for elderly residents of Maharashtra.",
    eligibility: ["Resident of Maharashtra", "Age 65+", "Low-income / BPL"],
    benefits: ["₹600–₹1000 per month depending on category"],
    documents: ["Aadhaar", "Age proof", "Income proof", "Address proof"],
    applyMode: "online",
    applyOnlineLink: "https://mahadbt.maharashtra.gov.in/"
  },
  {
    id: "indira-gandhi-widow-pension",
    title: "Indira Gandhi National Widow Pension Scheme (Maharashtra Implementation)",
    category: "social_security",
    district: "Maharashtra",
    source: "state",
    description: "Monthly pension for widowed women with limited income",
    fullDescription: "Pension support for widows below poverty line.",
    eligibility: ["Widowed woman", "Age 40–59", "Below poverty line"],
    benefits: ["₹600 or more per month (as per state rules)"],
    documents: ["Aadhaar", "Husband's death certificate", "Income certificate", "Residence proof"],
    applyMode: "online",
    applyOnlineLink: "https://mahadbt.maharashtra.gov.in/"
  },
  {
    id: "divyang-pension",
    title: "Divyang Pension Yojana (Maharashtra)",
    category: "social_security",
    district: "Maharashtra",
    source: "state",
    description: "Monthly pension for persons with disabilities",
    fullDescription: "Pension support for persons with certified disabilities.",
    eligibility: ["Resident of Maharashtra", "Minimum 40% disability certified"],
    benefits: ["₹600–₹900 per month depending on disability"],
    documents: ["Aadhaar", "Disability certificate", "Address proof"],
    applyMode: "online",
    applyOnlineLink: "https://mahadbt.maharashtra.gov.in/"
  },
  {
    id: "atal-pension-yojana",
    title: "Atal Pension Yojana (Central)",
    category: "social_security",
    source: "central",
    description: "Pension scheme for workers in the unorganized sector",
    fullDescription: "Retirement pension for unorganized workers aged 18-40.",
    eligibility: ["Age 18–40", "Must have bank account", "Must not be an Income Tax payer"],
    benefits: ["Monthly pension of ₹1000–₹5000 after age 60"],
    documents: ["Aadhaar", "Bank account"],
    applyMode: "offline",
    applyOfflineInfo: "Enrollment through banks"
  },
  {
    id: "pradhan-mantri-suraksha-bima",
    title: "Pradhan Mantri Suraksha Bima Yojana (PMSBY)",
    category: "social_security",
    source: "central",
    description: "Accident insurance scheme for accidental death or disability",
    fullDescription: "Low-cost accident insurance with ₹2 lakh coverage.",
    eligibility: ["Age 18–70", "Bank account"],
    benefits: ["₹2 lakh accidental death cover", "Premium: ₹12 per year"],
    documents: ["Aadhaar", "Bank account"],
    applyMode: "offline",
    applyOfflineInfo: "Apply via bank"
  },
  {
    id: "pradhan-mantri-jeevan-jyoti",
    title: "Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)",
    category: "social_security",
    source: "central",
    description: "Life insurance for death due to any reason",
    fullDescription: "Life insurance with ₹2 lakh coverage.",
    eligibility: ["Age 18–50", "Bank account"],
    benefits: ["₹2 lakh life cover", "Premium: ₹330 per year"],
    documents: ["Aadhaar", "Bank account"],
    applyMode: "offline",
    applyOfflineInfo: "Apply via bank"
  },

  // HOUSING
  {
    id: "ramai-awas",
    title: "Ramai Awas Yojana (Maharashtra)",
    category: "housing",
    district: "Maharashtra",
    source: "state",
    description: "Housing support for SC/ST families and disadvantaged communities",
    fullDescription: "Subsidy to build or renovate permanent houses for SC/ST communities.",
    eligibility: ["Resident of Maharashtra", "SC/ST category", "Family must not own permanent pucca house", "Low-income category"],
    benefits: ["Subsidy to build or renovate a house", "Priority given to SC/ST applicants", "Direct benefit transfer to bank account"],
    documents: ["Aadhaar", "Caste certificate (SC/ST)", "Income certificate", "Address proof", "7/12 land record or house document"],
    applyMode: "both",
    applyOnlineLink: "https://mahadbt.maharashtra.gov.in/",
    applyOfflineInfo: "Apply at local Tehsil office / Social Welfare Office"
  },
  {
    id: "modi-awas-gharkul",
    title: "Modi Awas Gharkul Yojana (Maharashtra)",
    category: "housing",
    district: "Maharashtra",
    source: "state",
    description: "State housing for economically weak rural families",
    fullDescription: "Financial support for constructing house in rural Maharashtra.",
    eligibility: ["Resident of Maharashtra", "Rural household", "No pucca house ownership", "Low-income family"],
    benefits: ["Financial support for constructing house", "Infrastructure support like sanitation & basic amenities"],
    documents: ["Aadhaar", "Income certificate", "7/12 land document", "Address proof"],
    applyMode: "both",
    applyOnlineLink: "https://pmayg.nic.in/",
    applyOfflineInfo: "Apply at Gram Panchayat"
  },
  {
    id: "aadim-awas-tribal",
    title: "Aadim Awas Yojana (Tribal Housing – Maharashtra)",
    category: "housing",
    district: "Maharashtra",
    source: "state",
    description: "Housing assistance exclusively for Scheduled Tribe / Adivasi communities",
    fullDescription: "Support for tribal communities to build permanent houses.",
    eligibility: ["Must be Scheduled Tribe", "Must be Maharashtra resident", "No permanent house"],
    benefits: ["Assistance to build permanent houses", "Support for materials and construction", "Priority for remote tribal villages"],
    documents: ["Aadhaar", "ST caste certificate", "Address proof", "Land/house ownership document"],
    applyMode: "offline",
    applyOfflineInfo: "Apply at Tribal Development Office in district"
  },
  {
    id: "pm-awas-urban",
    title: "PM Awas Yojana — Urban (PMAY-U)",
    category: "housing",
    source: "central",
    description: "Housing support for urban residents to buy or build affordable homes",
    fullDescription: "Interest subsidy on home loans for urban residents.",
    eligibility: ["Urban resident", "Must not own pucca house", "Income: EWS ≤ ₹3L, LIG ₹3-6L, MIG-I ₹6-12L, MIG-II ₹12-18L"],
    benefits: ["Up to ₹2.67 lakh interest subsidy on home loan", "Support for house purchase, construction or renovation"],
    documents: ["Aadhaar", "Income proof", "House/land documents", "Bank details"],
    applyMode: "both",
    applyOnlineLink: "https://pmay-urban.gov.in/",
    applyOfflineInfo: "Apply at Municipality / Nagar Nigam"
  },
  {
    id: "pm-awas-gramin",
    title: "PM Awas Yojana — Gramin (PMAY-G)",
    category: "housing",
    source: "central",
    description: "Housing for rural poor to build pucca houses",
    fullDescription: "Financial assistance for rural housing construction.",
    eligibility: ["Rural household", "No pucca house", "Name must be in SECC beneficiary list"],
    benefits: ["₹1.2–1.5 lakh financial assistance", "Toilet assistance under Swachh Bharat", "LPG support under Ujjwala"],
    documents: ["Aadhaar", "Bank account", "Land holding proof", "Residence certificate"],
    applyMode: "both",
    applyOnlineLink: "https://pmayg.nic.in/",
    applyOfflineInfo: "Apply at Gram Panchayat"
  },

  // HEALTH
  {
    id: "mjpjay",
    title: "Mahatma Jyotirao Phule Jan Arogya Yojana (MJPJAY) — Maharashtra",
    category: "health",
    district: "Maharashtra",
    source: "state",
    description: "Free treatment for serious illnesses in empaneled hospitals",
    fullDescription: "Comprehensive health coverage with cashless hospitalization.",
    eligibility: ["Resident of Maharashtra", "Families with Yellow or Orange Ration Card", "Antyodaya cardholders also eligible"],
    benefits: ["Free treatment up to ₹1.5–2 lakh per family/year", "Cashless hospitalization", "900+ surgeries and treatments covered"],
    documents: ["Aadhaar", "Ration card", "Referral slip / hospital document"],
    applyMode: "offline",
    applyOfflineInfo: "Go to MJPJAY listed hospital and show Aadhaar + Ration card"
  },
  {
    id: "aapla-dawakhana",
    title: "Aapla Dawakhana — Maharashtra",
    category: "health",
    district: "Maharashtra",
    source: "state",
    description: "Government-run clinics for cheap/fixed price medicines and basic treatment",
    fullDescription: "Accessible healthcare with low-cost generic medicines.",
    eligibility: ["Open to all residents of Maharashtra"],
    benefits: ["Very low-cost generic medicines", "Basic medical consultation free or minimal charges"],
    documents: ["Prescription (for medicine purchase)"],
    applyMode: "offline",
    applyOfflineInfo: "Simply walk in and purchase medicines"
  },
  {
    id: "ayushman-bharat-pmjay",
    title: "Ayushman Bharat — PMJAY (Central)",
    category: "health",
    source: "central",
    description: "Health insurance for poor families with ₹5 lakh coverage",
    fullDescription: "Cashless health insurance scheme with comprehensive coverage.",
    eligibility: ["Name in PMJAY beneficiary database"],
    benefits: ["Cashless treatment up to ₹5 lakh/year", "Covers hospitalization, surgery, procedures"],
    documents: ["Aadhaar", "Ration card / eligibility proof"],
    applyMode: "offline",
    applyOfflineInfo: "Eligibility check at https://mera.pmjay.gov.in/"
  }
];

export async function seedAllSchemes(): Promise<void> {
  console.log("[Seeds] Starting to seed all schemes...");
  let seeded = 0;
  let skipped = 0;

  for (const scheme of ALL_SCHEMES) {
    try {
      await storage.insertScheme(scheme);
      seeded++;
    } catch (error) {
      if (error instanceof Error && error.message.includes("duplicate")) {
        skipped++;
      } else {
        console.error(`[Seeds] Error seeding ${scheme.title}:`, error);
      }
    }
  }

  console.log(`[Seeds] Completed! Seeded: ${seeded}, Skipped (duplicates): ${skipped}, Total schemes: ${ALL_SCHEMES.length}`);
}
