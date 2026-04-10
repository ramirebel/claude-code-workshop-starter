import { createClient } from "@/lib/supabase/server";
import { HomeClient } from "@/components/HomeClient";

export default async function Home() {
  const supabase = await createClient();
  const { data: events } = await supabase
    .from("events")
    .select("*, sports(name, type)")
    .order("created_at", { ascending: false });

  return <HomeClient events={events ?? []} />;
}
