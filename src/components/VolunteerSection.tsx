const volunteerWork = [
  {
    role: "Co-Founder",
    organization: "AI Community",
    url: "https://ai-community-gap.vercel.app/",
    description:
      "Co-founded an AI community hosting weekly meetups, talks, and events on LLMs, RAG, multi-agent systems, and cutting-edge AI research. Building a vibrant space for AI enthusiasts, researchers, and innovators to learn and collaborate.",
    highlights: [
      "Organized regular AI Talks series featuring leading researchers and practitioners",
      "Curated events covering machine learning, NLP, and computer vision topics",
      "Growing community of AI enthusiasts exploring the frontiers of artificial intelligence",
    ],
  },
  {
    role: "Co-Founder",
    organization: "Cassandra AI Group",
    url: "https://www.youtube.com/@cassandraai",
    description:
      "Co-founded Cassandra AI Group focused on academic workshops and educational content around artificial intelligence, making AI knowledge accessible through structured learning sessions.",
    highlights: [
      "Produced educational AI content on YouTube",
      "Hosted academic workshops on AI fundamentals and advanced topics",
      "Created a platform for knowledge sharing in the AI space",
    ],
  },
];

const VolunteerSection = () => {
  return (
    <section id="volunteer" className="section-padding bg-surface">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Volunteer <span className="text-gradient">Work</span>
        </h2>
        <div className="h-1 w-16 bg-primary rounded-full mb-12" />

        <div className="space-y-8">
          {volunteerWork.map((item) => (
            <div
              key={item.organization}
              className="p-6 rounded-xl border border-border bg-card hover:border-glow transition-colors"
            >
              <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {item.role}
                  </h3>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    {item.organization} ↗
                  </a>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {item.description}
              </p>

              <ul className="space-y-2">
                {item.highlights.map((h, j) => (
                  <li
                    key={j}
                    className="text-sm text-muted-foreground flex gap-2"
                  >
                    <span className="text-primary mt-1 shrink-0">▹</span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VolunteerSection;
