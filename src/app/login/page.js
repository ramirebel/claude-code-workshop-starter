"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { loginSchema } from "@/lib/validations/auth";
import { AuthShell } from "@/components/auth/AuthShell";
import { FieldError } from "@/components/auth/FieldError";
import { useState } from "react";

const inputClass =
  "mt-1.5 block w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

export default function LoginPage() {
  const router = useRouter();
  const [formError, setFormError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values) {
    setFormError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email.trim(),
      password: values.password,
    });
    if (error) {
      setFormError(error.message);
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <AuthShell
      title="Log in"
      subtitle="Use the email and password for your account."
      footer={
        <>
          No account?{" "}
          <Link
            href="/signup"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Sign up
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        {formError ? (
          <p
            className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            role="alert"
          >
            {formError}
          </p>
        ) : null}

        <div>
          <label
            htmlFor="login-email"
            className="text-sm font-medium text-foreground"
          >
            Email
          </label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            className={inputClass}
            {...register("email")}
          />
          <FieldError message={errors.email?.message} />
        </div>

        <div>
          <label
            htmlFor="login-password"
            className="text-sm font-medium text-foreground"
          >
            Password
          </label>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            className={inputClass}
            {...register("password")}
          />
          <FieldError message={errors.password?.message} />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-lg bg-primary text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-50"
        >
          {isSubmitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </AuthShell>
  );
}
