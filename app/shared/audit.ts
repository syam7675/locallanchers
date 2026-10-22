export interface AuditInput {
  name: string;
  businessName: string;
  email: string;
  phone: string;
  vertical: string;
  city: string;
  website: string;
  challenge: string;
  plan: string;
  contactPermission: boolean;
  marketingConsent: boolean;
  companyWebsite?: string;
}
export function validateAudit(raw: unknown): {
  value?: AuditInput;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};
  const obj =
    raw && typeof raw === "object" && !Array.isArray(raw)
      ? (raw as Record<string, unknown>)
      : {};
  const text = (key: string, max: number, required = false) => {
    const v = typeof obj[key] === "string" ? obj[key].trim() : "";
    if (required && !v) errors[key] = "This field is required.";
    if (v.length > max) errors[key] = `Use ${max} characters or fewer.`;
    return v;
  };
  const value: AuditInput = {
    name: text("name", 100, true),
    businessName: text("businessName", 160, true),
    email: text("email", 254),
    phone: text("phone", 30),
    vertical: text("vertical", 80, true),
    city: text("city", 100, true),
    website: text("website", 500),
    challenge: text("challenge", 1500),
    plan: text("plan", 60),
    contactPermission: obj.contactPermission === true,
    marketingConsent: obj.marketingConsent === true,
    companyWebsite: text("companyWebsite", 500),
  };
  if (value.companyWebsite) errors.form = "We could not accept this request.";
  if (!value.email && !value.phone)
    errors.email = "Add an email address or phone number so we can reply.";
  if (value.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email))
    errors.email = "Enter a valid email address.";
  if (
    value.phone &&
    (!/^[+\d\s().-]+$/.test(value.phone) ||
      !/^\d{7,15}$/.test(value.phone.replace(/\D/g, "")))
  )
    errors.phone = "Enter a valid phone number, including the country code.";
  if (value.website) {
    try {
      const url = new URL(value.website);
      if (!["http:", "https:"].includes(url.protocol)) throw new Error();
    } catch {
      errors.website = "Use a full http:// or https:// website address.";
    }
  }
  if (!value.contactPermission)
    errors.contactPermission =
      "Please allow us to reply about your audit request.";
  return Object.keys(errors).length ? { errors } : { value, errors };
}
