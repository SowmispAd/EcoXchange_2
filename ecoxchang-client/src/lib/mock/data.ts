/** Central mock payloads — swap for API responses when backend is ready */

export const mockNotifications = [
  {
    id: "1",
    title: "Pickup scheduled",
    body: "Tomorrow 10:00–12:00 wet waste collection.",
    time: "2h ago",
    read: false,
  },
  {
    id: "2",
    title: "+50 EcoPoints",
    body: "Supervisor approved your last upload.",
    time: "1d ago",
    read: true,
  },
  {
    id: "3",
    title: "Marketplace",
    body: "Your listing is pending approval.",
    time: "3d ago",
    read: false,
  },
];

export const mockProducts = [
  {
    id: "p1",
    name: "Recycled HDPE planter",
    category: "Garden",
    price: 449,
    image: "🪴",
    seller: "GreenWorks Co.",
    score: 88,
  },
  {
    id: "p2",
    name: "Upcycled glass jars (set of 6)",
    category: "Kitchen",
    price: 299,
    image: "🫙",
    seller: "Circular Labs",
    score: 92,
  },
  {
    id: "p3",
    name: "PET fabric tote",
    category: "Accessories",
    price: 599,
    image: "🛍️",
    seller: "ReThread",
    score: 85,
  },
];

export const mockPendingApprovals = [
  {
    id: "a1",
    productName: "Hand-poured soy candles",
    seller: "trial_user_12",
    submittedAt: "2026-05-10",
    status: "pending" as const,
  },
  {
    id: "a2",
    productName: "Bamboo cutlery kit",
    seller: "member_44",
    submittedAt: "2026-05-11",
    status: "pending" as const,
  },
];

export const mockReferralStats = {
  code: "ECO-SOWMYA-7K2",
  link: "https://ecoxchange.app/join?ref=ECO-SOWMYA-7K2",
  totalReferrals: 14,
  successfulSignups: 6,
  pointsEarned: 1200,
};

export const mockMemberTracking = [
  { id: "1", label: "Scheduled", at: "May 12, 08:00", done: true },
  { id: "2", label: "Waste collected", at: "May 12, 10:24", done: true },
  { id: "3", label: "At facility", at: "May 12, 14:10", done: true },
  { id: "4", label: "Sent to recycler", at: "May 13, 09:00", done: false },
  { id: "5", label: "Recycled successfully", at: "—", done: false },
  { id: "6", label: "Rewards credited", at: "—", done: false },
];

export const mockCalendarCollections: { date: string; type: string }[] = [
  { date: "2026-05-02", type: "Wet" },
  { date: "2026-05-05", type: "Dry" },
  { date: "2026-05-09", type: "E-waste" },
  { date: "2026-05-12", type: "Wet" },
  { date: "2026-05-16", type: "Dry" },
  { date: "2026-05-19", type: "Mixed" },
];

export const mockDeliveryTasks = [
  {
    id: "T-101",
    user: "Ananya Rao",
    phone: "+91 98765 43210",
    address: "12 MG Road, Bengaluru",
    type: "Bag delivery",
    window: "09:00–11:00",
    status: "pending" as const,
  },
  {
    id: "T-102",
    user: "Vikram Singh",
    phone: "+91 91234 56789",
    address: "88 Residency Rd",
    type: "Waste pickup",
    window: "11:00–13:00",
    status: "in_progress" as const,
  },
];

export const mockRecyclerShipments = [
  { id: "SH-501", from: "Hub North", weightKg: 1200, status: "In transit" },
  { id: "SH-502", from: "Hub South", weightKg: 890, status: "Received" },
];
