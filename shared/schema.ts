import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const gameProfiles = pgTable("game_profiles", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  age: integer("age").notNull(),
  gender: text("gender").notNull(),
  money: integer("money").default(1000),
  inventory: text("inventory").default("{}"), // JSON string
  garden: text("garden").default("[]"), // JSON string
  gear: text("gear").default("[]"), // JSON string
  usedCodes: text("used_codes").default("[]"), // JSON string
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertGameProfileSchema = createInsertSchema(gameProfiles).pick({
  firstName: true,
  lastName: true,
  age: true,
  gender: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertGameProfile = z.infer<typeof insertGameProfileSchema>;
export type GameProfile = typeof gameProfiles.$inferSelect;
