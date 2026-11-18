export interface TreatmentService {
  id: string;
  name: string;
  category: "Dental" | "Skin" | "Cosmetic";
  duration: string;
  fee: string;
  feeNumeric: number;
  description: string;
  popular?: boolean;
  highlights: string[];
  icon: "tooth" | "sparkles" | "shield" | "activity" | "sun" | "smile";
}

export interface ClinicTimingShift {
  name: string;
  display: string;
  startTime: string;
  endTime: string;
  slots: string[];
}

export interface ClinicConfig {
  clinicName: string;
  tagline: string;
  shortDescription: string;
  adminPassword: string;
  doctor: {
    name: string;
    designation: string;
    qualifications: string;
    specialty: string;
    experience: string;
    registrationNumber: string;
    bio: string;
    avatarUrl: string;
    specializations: string[];
    awards: string[];
  };
  contact: {
    phone: string;
    phoneRaw: string;
    whatsapp: string;
    whatsappRaw: string;
    email: string;
    emergencyCall: string;
    emergencyAvailable: boolean;
  };
  location: {
    addressLine1: string;
    addressLine2: string;
    landmark: string;
    city: string;
    state: string;
    pincode: string;
    fullAddress: string;
    googleMapsUrl: string;
    googleMapsEmbedUrl: string;
  };
  timings: {
    scheduleDays: string;
    sundaySchedule: string;
    shifts: {
      morning: ClinicTimingShift;
      evening: ClinicTimingShift;
    };
    note: string;
  };
  stats: {
    yearsExperience: string;
    happySmiles: string;
    starRating: string;
    sterilizationStandard: string;
  };
  services: TreatmentService[];
}

export const clinicConfig: ClinicConfig = {
  // ==========================================
  // CLINIC BRANDING & TAGLINE
  // ==========================================
  clinicName: "AMULYA DENTAL CLINIC",
  tagline: "Advanced Dental Care & Aesthetic Excellence with a Gentle Touch",
  shortDescription:
    "Welcome to Amulya Dental & Skin Clinic. We bring together state-of-the-art diagnostic dental equipment, painless treatment techniques, and clinical skin care in a sterile, welcoming environment.",
  
  // ==========================================
  // ADMIN AUTHENTICATION
  // (Change this for the clinic administrator)
  // ==========================================
  adminPassword: "amulya@admin2026",

  // ==========================================
  // LEAD DOCTOR PROFILE
  // ==========================================
  doctor: {
    name: "Dr. Amulya Sharma",
    designation: "Chief Dental Surgeon & Aesthetic Consultant",
    qualifications: "BDS, MDS (Oral & Maxillofacial Surgery), Fellowship in Aesthetic Medicine (FAM)",
    specialty: "Dental Implantology, Cosmetic Dentistry & Clinical Aesthetics",
    experience: "12+ Years of Clinical Practice",
    registrationNumber: "DCI / SDC-84920",
    bio: "Dr. Amulya Sharma is renowned for combining micro-surgical precision with compassionate patient care. With over 12 years of specialized practice, Dr. Sharma focuses on zero-anxiety procedures, computer-guided dental implants, and clinical dermatological rejuvenation that brings out your most radiant, healthy smile.",
    avatarUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=800&auto=format&fit=crop",
    specializations: [
      "Precision Microscopic Endodontics (Single-Sitting RCT)",
      "Immediate Dental Implants & Full Mouth Rehabilitation",
      "Digital Smile Design & Ceramic Veneers",
      "Laser Periodontal Treatment & Teeth Whitening",
      "Medical Hydra-Facial & Hyperpigmentation Management",
      "Anti-Aging & Collagen Induction Therapy",
    ],
    awards: [
      "Best Dental Practitioner Award 2023 - State Healthcare Excellence",
      "Certified Fellow of the International Congress of Oral Implantologists (ICOI)",
      "Published Author in International Journal of Oral & Maxillofacial Surgery",
    ],
  },

  // ==========================================
  // CONTACT & WHATSAPP CHANNELS
  // ==========================================
  contact: {
    phone: "+91 98765 43210",
    phoneRaw: "+919876543210",
    whatsapp: "+91 98765 43210",
    whatsappRaw: "919876543210",
    email: "care@amulyadental.com",
    emergencyCall: "+91 98765 43210",
    emergencyAvailable: true,
  },

  // ==========================================
  // CLINIC PHYSICAL LOCATION & GOOGLE MAPS
  // ==========================================
  location: {
    addressLine1: "Shop No. 4 & 5, Ground Floor, Royal Health Plaza",
    addressLine2: "Opposite Metro Pillar 142, Main Central Market",
    landmark: "Near City Central Metro Station",
    city: "New Delhi",
    state: "Delhi",
    pincode: "110001",
    fullAddress:
      "Shop No. 4 & 5, Ground Floor, Royal Health Plaza, Opposite Metro Pillar 142, Main Central Market, New Delhi, Delhi 110001",
    googleMapsUrl: "https://maps.app.goo.gl/zpmYzc6vvLryB4Fg8",
    googleMapsEmbedUrl:
      "https://www.google.com/maps?q=AMULYA+DENTAL+CLINIC+New+Delhi&z=15&output=embed",
  },

  // ==========================================
  // TIMINGS & SHIFTS
  // ==========================================
  timings: {
    scheduleDays: "Monday to Saturday",
    sundaySchedule: "Sunday: 10:00 AM – 01:30 PM (By Prior Appointment Only)",
    shifts: {
      morning: {
        name: "Morning Shift",
        display: "09:30 AM – 01:30 PM",
        startTime: "09:30 AM",
        endTime: "01:30 PM",
        slots: [
          "09:30 AM",
          "10:15 AM",
          "11:00 AM",
          "11:45 AM",
          "12:30 PM",
          "01:00 PM",
        ],
      },
      evening: {
        name: "Evening Shift",
        display: "05:00 PM – 09:00 PM",
        startTime: "05:00 PM",
        endTime: "09:00 PM",
        slots: [
          "05:00 PM",
          "05:45 PM",
          "06:30 PM",
          "07:15 PM",
          "08:00 PM",
          "08:30 PM",
        ],
      },
    },
    note: "Emergency consultations accommodate on-call walk-ins during non-clinic hours based on doctor availability.",
  },

  // ==========================================
  // CLINIC STATS & TRUST BADGES
  // ==========================================
  stats: {
    yearsExperience: "12+",
    happySmiles: "10,000+",
    starRating: "4.9/5 (500+ Reviews)",
    sterilizationStandard: "Class-B Autoclave 100% Sterile",
  },

  // ==========================================
  // TREATMENTS & SERVICES
  // ==========================================
  services: [
    {
      id: "srv-consultation",
      name: "Comprehensive Dental Checkup & Digital X-Ray",
      category: "Dental",
      duration: "20 - 30 Mins",
      fee: "₹400",
      feeNumeric: 400,
      description:
        "Full oral cavity examination, digital intraoral sensor X-rays (RVG), caries screening, and customized treatment planning.",
      popular: true,
      highlights: ["Digital Intraoral X-Ray", "Oral Cancer Screening", "Transparent Treatment Plan"],
      icon: "shield",
    },
    {
      id: "srv-rct",
      name: "Single-Sitting Root Canal (Painless RCT)",
      category: "Dental",
      duration: "45 - 60 Mins",
      fee: "₹3,500",
      feeNumeric: 3500,
      description:
        "Advanced motorized rotary endodontics with electronic apex locators for rapid, pain-free infection elimination in one sitting.",
      popular: true,
      highlights: ["Zero Pain Rotary Files", "Apex Locator Precision", "Save Natural Tooth"],
      icon: "tooth",
    },
    {
      id: "srv-implants",
      name: "Permanent Dental Implants (Titanium / Zirconia)",
      category: "Dental",
      duration: "45 - 60 Mins",
      fee: "₹18,000",
      feeNumeric: 18000,
      description:
        "Biocompatible titanium fixture osseointegrated into jawbone, completed with natural ceramic crown for permanent chewing confidence.",
      popular: true,
      highlights: ["Lifetime Warranty Implants", "Natural Bite Strength", "Same-Day Temporary Available"],
      icon: "shield",
    },
    {
      id: "srv-whitening",
      name: "Laser Teeth Whitening (In-Office Glow)",
      category: "Cosmetic",
      duration: "45 Mins",
      fee: "₹4,500",
      feeNumeric: 4500,
      description:
        "Safe medical LED laser activation lifting tea, coffee, and tobacco stains by 4 to 8 shades in a single comfortable session.",
      popular: true,
      highlights: ["Up to 8 Shades Brighter", "Enamel-Safe Formulation", "Long-Lasting Radiance"],
      icon: "sparkles",
    },
    {
      id: "srv-aligners",
      name: "Invisible Clear Aligners & Orthodontics",
      category: "Cosmetic",
      duration: "30 Mins (Consult)",
      fee: "₹25,000 onward",
      feeNumeric: 25000,
      description:
        "Discreet, custom 3D-scanned transparent trays correcting spacing, crowded teeth, and deep bites without traditional metal wires.",
      popular: false,
      highlights: ["100% Invisible", "Removable & Easy to Clean", "3D Digital Simulation"],
      icon: "smile",
    },
    {
      id: "srv-scaling",
      name: "Ultrasonic Scaling & Stain Polishing",
      category: "Dental",
      duration: "30 Mins",
      fee: "₹1,200",
      feeNumeric: 1200,
      description:
        "Gentle ultrasonic micro-vibrations removing tartar, calculus, and plaque buildup, finished with prophylactic diamond polishing.",
      popular: false,
      highlights: ["Gum Disease Prevention", "Removes Stubborn Plaque", "Fresh Breath Restoration"],
      icon: "activity",
    },
    {
      id: "srv-filling",
      name: "Tooth-Colored Cosmetic Composite Restoration",
      category: "Dental",
      duration: "30 Mins",
      fee: "₹1,200",
      feeNumeric: 1200,
      description:
        "High-strength nano-hybrid resin color-matched seamlessly to your natural tooth enamel for invisible cavity fillings and chip repairs.",
      popular: false,
      highlights: ["Exact Shade Matching", "Durable Nano-Composite", "Bite Restored Instantly"],
      icon: "tooth",
    },
    {
      id: "srv-hydrafacial",
      name: "Clinical Medical Hydra-Facial & Deep Infusion",
      category: "Skin",
      duration: "45 Mins",
      fee: "₹2,200",
      feeNumeric: 2200,
      description:
        "Multi-step vacuum vortex cleansing, gentle chemical exfoliation, blackhead extraction, and hyaluronic antioxidant serum hydration.",
      popular: true,
      highlights: ["Deep Pore Vacuum", "Instant Glass Skin Glow", "Hyaluronic Acid Plumping"],
      icon: "sparkles",
    },
    {
      id: "srv-chemical-peel",
      name: "Dermatological Chemical Peel (Acne & Glow)",
      category: "Skin",
      duration: "30 Mins",
      fee: "₹1,800",
      feeNumeric: 1800,
      description:
        "Targeted glycolic, salicylic, or lactic acid peel dissolving dead epidermis cells to heal active acne, lighten tanning, and fade dark spots.",
      popular: false,
      highlights: ["Targets Active Acne", "Fades Sun Tan & Melasma", "Smooth Even Complexion"],
      icon: "sun",
    },
    {
      id: "srv-microneedling",
      name: "Collagen Induction Therapy & Acne Scar Treatment",
      category: "Skin",
      duration: "50 Mins",
      fee: "₹3,200",
      feeNumeric: 3200,
      description:
        "Automated micro-needling stimulating natural elastin and collagen synthesis to resurface stubborn acne scars, open pores, and fine lines.",
      popular: false,
      highlights: ["Acne Scar Reduction", "Refines Enlarged Pores", "Boosts Natural Collagen"],
      icon: "activity",
    },
    {
      id: "srv-laser-skin",
      name: "Laser Hair Reduction / Skin Rejuvenation",
      category: "Skin",
      duration: "40 Mins",
      fee: "₹2,500",
      feeNumeric: 2500,
      description:
        "Triple-wavelength diode laser with cooling sapphire tip for painless, long-lasting hair removal and skin smoothing.",
      popular: false,
      highlights: ["Painless Sapphire Chilling", "Safe For Indian Skin Types", "Permanent Density Reduction"],
      icon: "sparkles",
    },
  ],
};
