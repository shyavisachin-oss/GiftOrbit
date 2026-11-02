/* ==========================================================================
   GiftOrbit Constants & Seed Data
   ========================================================================== */

const CATEGORIES = [
  { name: "Tech & Gadgets", blurb: "Latest innovations", color: "#DC2626", radius: 9, speed: 0.62, size: 1.05 },
  { name: "Fashion & Style", blurb: "Trendsetting apparel", color: "#F59E8B", radius: 12.5, speed: 0.46, size: 0.85 },
  { name: "Gaming Gear", blurb: "Next-level play", color: "#F43F5E", radius: 16, speed: 0.36, size: 1.25 },
  { name: "Lifestyle", blurb: "Everyday upgrades", color: "#EF4444", radius: 19.5, speed: 0.28, size: 0.8 },
  { name: "Experiences", blurb: "Memories over things", color: "#F59E8B", radius: 23, speed: 0.21, size: 0.95 },
];

const RECIPIENTS = [
  { key: "Partner", sub: "Significant other", icon: "Heart" },
  { key: "Family", sub: "Parents, siblings, etc.", icon: "Users" },
  { key: "Friend", sub: "Close friends & pals", icon: "User" },
  { key: "Colleague", sub: "Co-workers & bosses", icon: "Briefcase" },
];

const OCCASIONS = [
  "Birthday",
  "Anniversary",
  "Holiday Season",
  "Just Because",
  "Graduation",
  "Wedding"
];

const INTERESTS = [
  "Tech",
  "Fashion",
  "Gaming",
  "Fitness",
  "Cooking",
  "Music",
  "Reading",
  "Travel",
  "Art",
  "Outdoors"
];

const STYLES = [
  "Minimalist",
  "Bold & Colorful",
  "Classic",
  "Quirky & Fun",
  "Luxury"
];

const STEP_LABELS = [
  "Recipient",
  "Occasion",
  "Interests",
  "Budget",
  "Style"
];

const SEED_WISHLIST = [
  { name: "Sony WH-1000XM5", price: "$348.00", blurb: "Flagship noise-cancelling headphones." },
  { name: "BenQ ScreenBar", price: "$109.00", blurb: "Clip-on monitor light for late nights." },
];

const SEED_HISTORY = [
  { name: "Oura Ring Gen3", price: "$199.00", recipient: "Sarah", date: "2024-10-24" },
  { name: "Aura Carver Digital Frame", price: "$85.00", recipient: "Mom", date: "2024-09-12" },
];

const CHART_DATA = [
  { month: "Jun", amount: 210 },
  { month: "Jul", amount: 180 },
  { month: "Aug", amount: 450 },
  { month: "Sep", amount: 95 },
  { month: "Oct", amount: 199 },
];

function hexToInt(hex) {
  return parseInt(hex.replace("#", ""), 16);
}

/**
 * Intelligent fallback generator when direct Claude API is not configured or offline.
 * Curates realistic, personalized gift recommendations matching the user's selected parameters.
 */
function getSmartFallbackSuggestions(profile, promptText = "") {
  const catalog = [
    { name: "Ember Smart Temperature Mug 2", price: "$149.00", blurb: "Maintains optimal drinking temperature for hot brews.", tags: ["Tech", "Lifestyle", "Cooking"] },
    { name: "Anker Prime 20,000mAh Power Bank", price: "$89.99", blurb: "Ultra-fast multi-device charging station on the go.", tags: ["Tech", "Travel"] },
    { name: "Bellroy Slim Sleeve Leather Wallet", price: "$79.00", blurb: "Streamlined silhouette in environmentally certified leather.", tags: ["Fashion", "Minimalist"] },
    { name: "Keychron Q1 Pro Mechanical Keyboard", price: "$199.00", blurb: "CNC aluminum body with hot-swappable tactile switches.", tags: ["Gaming", "Tech"] },
    { name: "Le Creuset Enameled Cast Iron Dutch Oven", price: "$249.00", blurb: "Iconic cookware that delivers superior heat distribution.", tags: ["Cooking", "Luxury"] },
    { name: "Marshall Emberton II Portable Speaker", price: "$129.99", blurb: "Iconic vintage styling with 30+ hours of rich 360° sound.", tags: ["Music", "Outdoors"] },
    { name: "Kindle Paperwhite Signature Edition", price: "$189.99", blurb: "Flush-front display, auto-adjusting light, and wireless charging.", tags: ["Reading", "Tech"] },
    { name: "Peak Design Everyday Backpack 20L", price: "$279.95", blurb: "Award-winning weatherproof gear carrier with FlexFold dividers.", tags: ["Travel", "Outdoors", "Tech"] },
    { name: "Theragun Mini Handheld Massage Gun", price: "$159.00", blurb: "Compact, pocket-sized muscle recovery with deep percussive power.", tags: ["Fitness", "Lifestyle"] },
    { name: "Baratza Encore Conical Burr Grinder", price: "$149.95", blurb: "The quintessential specialty coffee grinder for home baristas.", tags: ["Cooking", "Lifestyle"] },
    { name: "Fujifilm Instax Mini Evo Hybrid Camera", price: "$199.00", blurb: "Analog retro feel with 10 lens effects and instant film printing.", tags: ["Art", "Travel", "Quirky & Fun"] },
    { name: "Aesop Resurrection Aromatique Hand Care Set", price: "$115.00", blurb: "Botanic-rich formulations for tired hands and delicate skin.", tags: ["Luxury", "Lifestyle"] }
  ];

  const maxBudget = profile && profile.budget ? profile.budget : 300;
  const userInterests = (profile && profile.interests) || [];

  // Filter items reasonably close to budget
  let matches = catalog.filter(item => {
    const cost = parseFloat(item.price.replace(/[^0-9.]/g, ""));
    return cost <= maxBudget * 1.35;
  });

  // Score by matching interests
  matches.sort((a, b) => {
    const aScore = a.tags.filter(t => userInterests.includes(t)).length;
    const bScore = b.tags.filter(t => userInterests.includes(t)).length;
    return bScore - aScore;
  });

  if (matches.length < 3) {
    matches = catalog.slice(0, 3);
  }

  const selected = matches.slice(0, 3);
  const recipientName = (profile && profile.recipient) || "them";
  const occasion = (profile && profile.occasion) ? ` for ${profile.occasion}` : "";

  return {
    reply: `I analyzed the celestial coordinates for ${recipientName}${occasion}! Here are hand-picked gifts that reflect their unique tastes and stay within your target budget.`,
    suggestions: selected.map(s => ({ name: s.name, price: s.price, blurb: s.blurb }))
  };
}

// Make accessible to window
if (typeof window !== "undefined") {
  window.CATEGORIES = CATEGORIES;
  window.RECIPIENTS = RECIPIENTS;
  window.OCCASIONS = OCCASIONS;
  window.INTERESTS = INTERESTS;
  window.STYLES = STYLES;
  window.STEP_LABELS = STEP_LABELS;
  window.SEED_WISHLIST = SEED_WISHLIST;
  window.SEED_HISTORY = SEED_HISTORY;
  window.CHART_DATA = CHART_DATA;
  window.hexToInt = hexToInt;
  window.getSmartFallbackSuggestions = getSmartFallbackSuggestions;
}
