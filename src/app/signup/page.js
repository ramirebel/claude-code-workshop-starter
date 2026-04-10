"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { GENDERS, signupSchema } from "@/lib/validations/auth";
import { AuthShell } from "@/components/auth/AuthShell";
import { FieldError } from "@/components/auth/FieldError";

const inputClass =
  "mt-1.5 block w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

const selectClass =
  "mt-1.5 block w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

export default function SignupPage() {
  const router = useRouter();
  const [formError, setFormError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      gender: "",
      birthday: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values) {
    setFormError("");
    setInfoMessage("");
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: values.email.trim(),
      password: values.password,
      options: {
        data: {
          full_name: values.full_name.trim(),
          phone: values.phone.trim(),
          gender: values.gender,
          birthday: values.birthday,
        },
      },
    });

    if (error) {
      setFormError(error.message);
      return;
    }

    if (data.session) {
      router.push("/");
      router.refresh();
      return;
    }

    setInfoMessage(
      "Check your email to confirm your account, then you can log in. Your profile will be created after confirmation."
    );
  }

  return (
    <AuthShell
      title="Create an account"
      subtitle="We’ll save your profile after you sign up."
      footer={
        <>
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {formError ? (
          <p
            className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            role="alert"
          >
            {formError}
          </p>
        ) : null}
        {infoMessage ? (
          <p
            className="rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-muted-foreground"
            role="status"
          >
            {infoMessage}
          </p>
        ) : null}

        <div>
          <label
            htmlFor="signup-full_name"
            className="text-sm font-medium text-foreground"
          >
            Full name
          </label>
          <input
            id="signup-full_name"
            type="text"
            autoComplete="name"
            className={inputClass}
            {...register("full_name")}
          />
          <FieldError message={errors.full_name?.message} />
        </div>

        <div>
          <label
            htmlFor="signup-email"
            className="text-sm font-medium text-foreground"
          >
            Email
          </label>
          <input
            id="signup-email"
            type="email"
            autoComplete="email"
            className={inputClass}
            {...register("email")}
          />
          <FieldError message={errors.email?.message} />
        </div>

        <div>
          <label
            htmlFor="signup-phone"
            className="text-sm font-medium text-foreground"
          >
            Phone
          </label>
          <input
            id="signup-phone"
            type="tel"
            autoComplete="tel"
            placeholder="+1 555 123 4567"
            className={inputClass}
            {...register("phone")}
          />
          <FieldError message={errors.phone?.message} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="signup-gender"
              className="text-sm font-medium text-foreground"
            >
              Gender
            </label>
            <select id="signup-gender" className={selectClass} {...register("gender")}>
              <option value="">Select…</option>
              {GENDERS.map((g) => (
                <option key={g.value} value={g.value}>
                  {g.label}
                </option>
              ))}
            </select>
            <FieldError message={errors.gender?.message} />
          </div>
          <div>
            <label
              htmlFor="signup-birthday"
              className="text-sm font-medium text-foreground"
            >
              Birthday
            </label>
            <input
              id="signup-birthday"
              type="date"
              className={inputClass}
              {...register("birthday")}
            />
            <FieldError message={errors.birthday?.message} />
          </div>
        </div>

        <div>
          <label
            htmlFor="signup-password"
            className="text-sm font-medium text-foreground"
          >
            Password
          </label>
          <input
            id="signup-password"
            type="password"
            autoComplete="new-password"
            className={inputClass}
            {...register("password")}
          />
          <FieldError message={errors.password?.message} />
        </div>

        <div>
          <label
            htmlFor="signup-confirmPassword"
            className="text-sm font-medium text-foreground"
          >
            Confirm password
          </label>
          <input
            id="signup-confirmPassword"
            type="password"
            autoComplete="new-password"
            className={inputClass}
            {...register("confirmPassword")}
          />
          <FieldError message={errors.confirmPassword?.message} />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-lg bg-primary text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-50"
        >
          {isSubmitting ? "Creating account…" : "Sign up"}
        </button>
      </form>
    </AuthShell>
  );
}
