const articles = [
  {
    title: "How Are Methods in XAI Evaluated?",
    description:
      "A deep dive into evaluation methodologies for Explainable AI techniques, comparing quantitative and qualitative approaches.",
    url: "https://amindadgar.medium.com/how-are-methods-in-xai-evaluated-b5b3b942e06d",
    tag: "XAI",
  },
  {
    title: "What is Machine Learning Model Interpretation?",
    description:
      "Exploring the fundamentals of model interpretability — why it matters and how practitioners can leverage it for better AI systems.",
    url: "https://amindadgar.medium.com/what-is-machine-learning-model-interpretation-9556c3c247e6",
    tag: "ML",
  },
  {
    title: "Artificial Intelligence is Against Humanity — Wait, What?",
    description:
      "A thoughtful examination of common misconceptions about AI risks, separating fact from fiction in the debate around AI safety.",
    url: "https://amindadgar.medium.com/artificial-intelligence-is-against-humanity-wait-what-c1a8bc934146",
    tag: "AI Ethics",
  },
];

const BlogSection = () => {
  return (
    <section id="blog" className="section-padding">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Writing & <span className="text-gradient">Thoughts</span>
        </h2>
        <div className="h-1 w-16 bg-primary rounded-full mb-12" />

        <div className="space-y-6">
          {articles.map((article) => (
            <a
              key={article.title}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block p-6 rounded-xl border border-border bg-card hover:border-glow hover:glow-sm transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-block px-2.5 py-0.5 text-xs rounded-md bg-primary/10 text-primary font-medium mb-3">
                    {article.tag}
                  </span>
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {article.description}
                  </p>
                </div>
                <svg
                  className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-8 text-center">
          <a
            href="https://amindadgar.medium.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline"
          >
            Read more on Medium →
          </a>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
