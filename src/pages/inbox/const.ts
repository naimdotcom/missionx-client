const customerNames = [
  { firstName: "Sarah", lastName: "Johnson" },
  { firstName: "Mike", lastName: "Chen" },
  { firstName: "Emma", lastName: "Wilson" },
  { firstName: "James", lastName: "Anderson" },
  { firstName: "Lisa", lastName: "Martinez" },
  { firstName: "David", lastName: "Taylor" },
  { firstName: "Jennifer", lastName: "Garcia" },
  { firstName: "Robert", lastName: "Brown" },
  { firstName: "Maria", lastName: "Rodriguez" },
  { firstName: "William", lastName: "Lee" },
  { firstName: "Patricia", lastName: "Davis" },
  { firstName: "Michael", lastName: "Miller" },
  { firstName: "Barbara", lastName: "Thompson" },
  { firstName: "Christopher", lastName: "Harris" },
  { firstName: "Susan", lastName: "Martin" },
  { firstName: "Daniel", lastName: "Jackson" },
  { firstName: "Jessica", lastName: "White" },
  { firstName: "Matthew", lastName: "Harris" },
  { firstName: "Karen", lastName: "Clark" },
  { firstName: "Anthony", lastName: "Lewis" },
  { firstName: "Rebecca", lastName: "Walker" },
  { firstName: "Mark", lastName: "Hall" },
  { firstName: "Donna", lastName: "Young" },
  { firstName: "Donald", lastName: "King" },
  { firstName: "Carol", lastName: "Wright" },
  { firstName: "Steven", lastName: "Lopez" },
  { firstName: "Margaret", lastName: "Hill" },
  { firstName: "Paul", lastName: "Scott" },
  { firstName: "Doris", lastName: "Green" },
  { firstName: "Andrew", lastName: "Adams" },
];

const subjects = [
  "Product inquiry",
  "Thank you message",
  "Details request",
  "Billing question",
  "Technical support needed",
  "Refund request",
  "Order status update",
  "Account issue",
  "Shipping delay",
  "Product quality concern",
  "Bulk order quote",
  "Discount inquiry",
  "Feature request",
  "Partnership opportunity",
  "Feedback",
  "Urgent: Cannot access account",
  "Complaint about service",
  "Warranty claim",
  "Return request",
  "Payment issue",
  "Delivery confirmation",
  "Customization request",
  "Subscription cancellation",
  "Upgrade inquiry",
  "Login problems",
];

const messages = [
  "Hey! I have a question about your product...",
  "Is it available in different colors?",
  "Thanks for your help!",
  "Can you send me more details?",
  "What's the pricing for bulk orders?",
  "How long does delivery take?",
  "I received a damaged item",
  "Can I get a refund?",
  "When will this be in stock?",
  "Do you offer technical support?",
  "Great service, highly recommended!",
  "I have some feedback",
  "Can we discuss a partnership?",
  "What payment methods do you accept?",
  "Is there a discount for long-term contracts?",
  "Help! I can't log in",
  "The product doesn't work as advertised",
  "I need to cancel my subscription",
  "Can I upgrade my plan?",
  "Your customer service is amazing",
  "When is the next update coming?",
  "Do you ship internationally?",
  "Can I get a custom quote?",
  "The website is down",
  "I love your products!",
];

const channels = [
  "facebook_page",
  "instagram_business",
  "whatsapp_business",
  "twitter",
  "email",
  "telegram",
];

const sentiments = ["positive", "neutral", "negative"];
const statuses = ["open", "pending", "closed"];
const priorities = ["low", "normal", "high"];

export const mockTickets = Array.from({ length: 20 }, (_, index) => {
  const customer = customerNames[index % customerNames.length];
  const daysAgo = Math.floor(index / 4);
  const hoursAgo = Math.floor(index / 10);

  return {
    id: index + 1,
    workspaceId: "ws-1",
    channelType: channels[index % channels.length],
    status: statuses[index % statuses.length],
    priority: priorities[index % priorities.length],
    subject: subjects[index % subjects.length],
    contactAvatarUrl: "https://github.com/shadcn.png",
    customer: {
      id: `c${index + 1}`,
      name: `${customer.firstName} ${customer.lastName}`,
    },
    sentiment: sentiments[index % sentiments.length],
    unreadCount: index % 3 === 0 ? Math.floor(Math.random() * 3) : 0,
    lastMessageAt: new Date(
      Date.now() - Math.max(daysAgo, hoursAgo) * 60 * 60 * 1000,
    ).toISOString(),
    createdAt: new Date(
      Date.now() - (daysAgo + 1) * 24 * 60 * 60 * 1000,
    ).toISOString(),
    updatedAt: new Date(
      Date.now() - Math.max(daysAgo, hoursAgo) * 60 * 60 * 1000,
    ).toISOString(),
    // Legacy properties
    contactName: `${customer.firstName} ${customer.lastName}`,
    firstName: customer.firstName,
    lastName: customer.lastName,
    lastMessage: messages[index % messages.length],
    timestamp:
      daysAgo === 0
        ? `${hoursAgo} hour${hoursAgo > 1 ? "s" : ""} ago`
        : `${daysAgo} day${daysAgo > 1 ? "s" : ""} ago`,
    unread: index % 3 === 0 ? Math.floor(Math.random() * 3) : 0,
    channel: channels[index % channels.length].split("_")[0],
  };
});

export const mockMessages = {
  1: [
    {
      id: "m1",
      sender: "Sarah Johnson",
      text: "Hey! I have a question about your product...",
      time: "10:30 AM",
      isAgent: false,
    },
    {
      id: "m2",
      sender: "Sarah Johnson",
      text: "Is it available in different colors?",
      time: "10:31 AM",
      isAgent: false,
    },
  ],
  2: [
    {
      id: "m3",
      sender: "Mike Chen",
      text: "Hi, I need help with my order",
      time: "9:15 AM",
      isAgent: false,
    },
    {
      id: "m4",
      sender: "You",
      text: "Of course! What can I help you with?",
      time: "9:16 AM",
      isAgent: true,
    },
    {
      id: "m5",
      sender: "Mike Chen",
      text: "Thanks for your help!",
      time: "9:20 AM",
      isAgent: false,
    },
  ],
  3: [
    {
      id: "m6",
      sender: "Emma Wilson",
      text: "Can you send me more details?",
      time: "8:45 AM",
      isAgent: false,
    },
  ],
  4: [
    {
      id: "m6",
      sender: "Emma Wilson",
      text: "Can you send me more details?",
      time: "8:45 AM",
      isAgent: false,
    },
  ],
  6: [
    {
      id: "m6",
      sender: "Emma Wilson",
      text: "Can you send me more details?",
      time: "8:45 AM",
      isAgent: false,
    },
  ],
  7: [
    {
      id: "m6",
      sender: "Emma Wilson",
      text: "Can you send me more details?",
      time: "8:45 AM",
      isAgent: false,
    },
  ],
  8: [
    {
      id: "m6",
      sender: "Emma Wilson",
      text: "Can you send me more details?",
      time: "8:45 AM",
      isAgent: false,
    },
  ],
  9: [
    {
      id: "m6",
      sender: "Emma Wilson",
      text: "Can you send me more details?",
      time: "8:45 AM",
      isAgent: false,
    },
  ],
  10: [
    {
      id: "m6",
      sender: "Emma Wilson",
      text: "Can you send me more details?",
      time: "8:45 AM",
      isAgent: false,
    },
  ],
};

export const mockCustomerData = {
  name: "Sarah Johnson",
  avatar: "https://github.com/shadcn.png",
  email: "sarah.johnson@example.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  joinedDate: "Jan 2024",
  tags: ["VIP", "Returning Customer", "Newsletter"],
  totalOrders: 12,
  totalSpent: "$1,245.00",
};

export const mockOrders = [
  {
    id: "ORD-001",
    date: "Jan 25, 2026",
    amount: "$89.99",
    status: "delivered" as const,
    items: 2,
  },
  {
    id: "ORD-002",
    date: "Jan 20, 2026",
    amount: "$149.99",
    status: "pending" as const,
    items: 1,
  },
  {
    id: "ORD-003",
    date: "Jan 15, 2026",
    amount: "$59.99",
    status: "delivered" as const,
    items: 3,
  },
];

export const mockNotes = [
  {
    id: "n1",
    content: "Customer prefers email communication over phone calls.",
    timestamp: "2 hours ago",
    author: "John Doe",
  },
  {
    id: "n2",
    content: "Interested in bulk order discounts for future purchases.",
    timestamp: "1 day ago",
    author: "Jane Smith",
  },
];
