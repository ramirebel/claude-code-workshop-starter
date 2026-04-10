import { createClient } from "@/lib/supabase/server";
import { HomeClient } from "@/components/HomeClient";

export default async function Home() {
  const supabase = await createClient();
  const { data: events } = await supabase
    .from("events")
    .select("*, sports(name, type), participations(id, user_id)")
    .order("created_at", { ascending: false });

  return <HomeClient events={events ?? []} />;
}
