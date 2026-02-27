import {
  pgTable,
  pgEnum,
  text,
  timestamp,
  boolean,
  uuid,
  date,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─── Enums ────────────────────────────────────────────────────────────────────

export const propertyTypeEnum = pgEnum("property_type", [
  "hotel",
  "guesthouse",
  "rental",
  "other",
]);

export const genderEnum = pgEnum("gender", ["male", "female", "other"]);

// ─── Users ────────────────────────────────────────────────────────────────────
// Synced from Clerk via webhook — clerkId is the primary key

export const users = pgTable("users", {
  id: text("id").primaryKey(), // Clerk user ID (user_...)
  email: text("email").notNull().unique(),
  name: text("name"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── Properties ───────────────────────────────────────────────────────────────

export const properties = pgTable("properties", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  address: text("address"),
  city: text("city"),
  type: propertyTypeEnum("type").notNull().default("guesthouse"),
  phone: text("phone"),
  email: text("email"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── Check-in Links ───────────────────────────────────────────────────────────

export const checkinLinks = pgTable("checkin_links", {
  id: uuid("id").primaryKey().defaultRandom(),
  propertyId: uuid("property_id")
    .notNull()
    .references(() => properties.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(), // nanoid(21)
  label: text("label"), // e.g. "Summer 2025" or "Room 12"
  isActive: boolean("is_active").notNull().default(true),
  expiresAt: timestamp("expires_at"), // null = never expires
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ─── Guest Registrations ──────────────────────────────────────────────────────

export const guestRegistrations = pgTable("guest_registrations", {
  id: uuid("id").primaryKey().defaultRandom(),
  checkinLinkId: uuid("checkin_link_id")
    .notNull()
    .references(() => checkinLinks.id, { onDelete: "restrict" }),
  propertyId: uuid("property_id")
    .notNull()
    .references(() => properties.id, { onDelete: "restrict" }),

  // Identity
  fullName: text("full_name").notNull(),
  nationality: text("nationality").notNull(),
  passportNumber: text("passport_number").notNull(),
  passportExpiry: date("passport_expiry").notNull(),
  dateOfBirth: date("date_of_birth").notNull(),
  gender: genderEnum("gender").notNull(),

  // Contact
  phone: text("phone").notNull(),
  email: text("email"),

  // Stay
  arrivalDate: date("arrival_date").notNull(),
  departureDate: date("departure_date").notNull(),
  roomNumber: text("room_number"),

  // Document (Vercel Blob)
  passportPhotoUrl: text("passport_photo_url"),
  passportPhotoKey: text("passport_photo_key"), // Blob pathname

  // Meta
  ipAddress: text("ip_address"),
  submittedAt: timestamp("submitted_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ─── Relations ────────────────────────────────────────────────────────────────

export const usersRelations = relations(users, ({ many }) => ({
  properties: many(properties),
}));

export const propertiesRelations = relations(properties, ({ one, many }) => ({
  user: one(users, { fields: [properties.userId], references: [users.id] }),
  checkinLinks: many(checkinLinks),
  guestRegistrations: many(guestRegistrations),
}));

export const checkinLinksRelations = relations(checkinLinks, ({ one, many }) => ({
  property: one(properties, {
    fields: [checkinLinks.propertyId],
    references: [properties.id],
  }),
  guestRegistrations: many(guestRegistrations),
}));

export const guestRegistrationsRelations = relations(
  guestRegistrations,
  ({ one }) => ({
    checkinLink: one(checkinLinks, {
      fields: [guestRegistrations.checkinLinkId],
      references: [checkinLinks.id],
    }),
    property: one(properties, {
      fields: [guestRegistrations.propertyId],
      references: [properties.id],
    }),
  })
);

// ─── Types ────────────────────────────────────────────────────────────────────

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Property = typeof properties.$inferSelect;
export type NewProperty = typeof properties.$inferInsert;
export type CheckinLink = typeof checkinLinks.$inferSelect;
export type NewCheckinLink = typeof checkinLinks.$inferInsert;
export type GuestRegistration = typeof guestRegistrations.$inferSelect;
export type NewGuestRegistration = typeof guestRegistrations.$inferInsert;
