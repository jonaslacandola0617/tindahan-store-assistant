import { z } from "zod";
import { PRIVACY_NOTICE_VERSION, TERMS_VERSION } from "@/lib/legal";

export const legalAcceptanceInput = z.object({
  accepted: z.literal(true),
  termsVersion: z.literal(TERMS_VERSION),
  privacyVersion: z.literal(PRIVACY_NOTICE_VERSION),
});

export const setupCredentialsInput = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(10).max(128),
});

export const accountSetupInput = setupCredentialsInput.extend({
  confirmPassword: z.string(),
}).superRefine((value, context) => {
  if (value.password !== value.confirmPassword) {
    context.addIssue({ code: "custom", path: ["confirmPassword"], message: "Passwords do not match." });
  }
});

export const registrationInput = setupCredentialsInput.extend({
  name: z.string().trim().min(2).max(80),
  legalAcceptance: legalAcceptanceInput.optional(),
});
