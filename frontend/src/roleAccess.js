export const ROLE_CONFIG = {
  general: {
    label: "General user",
    dashboardTitle: "Your help requests",
    intro: "Find support for items, meals, blood, and urgent situations in your community.",
    resourceMine: "requested",
    foodMine: "requested",
    bloodMine: "requested",
    emergencyMine: "requested",
  },
  receiver: {
    label: "Receiver",
    dashboardTitle: "Your help requests",
    intro: "Track the items, meals, blood, and emergency support on its way to you.",
    resourceMine: "requested",
    foodMine: "requested",
    bloodMine: "requested",
    emergencyMine: "requested",
  },
  donor: {
    label: "Donor",
    dashboardTitle: "Your donations",
    intro: "Share useful items, food, or blood and follow each contribution through completion.",
    resourceMine: "owned",
    foodMine: "provided",
    bloodMine: "matched",
    emergencyMine: "requested",
  },
  volunteer: {
    label: "Volunteer",
    dashboardTitle: "Your response work",
    intro: "Keep track of pickups, deliveries, and emergency responses you are handling.",
    resourceMine: "volunteering",
    foodMine: "volunteering",
    bloodMine: "matched",
    emergencyMine: "assigned",
  },
  ngo: {
    label: "NGO / community organization",
    dashboardTitle: "Organization activity",
    intro: "Coordinate incoming requests, resource distribution, food rescue, and emergency support.",
    resourceMine: "volunteering",
    foodMine: "volunteering",
    bloodMine: "matched",
    emergencyMine: "assigned",
  },
  blood_bank: {
    label: "Blood bank",
    dashboardTitle: "Blood coordination",
    intro: "Monitor matched blood requests and keep your availability and fulfillment status current.",
    resourceMine: "owned",
    foodMine: "provided",
    bloodMine: "matched",
    emergencyMine: "requested",
  },
  admin: {
    label: "Administrator",
    dashboardTitle: "System overview",
    intro: "Review community activity, requests, verification work, and platform-wide impact.",
    resourceMine: undefined,
    foodMine: undefined,
    bloodMine: undefined,
    emergencyMine: undefined,
  },
};

export const ROLE_ACCESS = {
  donor: ["resources", "food", "blood", "impact", "profile"],
  receiver: ["resources", "food", "blood", "emergency", "impact", "profile"],
  general: ["resources", "food", "blood", "emergency", "impact", "profile"],
  volunteer: ["resources", "food", "emergency", "impact", "profile"],
  ngo: ["resources", "food", "emergency", "impact", "profile"],
  blood_bank: ["blood", "impact", "profile"],
  admin: ["resources", "food", "blood", "emergency", "impact", "profile", "verifications"],
};

export function canAccess(role, section) {
  return ROLE_ACCESS[role]?.includes(section) ?? false;
}

export function getRoleConfig(role) {
  return ROLE_CONFIG[role] || ROLE_CONFIG.general;
}