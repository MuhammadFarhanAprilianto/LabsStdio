import { z } from "zod";

export const createInquirySchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name cannot exceed 100 characters"),
  email: z
    .string()
    .trim()
    .email("Please provide a valid business email address"),
  company: z
    .string()
    .trim()
    .max(120, "Company name cannot exceed 120 characters")
    .optional()
    .or(z.literal("")),
  projectDetails: z
    .string()
    .trim()
    .max(2000, "Project brief details cannot exceed 2000 characters")
    .optional()
    .or(z.literal("")),
  productType: z.string().min(1, "Product type is required"),
  productName: z.string().min(1, "Product name is required"),
  selectedFeatures: z.array(z.string()).default([]),
  velocity: z.enum(["standard", "express"]).default("standard"),
  estimatedPriceMin: z.number().int().nonnegative(),
  estimatedPriceMax: z.number().int().nonnegative(),
  estimatedWeeks: z.number().int().positive(),
});

export type CreateInquiryInput = z.infer<typeof createInquirySchema>;
