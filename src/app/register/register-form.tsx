"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { accountSetupInput } from "@/modules/identity/domain/registration";
import type { Locale } from "@/modules/i18n/messages";
import { PasswordInput } from "@/components/password-input";
import { legalUrls, PRIVACY_NOTICE_VERSION, TERMS_VERSION } from "@/lib/legal";

const copy = {
  EN: {
    title: "Create your account", intro: "Start with your account details, then tell us about your store.",
    email: "Email address", password: "Password", confirm: "Confirm password", passwordHint: "Use at least 10 characters.",
    continue: "Continue to store setup", existing: "Already have an account?", signIn: "Sign in",
    check: "Check the highlighted details.", emailError: "Enter a valid email address.", passwordError: "Use at least 10 characters for your password.", confirmError: "The passwords do not match.",
    legalPrefix: "I agree to the", terms: "Terms of Service", legalMiddle: "and acknowledge the", privacy: "Privacy Policy", legalError: "You need to agree to the Terms and acknowledge the Privacy Policy to create an account.",
  },
  FIL: {
    title: "Gumawa ng account", intro: "Ilagay muna ang detalye ng account, pagkatapos ay ang tungkol sa iyong tindahan.",
    email: "Email address", password: "Password", confirm: "Ulitin ang password", passwordHint: "Gumamit ng hindi bababa sa 10 character.",
    continue: "Magpatuloy sa pag-set up ng tindahan", existing: "May account ka na?", signIn: "Mag-sign in",
    check: "Ayusin ang mga naka-highlight na detalye.", emailError: "Maglagay ng wastong email address.", passwordError: "Gumamit ng hindi bababa sa 10 character para sa password.", confirmError: "Hindi magkatugma ang mga password.",
    legalPrefix: "Sumasang-ayon ako sa", terms: "Terms of Service", legalMiddle: "at nabasa ko ang", privacy: "Privacy Policy", legalError: "Kailangan mong sumang-ayon sa Terms at kilalanin ang Privacy Policy para gumawa ng account.",
  },
} as const;

type Errors = { email?: string; password?: string; confirmPassword?: string; legalAccepted?: string };

export function RegisterForm({ locale }: { locale: Locale }) {
  const router = useRouter();
  const text = copy[locale];
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const legalAccepted = form.get("legalAccepted") === "on";
    const result = accountSetupInput.safeParse({
      email: form.get("email"),
      password: form.get("password"),
      confirmPassword: form.get("confirmPassword"),
    });
    if (!result.success || !legalAccepted) {
      const fields = result.success ? {} : result.error.flatten().fieldErrors;
      const nextErrors: Errors = {
        email: "email" in fields && fields.email ? text.emailError : undefined,
        password: "password" in fields && fields.password ? text.passwordError : undefined,
        confirmPassword: "confirmPassword" in fields && fields.confirmPassword ? text.confirmError : undefined,
        legalAccepted: legalAccepted ? undefined : text.legalError,
      };
      setErrors(nextErrors);
      setError(text.check);
      const focusId = nextErrors.email ? "register-email" : nextErrors.password ? "register-password" : nextErrors.confirmPassword ? "register-confirm-password" : "register-legal";
      document.getElementById(focusId)?.focus();
      return;
    }

    sessionStorage.setItem("tindahan-setup-credentials", JSON.stringify({
      email: result.data.email,
      password: result.data.password,
      legalAcceptance: {
        accepted: true,
        termsVersion: TERMS_VERSION,
        privacyVersion: PRIVACY_NOTICE_VERSION,
      },
    }));
    router.push("/onboarding");
  }

  const clear = (field: keyof Errors) => setErrors(current => ({ ...current, [field]: undefined }));
  return <><h1 style={{ marginBottom: "var(--space-2)" }}>{text.title}</h1><p className="text-muted" style={{ marginBottom: "var(--space-6)" }}>{text.intro}</p><form className="auth-form" onSubmit={submit}>{error && <p className="form-alert" role="alert">{error}</p>}<div className="field"><label className="field-label" htmlFor="register-email">{text.email}</label><input className={`input${errors.email ? " has-error" : ""}`} id="register-email" name="email" type="email" placeholder="you@example.com" autoComplete="email" required aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "register-email-error" : undefined} onChange={() => clear("email")}/>{errors.email && <span className="field-error" id="register-email-error">{errors.email}</span>}</div><div className="field"><label className="field-label" htmlFor="register-password">{text.password}</label><PasswordInput className={`input${errors.password ? " has-error" : ""}`} id="register-password" name="password" placeholder="••••••••" autoComplete="new-password" required maxLength={128} aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? "register-password-error" : "register-password-hint"} onChange={() => clear("password")} locale={locale}/>{errors.password ? <span className="field-error" id="register-password-error">{errors.password}</span> : <span className="field-hint" id="register-password-hint">{text.passwordHint}</span>}</div><div className="field"><label className="field-label" htmlFor="register-confirm-password">{text.confirm}</label><PasswordInput className={`input${errors.confirmPassword ? " has-error" : ""}`} id="register-confirm-password" name="confirmPassword" placeholder="••••••••" autoComplete="new-password" required maxLength={128} aria-invalid={Boolean(errors.confirmPassword)} aria-describedby={errors.confirmPassword ? "register-confirm-error" : undefined} onChange={() => clear("confirmPassword")} locale={locale}/>{errors.confirmPassword && <span className="field-error" id="register-confirm-error">{errors.confirmPassword}</span>}</div><div className="field"><label htmlFor="register-legal" style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-2)", cursor: "pointer", fontSize: "var(--text-sm)", lineHeight: 1.55 }}><input id="register-legal" name="legalAccepted" type="checkbox" required aria-invalid={Boolean(errors.legalAccepted)} aria-describedby={errors.legalAccepted ? "register-legal-error" : undefined} onChange={() => clear("legalAccepted")} style={{ marginTop: 3 }}/><span>{text.legalPrefix} <a href={legalUrls.terms} target="_blank" rel="noreferrer" style={{ color: "var(--color-brand-primary)", fontWeight: "var(--weight-semibold)", textDecoration: "underline" }}>{text.terms}</a> {text.legalMiddle} <a href={legalUrls.privacy} target="_blank" rel="noreferrer" style={{ color: "var(--color-brand-primary)", fontWeight: "var(--weight-semibold)", textDecoration: "underline" }}>{text.privacy}</a>.</span></label>{errors.legalAccepted && <span className="field-error" id="register-legal-error">{errors.legalAccepted}</span>}</div><button className="btn btn-primary btn-lg btn-block" type="submit">{text.continue}</button></form><p className="text-sm text-muted" style={{ textAlign: "center", marginTop: "var(--space-6)" }}>{text.existing} <Link href="/sign-in" style={{ color: "var(--color-brand-primary)", fontWeight: "var(--weight-semibold)" }}>{text.signIn}</Link></p><p className="text-sm text-faint" style={{ textAlign: "center", marginTop: "var(--space-3)" }}><a href={legalUrls.privacy} target="_blank" rel="noreferrer">Privacy</a> · <a href={legalUrls.terms} target="_blank" rel="noreferrer">Terms</a> · <a href={legalUrls.cookies} target="_blank" rel="noreferrer">Cookies</a></p></>;
}
