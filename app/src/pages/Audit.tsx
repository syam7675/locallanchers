import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  LoaderCircle,
  Copy,
  ShieldCheck,
} from "lucide-react";
import { validateAudit, type AuditInput } from "../../shared/audit";
import { Reveal } from "../components/ui";
const blank: AuditInput = {
  name: "",
  businessName: "",
  email: "",
  phone: "",
  vertical: "",
  city: "",
  website: "",
  challenge: "",
  plan: "Not sure yet",
  contactPermission: false,
  marketingConsent: false,
  companyWebsite: "",
};
export default function Audit() {
  const [q] = useSearchParams();
  const [data, setData] = useState<AuditInput>(() => ({
    ...blank,
    plan: q.get("plan") || "Not sure yet",
    vertical: q.get("industry") || "",
  }));
  const [step, setStep] = useState(0),
    [errors, setErrors] = useState<Record<string, string>>({}),
    [busy, setBusy] = useState(false),
    [result, setResult] = useState<{
      reference: string;
      createdAt: string;
    } | null>(null),
    [copied, setCopied] = useState(false);
  const key = useRef(crypto.randomUUID());
  const snapshot = useRef("");
  const title = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    title.current?.focus({ preventScroll: true });
  }, [step, result]);
  const set = (name: keyof AuditInput, value: string | boolean) => {
    setData((d) => ({ ...d, [name]: value }));
    setErrors((e) => ({ ...e, [name]: "", form: "" }));
  };
  const input = (
    name: keyof AuditInput,
    label: string,
    options: {
      type?: string;
      placeholder?: string;
      required?: boolean;
      autoComplete?: string;
    } = {},
  ) => (
    <label className="field" key={name} htmlFor={`audit-${name}`}>
      <span>
        {label}
        {options.required && <span aria-hidden="true"> *</span>}
      </span>
      <input
        id={`audit-${name}`}
        name={name}
        type={options.type || "text"}
        value={String(data[name] || "")}
        autoComplete={options.autoComplete}
        maxLength={name === "website" ? 500 : name === "email" ? 254 : 160}
        required={options.required}
        aria-invalid={!!errors[name]}
        aria-describedby={errors[name] ? `error-${name}` : undefined}
        placeholder={options.placeholder}
        onChange={(e) => set(name, e.target.value)}
      />
      {errors[name] && (
        <span className="field-error" id={`error-${name}`}>
          {errors[name]}
        </span>
      )}
    </label>
  );
  function next() {
    const checked = validateAudit(data);
    const keys =
      step === 0
        ? ["businessName", "vertical", "city", "website", "challenge"]
        : ["name", "email", "phone", "contactPermission"];
    const found = Object.fromEntries(
      Object.entries(checked.errors).filter(([k]) => keys.includes(k)),
    );
    setErrors(found);
    if (Object.keys(found).length) {
      requestAnimationFrame(() =>
        document.getElementById(`audit-${Object.keys(found)[0]}`)?.focus(),
      );
      return;
    }
    setStep(step + 1);
  }
  async function submit() {
    const check = validateAudit(data);
    if (!check.value) {
      setErrors(check.errors);
      setStep(
        check.errors.businessName ||
          check.errors.city ||
          check.errors.vertical ||
          check.errors.website
          ? 0
          : 1,
      );
      return;
    }
    const payload = JSON.stringify(data);
    if (snapshot.current && snapshot.current !== payload)
      key.current = crypto.randomUUID();
    snapshot.current = payload;
    setBusy(true);
    setErrors({});
    try {
      const response = await fetch("/api/audits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": key.current,
        },
        body: JSON.stringify(data),
      });
      const body = await response.json();
      if (!response.ok) {
        setErrors(
          body.errors || {
            form:
              body.error || "Your request could not be saved. Please retry.",
          },
        );
        return;
      }
      setResult(body);
    } catch {
      setErrors({
        form: "We couldn’t confirm that your request was saved. Your details are still here. Check your connection and retry.",
      });
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="audit-page container">
      <div className="audit-intro">
        <p className="eyebrow">LET’S FIND YOUR OPPORTUNITIES</p>
        <h1>
          A clearer picture.
          <br />A better next step.
        </h1>
        <p className="lede">
          Tell us a little about your business. We’ll use it to prepare a
          thoughtful conversation about your growth journey.
        </p>
        <ul className="audit-benefits">
          {[
            "Visibility: how customers discover you",
            "Trust: the information that helps them decide",
            "Conversion: the path from interest to enquiry",
            "Retention: the next step after a first visit",
          ].map((s) => (
            <li key={s}>
              <Check size={18} />
              {s}
            </li>
          ))}
        </ul>
        <div className="audit-expectations">
          <ShieldCheck size={23} />
          <p>
            This is a request for a human-reviewed audit. It doesn’t run an
            automated Google scan or book an appointment.
          </p>
        </div>
        <Link to="/how-it-works" className="text-link">
          What happens next?
          <ArrowRight size={16} />
        </Link>
      </div>
      <div className="audit-form-panel">
        {result ? (
          <div className="audit-success" role="status">
            <CheckCircle2 size={45} />
            <p className="eyebrow">SAVED SUCCESSFULLY</p>
            <h2 ref={title} tabIndex={-1}>
              Your next chapter starts here.
            </h2>
            <p>
              Your audit request for <strong>{data.businessName}</strong> is
              saved in the team’s request queue.
            </p>
            <div className="reference">
              <span>YOUR REQUEST REFERENCE</span>
              <strong>{result.reference}</strong>
              <button
                className="text-link"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(result.reference);
                    setCopied(true);
                  } catch {
                    setCopied(false);
                  }
                }}
              >
                <Copy size={15} />
                {copied ? "Copied" : "Copy reference"}
              </button>
            </div>
            <p>
              No appointment has been booked. The team can review your request
              and reply using the contact details you provided.
            </p>
            <Link className="button" to="/growth">
              Explore the growth system
              <ArrowRight size={16} />
            </Link>
            <button
              className="text-link"
              onClick={() => {
                setResult(null);
                setData({ ...blank });
                setStep(0);
                key.current = crypto.randomUUID();
                snapshot.current = "";
              }}
            >
              Request for another business
            </button>
          </div>
        ) : (
          <>
            <div className="form-progress" aria-label={`Step ${step + 1} of 3`}>
              {["Your business", "Your details", "Review"].map((s, i) => (
                <div
                  key={s}
                  className={i === step ? "current" : i < step ? "done" : ""}
                >
                  <span>{i < step ? <Check size={13} /> : i + 1}</span>
                  <strong>{s}</strong>
                </div>
              ))}
            </div>
            <h2 tabIndex={-1} ref={title}>
              {
                [
                  "Start with your business.",
                  "How can we reach you?",
                  "A quick check before we begin.",
                ][step]
              }
            </h2>
            <p className="form-description">
              {
                [
                  "The essentials help us understand your local customer journey.",
                  "Add an email address or phone number. Your preferred route to a conversation.",
                  "Your request will be saved for the team to review.",
                ][step]
              }
            </p>
            <form
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                step < 2 ? next() : submit();
              }}
            >
              {step === 0 && (
                <div className="form-fields">
                  {input("businessName", "Business name", {
                    required: true,
                    autoComplete: "organization",
                    placeholder: "Your business name",
                  })}
                  <div className="field-row">
                    <label className="field" htmlFor="audit-vertical">
                      <span>Business type *</span>
                      <select
                        id="audit-vertical"
                        required
                        value={data.vertical}
                        onChange={(e) => set("vertical", e.target.value)}
                        aria-invalid={!!errors.vertical}
                        aria-describedby={
                          errors.vertical ? "error-vertical" : undefined
                        }
                      >
                        <option value="">Choose your business type</option>
                        {[
                          "Dental clinics",
                          "Salons & spas",
                          "Fitness studios",
                          "Medical clinics",
                          "Coaching centres",
                          "Auto services",
                          "Home services",
                          "Other local business",
                        ].map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                      {errors.vertical && (
                        <span className="field-error" id="error-vertical">
                          {errors.vertical}
                        </span>
                      )}
                    </label>
                    {input("city", "City or area", {
                      required: true,
                      placeholder: "e.g. Hyderabad",
                      autoComplete: "address-level2",
                    })}
                  </div>
                  {input("website", "Website (optional)", {
                    type: "url",
                    placeholder: "https://yourbusiness.in",
                    autoComplete: "url",
                  })}
                  <label className="field" htmlFor="audit-challenge">
                    <span>What would you most like to improve?</span>
                    <textarea
                      id="audit-challenge"
                      maxLength={1500}
                      rows={3}
                      value={data.challenge}
                      onChange={(e) => set("challenge", e.target.value)}
                      placeholder="Being found locally, responding to enquiries, repeat visits…"
                    />
                    {errors.challenge && (
                      <span className="field-error">{errors.challenge}</span>
                    )}
                  </label>
                  <label className="field" htmlFor="audit-plan">
                    <span>Plan you’re considering</span>
                    <select
                      id="audit-plan"
                      value={data.plan}
                      onChange={(e) => set("plan", e.target.value)}
                    >
                      {[
                        "Not sure yet",
                        "Launch",
                        "Growth",
                        "Growth Partner",
                      ].map((p) => (
                        <option key={p}>{p}</option>
                      ))}
                    </select>
                  </label>
                  <label className="honeypot" aria-hidden="true">
                    Leave this empty
                    <input
                      tabIndex={-1}
                      autoComplete="off"
                      value={data.companyWebsite}
                      onChange={(e) => set("companyWebsite", e.target.value)}
                    />
                  </label>
                </div>
              )}
              {step === 1 && (
                <div className="form-fields">
                  {input("name", "Your name", {
                    required: true,
                    autoComplete: "name",
                    placeholder: "Your full name",
                  })}
                  {input("email", "Email address", {
                    type: "email",
                    autoComplete: "email",
                    placeholder: "you@yourbusiness.in",
                  })}
                  {input("phone", "Phone or WhatsApp number", {
                    type: "tel",
                    autoComplete: "tel",
                    placeholder: "+91 followed by your number",
                  })}
                  <p className="field-help">
                    One reply channel is required. Adding a number does not
                    activate automated WhatsApp messaging.
                  </p>
                  <label className="checkbox-field">
                    <input
                      id="audit-contactPermission"
                      type="checkbox"
                      checked={data.contactPermission}
                      aria-invalid={!!errors.contactPermission}
                      aria-describedby={
                        errors.contactPermission
                          ? "error-contactPermission"
                          : undefined
                      }
                      onChange={(e) =>
                        set("contactPermission", e.target.checked)
                      }
                    />
                    <span>
                      I agree to be contacted about this audit request and have
                      read the{" "}
                      <Link to="/privacy" target="_blank" rel="noreferrer">
                        request privacy notice
                      </Link>
                      . *
                    </span>
                  </label>
                  {errors.contactPermission && (
                    <p id="error-contactPermission" className="field-error">
                      {errors.contactPermission}
                    </p>
                  )}
                  <label className="checkbox-field">
                    <input
                      type="checkbox"
                      checked={data.marketingConsent}
                      onChange={(e) =>
                        set("marketingConsent", e.target.checked)
                      }
                    />
                    <span>
                      I’d also like occasional Local Lanchers updates. Optional.
                    </span>
                  </label>
                  <p className="field-help">
                    Please don’t include patient records, passwords or other
                    sensitive customer information.
                  </p>
                </div>
              )}
              {step === 2 && (
                <div className="review-details">
                  <dl>
                    {[
                      ["Business", data.businessName],
                      ["Industry", data.vertical],
                      ["City / area", data.city],
                      ["Website", data.website || "Not provided"],
                      ["Your name", data.name],
                      [
                        "Reply details",
                        [data.email, data.phone].filter(Boolean).join(" / "),
                      ],
                      ["Interested in", data.plan],
                      [
                        "Your priority",
                        data.challenge || "To discuss together",
                      ],
                      [
                        "Marketing updates",
                        data.marketingConsent ? "Opted in" : "Not opted in",
                      ],
                    ].map(([a, b]) => (
                      <div key={a}>
                        <dt>{a}</dt>
                        <dd>{b}</dd>
                      </div>
                    ))}
                  </dl>
                  <p>
                    Submitting sends your details to the request queue. The next
                    conversation and any work are agreed separately.
                  </p>
                </div>
              )}
              {errors.form && (
                <p role="alert" className="error-banner">
                  {errors.form}
                </p>
              )}
              <div className="form-actions">
                {step > 0 && (
                  <button
                    type="button"
                    className="button outline"
                    disabled={busy}
                    onClick={() => {
                      setStep(step - 1);
                      setErrors({});
                    }}
                  >
                    <ArrowLeft size={16} />
                    Back
                  </button>
                )}
                <button className="button" type="submit" disabled={busy}>
                  {busy ? (
                    <>
                      <LoaderCircle size={17} className="spin" />
                      Saving your request…
                    </>
                  ) : step < 2 ? (
                    <>
                      Continue
                      <ArrowRight size={17} />
                    </>
                  ) : (
                    <>
                      Save my audit request
                      <ArrowRight size={17} />
                    </>
                  )}
                </button>
              </div>
            </form>
            <p className="form-footer">
              No payment details. No instant growth claims. Just a useful place
              to start.
            </p>
          </>
        )}
      </div>
    </section>
  );
}
