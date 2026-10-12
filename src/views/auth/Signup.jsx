import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ArrowLeft, MailCheck } from "lucide-react";
import AuthLayout from "./AuthLayout";
import PasswordInput from "./PasswordInput";
import Button from "../../components/ui/Button";
import { request } from "../../lib/api";
import cn from "../../lib/cn";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Field = ({ id, label, error, children }) => (
  <div>
    <label htmlFor={id} className="label">
      {label}
    </label>
    {children}
    {error && <p className="field-error">{error.message}</p>}
  </div>
);

const DetailsStep = ({ defaultValues, onSent }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues });

  const onSubmit = async (values) => {
    const details = {
      name: values.name.trim(),
      designation: values.designation.trim(),
      email: values.email.trim().toLowerCase(),
      password: values.password,
    };
    try {
      await request({ method: "post", url: "/user/register", data: details });
      toast.success(`We sent a verification code to ${details.email}`);
      onSent(details);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <Field id="name" label="Full name" error={errors.name}>
        <input
          id="name"
          autoComplete="name"
          placeholder="Ada Lovelace"
          className={cn("input", errors.name && "input-error")}
          {...register("name", {
            validate: (v) => v.trim().length > 0 || "Enter your name.",
            maxLength: { value: 60, message: "Use 60 characters or fewer." },
          })}
        />
      </Field>
      <Field id="designation" label="Role" error={errors.designation}>
        <input
          id="designation"
          autoComplete="organization-title"
          placeholder="Full stack developer"
          className={cn("input", errors.designation && "input-error")}
          {...register("designation", {
            validate: (v) => v.trim().length > 0 || "Enter your role.",
            maxLength: { value: 60, message: "Use 60 characters or fewer." },
          })}
        />
      </Field>
      <Field id="email" label="Email" error={errors.email}>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className={cn("input", errors.email && "input-error")}
          {...register("email", {
            required: "Enter your email.",
            pattern: { value: EMAIL_PATTERN, message: "Enter a valid email address." },
          })}
        />
      </Field>
      <Field id="password" label="Password" error={errors.password}>
        <PasswordInput
          id="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          invalid={Boolean(errors.password)}
          {...register("password", {
            required: "Create a password.",
            minLength: { value: 8, message: "Use at least 8 characters." },
          })}
        />
      </Field>
      <Button type="submit" loading={isSubmitting} className="w-full" size="lg">
        Create account
      </Button>
    </form>
  );
};

const VerifyStep = ({ details, onEdit }) => {
  const navigate = useNavigate();
  const [resending, setResending] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { otp: "" } });

  const onSubmit = async ({ otp }) => {
    try {
      await request({
        method: "post",
        url: "/user/verify-otp",
        data: { email: details.email, otp: otp.trim() },
      });
      toast.success("Your account is ready. Please log in.");
      navigate("/login");
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Registering again with an unverified email sends a fresh code.
  const resend = async () => {
    setResending(true);
    try {
      await request({ method: "post", url: "/user/register", data: details });
      toast.success("We sent you a new code.");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setResending(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex gap-3 rounded-xl bg-indigo-50 p-4 text-sm text-indigo-900">
        <MailCheck className="size-5 shrink-0 text-indigo-600" />
        <p>
          Enter the code we sent to <span className="font-semibold">{details.email}</span>. It
          expires in 5 minutes. If you can't find it, check your spam folder.
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <Field id="otp" label="Verification code" error={errors.otp}>
          <input
            id="otp"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="123456"
            className={cn("input text-center text-lg tracking-[0.5em]", errors.otp && "input-error")}
            {...register("otp", {
              validate: (v) => v.trim().length > 0 || "Enter the code from your email.",
            })}
          />
        </Field>
        <Button type="submit" loading={isSubmitting} className="w-full" size="lg">
          Verify email
        </Button>
      </form>
      <div className="mt-4 flex items-center justify-between text-sm">
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-1 font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="size-4" />
          Edit details
        </button>
        <button
          type="button"
          onClick={resend}
          disabled={resending}
          className="font-medium text-indigo-600 hover:text-indigo-500 disabled:opacity-50"
        >
          {resending ? "Sending…" : "Resend code"}
        </button>
      </div>
    </div>
  );
};

const Signup = () => {
  const [details, setDetails] = useState(null);
  const [step, setStep] = useState("details");

  return (
    <AuthLayout
      title={step === "details" ? "Create your account" : "Check your email"}
      subtitle={
        step === "details"
          ? "Start coding with your team in minutes."
          : "One last step to verify it's you."
      }
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Log in
          </Link>
        </>
      }
    >
      {step === "details" ? (
        <DetailsStep
          defaultValues={details ?? { name: "", designation: "", email: "", password: "" }}
          onSent={(sent) => {
            setDetails(sent);
            setStep("verify");
          }}
        />
      ) : (
        <VerifyStep details={details} onEdit={() => setStep("details")} />
      )}
    </AuthLayout>
  );
};

export default Signup;
