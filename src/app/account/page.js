import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Account",
};

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/account");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "full_name, email, phone, gender, birthday, created_at"
    )
    .eq("id", user.id)
    .maybeSingle();

  const meta = user?.user_metadata ?? {};

  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        Account
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Signed in as{" "}
        <span className="font-medium text-foreground">{user.email}</span>
      </p>

      <dl className="mt-8 space-y-4 rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Full name
          </dt>
          <dd className="mt-1 text-sm">
            {profile?.full_name ?? meta.full_name ?? "—"}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Phone
          </dt>
          <dd className="mt-1 text-sm">{profile?.phone ?? meta.phone ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Gender
          </dt>
          <dd className="mt-1 text-sm">
            {profile?.gender ?? meta.gender ?? "—"}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Birthday
          </dt>
          <dd className="mt-1 text-sm">
            {profile?.birthday ?? meta.birthday ?? "—"}
          </dd>
        </div>
      </dl>

      <p className="mt-8 text-sm text-muted-foreground">
        <Link
          href="/"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          ← Back to home
        </Link>
      </p>
    </div>
  );
}
