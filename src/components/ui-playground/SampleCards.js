export function SampleCards() {
  const items = [
    {
      title: "Typography",
      body: "Tweak --font-sans and tracking in globals.css to see changes here.",
    },
    {
      title: "Radius",
      body: "Cards use rounded-xl; --radius in :root controls the scale.",
    },
    {
      title: "Shadow",
      body: "shadow-md uses your theme shadow tokens from @theme inline.",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map(({ title, body }) => (
        <article
          key={title}
          className="flex flex-col gap-2 rounded-xl border border-border bg-card p-5 text-card-foreground shadow-md"
        >
          <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
        </article>
      ))}
    </div>
  );
}
