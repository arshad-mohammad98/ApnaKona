// ─────────────────────────────────────────────
// Core domain types for ApnaKona
// ─────────────────────────────────────────────

export type UserRole = "student" | "owner";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  // Student-specific
  college?: string;
  preferredCity?: string;
  // Owner-specific
  businessName?: string;
  verified?: boolean;
}

export type RoomType = "PG" | "Hostel" | "Flat";
export type SharingType = "Single" | "Double" | "Triple";
export type GenderPref = "Boys" | "Girls" | "Co-Ed";
export type FurnishingStatus = "Fully Furnished" | "Semi Furnished" | "Unfurnished";

export interface Amenity {
  icon: string;
  label: string;
}

export interface Listing {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  ownerAvatar?: string;
  title: string;
  description: string;
  address: string;
  city: string;
  locality: string;
  lat: number;
  lng: number;
  price: number; // per month
  deposit: number;
  roomType: RoomType;
  sharingType: SharingType;
  genderPref: GenderPref;
  furnishingStatus: FurnishingStatus;
  isAC: boolean;
  amenities: string[];
  hasMess: boolean;
  hasTiffin: boolean;
  hasCurfew: boolean;
  curfewTime?: string;
  visitorAllowed: boolean;
  images: string[];
  rating: number;
  reviewCount: number;
  tags: string[];
  available: boolean;
  postedAt: string;
  verified?: boolean;
  featured?: boolean;
}

export interface Review {
  id: string;
  listingId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  userCollege?: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}

export interface Complaint {
  id: string;
  userId: string;
  userName: string;
  listingId?: string;
  listingName?: string;
  type: "listing" | "platform";
  subject: string;
  description: string;
  status: "Pending" | "Under Review" | "Resolved" | "Closed";
  createdAt: string;
  updatedAt: string;
}

export interface Inquiry {
  id: string;
  listingId: string;
  listingTitle: string;
  studentId: string;
  studentName: string;
  message: string;
  date: string;
  status: "Unread" | "Read" | "Replied";
}

export interface RoommateProfile {
  id: string;
  name: string;
  avatar?: string;
  age: number;
  gender: string;
  college: string;
  city: string;
  budget: number;
  habits: string[];
  lookingFor: RoomType;
  bio: string;
  compatibility: number; // 0-100
}
