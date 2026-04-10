import { z } from "zod";

export const GENDERS = [
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
  { value: "other", label: "Other" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
];

const phoneRegex = /^\+?[\d\s\-().]{8,24}$/;

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const signupSchema = z
  .object({
    full_name: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .max(120, "Full name is too long"),
    email: z.string().min(1, "Email is required").email("Enter a valid email"),
    phone: z
      .string()
      .min(1, "Phone is required")
      .regex(
        phoneRegex,
        "Use a valid phone number (digits, spaces, +, -, parentheses)"
      ),
    gender: z
      .string()
      .min(1, "Select a gender")
      .refine(
        (v) =>
          ["female", "male", "other", "prefer_not_to_say"].includes(v),
        "Select a gender"
      ),
    birthday: z
      .string()
      .min(1, "Birthday is required")
      .refine((val) => !Number.isNaN(Date.parse(val)), "Enter a valid date"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(72, "Password is too long"),
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
