export type WritingItem = {
  title: string;
  description: string;
  url: string;
  tag: string;
  platform: string;
  publishedAt: string;
};

export type RecommendationItem = {
  author: string;
  role: string;
  relationship: string;
  dateLabel: string;
  excerpt: string;
  /** One sentence taken verbatim from the excerpt, shown on the homepage. */
  quote: string;
  sourceUrl: string;
  imageUrl?: string;
};

export type EducationItem = {
  degree: string;
  school: string;
  detail: string;
};

export type ExperienceItem = {
  role: string;
  company: string;
  url?: string;
  period: string;
  location: string;
  highlights: string[];
  stack: string[];
};

export type ProjectItem = {
  title: string;
  description: string;
  url: string;
  tags: string[];
  highlight: string;
  /** Shown as a large tile on the homepage. */
  featured?: boolean;
};

export type SkillCategoryId = "languages" | "ai" | "backend" | "workflow" | "frontend" | "tooling";

export type SkillCategory = {
  id: SkillCategoryId;
  title: string;
  skills: string[];
};

export type VolunteerItem = {
  role: string;
  organization: string;
  url: string;
  period: string;
  description: string;
  highlights: string[];
};

export type SocialId = "github" | "linkedin" | "medium" | "x";

export type SocialLink = {
  id: SocialId;
  label: string;
  url: string;
};

// Single source of truth for the site sections and the "Ask my AI" chatbot knowledge.
// Text wrapped in **double asterisks** is rendered as emphasized text on the site.
export const profile = {
  name: "Mohammad Amin Dadgar",
  title: "Freelance AI Engineer",
  availability: "Available for freelance projects",
  tagline:
    "I design, build, evaluate, and maintain production LLM systems, multi-agent architectures, and hybrid RAG pipelines.",
  about: [
    "I'm a freelance AI engineer with **5+ years of experience**, specializing in the full lifecycle of LLM systems — from architecture and design to development, deployment, evaluation, and ongoing maintenance.",
    "I build reliable **multi-agent systems** and **hybrid RAG pipelines**, with hands-on expertise in open-source LLMs including GLM-5.2, Gemma 4, and gpt-oss-120b. I also specialize in evaluation and traceability across retrieval, generation, agents, and tool execution.",
    "Previous work includes **AXIS**, an AI meeting intelligence product spanning a React web app, recording extension, and serverless AI workflows. I can also ship frontend applications through AI-assisted and vibe-coding workflows, although AI and backend systems are my primary expertise.",
  ],
  email: "dadgaramin96@gmail.com",
  githubUsername: "amindadgar",
};

export const education: EducationItem[] = [
  {
    degree: "M.Sc. Artificial Intelligence",
    school: "University of Isfahan",
    detail: "GPA 3.66/4.0",
  },
  {
    degree: "B.Sc. Computer Engineering",
    school: "University of Kashan",
    detail: "GPA 3.25/4.0",
  },
];

export const experiences: ExperienceItem[] = [
  {
    role: "Freelance AI Engineer",
    company: "Independent",
    url: "https://amindadgar.com/",
    period: "2026 – Present",
    location: "Remote",
    highlights: [
      "Design, build, deploy, evaluate, and maintain LLM systems across their full production lifecycle",
      "Build multi-agent systems with task decomposition, tool use, context management, and reliable orchestration",
      "Create hybrid RAG pipelines combining dense and sparse retrieval, reranking, generation, and evaluation",
      "Implement LLM evaluation and traceability for quality measurement, failure analysis, and production monitoring",
    ],
    stack: ["Python", "GLM-5.2", "Gemma 4", "gpt-oss-120b", "Hybrid RAG", "Multi-Agent Systems"],
  },
  {
    role: "AI Engineer",
    company: "AXIS",
    url: "https://tryaxisapp.com/",
    period: "Oct 2025 – Apr 2026",
    location: "Remote",
    highlights: [
      "Built an AI meeting platform across three codebases: Web App (React/TS), Chrome MV3 extension, and Supabase Edge Functions",
      "Implemented schema-constrained LLM outputs for reliable meeting-to-task conversion",
      "Added contextual AI chat on meeting history with session/message persistence and token tracking",
      "Improved production readiness with tenant-scoped data access and secure client/backend boundaries",
    ],
    stack: ["TypeScript", "React", "Supabase", "PostgreSQL", "OpenAI API", "Chrome MV3"],
  },
  {
    role: "AI Engineer",
    company: "TogetherCrew",
    url: "https://github.com/TogetherCrew",
    period: "Oct 2023 – Oct 2025",
    location: "Remote",
    highlights: [
      "Built LLM pipelines to analyze decentralized communities across Telegram, Discord, Discourse, Notion, and more",
      "Developed RAG systems with llama-index, adding caching, deduplication, and time-indexed ingestion — boosting accuracy by 30%",
      "Designed and deployed 10+ Airflow ETL pipelines for embedding, summarization, and transformation tasks",
      "Orchestrated high-reliability async workflows with Temporal and RabbitMQ, enabling 18+ concurrent tasks",
      "Evaluated RAG output via custom metrics improving quality by 40%",
    ],
    stack: ["Python", "MongoDB", "Neo4j", "Airflow", "Temporal", "Docker", "RabbitMQ", "LangChain", "llama-index"],
  },
  {
    role: "DevOps Engineer",
    company: "Hoopad Vision Company",
    period: "Contract",
    location: "On-site",
    highlights: [
      "Dockerized 7+ microservices, accelerating deployment times by ~40%",
      "Enhanced developer workflows for a 10-person team, improving onboarding speed",
      "Led Git adoption and implemented CI pipeline, reducing manual QA by 30–50%",
    ],
    stack: ["Python", "Pytest", "Docker", "Git"],
  },
];

export const projects: ProjectItem[] = [
  {
    title: "AXIS",
    description:
      "End-to-end meeting intelligence product spanning a React web app, Chrome recording extension, and Supabase Edge Functions for transcription, structured task extraction, and contextual AI chat.",
    url: "https://tryaxisapp.com/",
    tags: ["TypeScript", "React", "Supabase", "OpenAI", "Chrome MV3"],
    highlight: "Production AI product",
    featured: true,
  },
  {
    title: "Hivemind Bot",
    description:
      "Message-driven LLM assistant utilizing a RAG pipeline, integrating with FastAPI, RabbitMQ, and Temporal for scalable community analytics.",
    url: "https://github.com/TogetherCrew/hivemind-bot",
    tags: ["Python", "RAG", "llama-index", "RabbitMQ", "Temporal"],
    highlight: "Multi-interface LLM",
    featured: true,
  },
  {
    title: "Airflow DAGs",
    description:
      "Orchestrated analyzer pipelines, data vectorization with ETL (embedding cache, deduplication, streaming), platform data extraction, and violation-detection classification.",
    url: "https://github.com/TogetherCrew/airflow-dags",
    tags: ["Python", "Airflow", "ETL", "Embeddings"],
    highlight: "10+ pipelines",
  },
  {
    title: "Temporal Worker",
    description:
      "Temporal workflows in Python to orchestrate ETL pipelines (website & MediaWiki ingestion) and generate summaries using MongoDB, Qdrant, Redis, and PostgreSQL.",
    url: "https://github.com/TogetherCrew/temporal-worker-python",
    tags: ["Python", "Temporal", "MongoDB", "Qdrant", "Redis"],
    highlight: "Fault-tolerant ETL",
  },
  {
    title: "Agents Workflow",
    description:
      "Multi-agent workflow system using CrewAI and Temporal, with MongoDB persistence for step-level traceability, Redis-backed chat history, and RAG pipelines.",
    url: "https://github.com/TogetherCrew/agents-workflow",
    tags: ["Python", "CrewAI", "Temporal", "MongoDB", "RAG"],
    highlight: "Multi-agent orchestration",
  },
  {
    title: "TC Analyzer Lib",
    description:
      "Core analytics library for community analysis, providing graph-based metrics and behavioral insights at scale.",
    url: "https://github.com/TogetherCrew/tc_analyzer_lib",
    tags: ["Python", "Neo4j", "Analytics", "Graph DB"],
    highlight: "Open source",
  },
];

export const skillCategories: SkillCategory[] = [
  {
    id: "languages",
    title: "Languages",
    skills: ["Python", "TypeScript", "JavaScript", "SQL", "LaTeX"],
  },
  {
    id: "ai",
    title: "AI / LLM",
    skills: [
      "Open-source LLMs",
      "GLM-5.2",
      "Gemma 4",
      "gpt-oss-120b",
      "Hybrid RAG",
      "Multi-Agent Systems",
      "LLM Evaluation",
      "Traceability",
      "OpenAI API",
      "llama-index",
      "LangChain",
      "CrewAI",
    ],
  },
  {
    id: "backend",
    title: "Backend & Data",
    skills: ["Supabase", "PostgreSQL", "MongoDB", "Neo4j", "Qdrant"],
  },
  {
    id: "workflow",
    title: "Workflow & Pipelines",
    skills: ["Apache Airflow", "Temporal", "RabbitMQ", "AWS S3 / MinIO"],
  },
  {
    id: "frontend",
    title: "Frontend & Product (Secondary)",
    skills: ["React", "Vite", "Tailwind CSS", "Chrome Extensions (MV3)", "AI-assisted Development"],
  },
  {
    id: "tooling",
    title: "Tooling",
    skills: ["Docker", "Git", "Pytest", "CI/CD"],
  },
];

export const volunteerWork: VolunteerItem[] = [
  {
    role: "Co-Founder & Organizer",
    organization: "AI Talks Community",
    url: "https://www.aitalkshub.ir/",
    period: "Nov 2024 – Present",
    description:
      "AI Talks is a volunteer-run, bilingual community that meets weekly to explore practical, applied AI. Sessions and notes are free, public, and published in both English and Persian.",
    highlights: [
      "Help organize, host, and present weekly sessions on production RAG, multi-agent systems, LLM costs, and workflow automation",
      "Grew the initiative to 55+ sessions, 20+ speakers, 20+ topics, and 50+ bilingual session write-ups",
      "Presented or contributed to 10+ sessions since joining as a speaker in Session 16",
    ],
  },
  {
    role: "Co-Founder",
    organization: "Cassandra AI Group",
    url: "https://www.youtube.com/@cassandraai",
    period: "Oct 2021 – Oct 2023",
    description:
      "Co-founded Cassandra AI Group focused on academic workshops and educational content around artificial intelligence, making AI knowledge accessible through structured learning sessions.",
    highlights: [
      "Produced educational AI content on YouTube",
      "Hosted academic workshops on AI fundamentals and advanced topics",
      "Created a platform for knowledge sharing in the AI space",
    ],
  },
];

export const socials: SocialLink[] = [
  { id: "github", label: "GitHub", url: "https://github.com/amindadgar" },
  { id: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/in/amindadgar/" },
  { id: "medium", label: "Medium", url: "https://amindadgar.medium.com/" },
  { id: "x", label: "X / Twitter", url: "https://twitter.com/mramin22" },
];

const writings: WritingItem[] = [
  {
    title: "Taking a Look Back at the RAG Stack I Built",
    description:
      "A retrospective on building a Retrieval-Augmented Generation (RAG) stack, sharing technical insights and lessons learned from the implementation.",
    url: "https://www.linkedin.com/posts/amindadgar_taking-a-look-back-at-the-rag-stack-i-built-share-7457063564793667584-RkCW?utm_source=share&utm_medium=member_desktop&rcm=ACoAACrshjUBYenM2iIuGxt06guTUq0OAh6OwQU",
    tag: "RAG",
    platform: "LinkedIn",
    publishedAt: "2026-05-05",
  },
  {
    title: "How I Got Cursor Working with 9Router via Ngrok",
    description:
      "A practical setup note on connecting Cursor to 9Router by exposing a local OpenAI-compatible endpoint through ngrok and smoothing out the integration details.",
    url: "https://amindadgar.medium.com/how-i-got-cursor-working-with-9router-via-ngrok-aaf4a0e508f0",
    tag: "AI Tooling",
    platform: "Medium",
    publishedAt: "2026-04-29",
  },
  {
    title: "Maximize Every Token You Have",
    description:
      "A focused reminder to treat context as a scarce resource: compress prompts, prune noise, and spend tokens only where they improve the result.",
    url: "https://www.linkedin.com/posts/amindadgar_maximize-every-token-you-have-seriouslyuse-share-7454805086632919041-zGtG?utm_source=share&utm_medium=member_desktop&rcm=ACoAACrshjUBYenM2iIuGxt06guTUq0OAh6OwQU",
    tag: "Prompting",
    platform: "LinkedIn",
    publishedAt: "2026-04-28",
  },
  {
    title: "Build Advanced Voice AI Agents with Vapi",
    description:
      "Notes on building more capable voice AI workflows with Vapi, from conversation design to the practical systems behind advanced voice agents.",
    url: "https://www.linkedin.com/posts/amindadgar_vapi-build-advanced-voice-ai-agents-share-7454492208717611008-xNWo?utm_source=share&utm_medium=member_desktop&rcm=ACoAACrshjUBYenM2iIuGxt06guTUq0OAh6OwQU",
    tag: "Voice AI",
    platform: "LinkedIn",
    publishedAt: "2026-04-27",
  },
  {
    title: "MCP, LLMs, and Dynamic Integration",
    description:
      "On MCP accelerating platform connections, models as orchestration layers, and what software products become when integration pipelines can be assembled on the fly.",
    url: "https://www.linkedin.com/posts/amindadgar_given-mcp-platforms-are-starting-to-connect-share-7450510156175392769-95NE",
    tag: "MCP",
    platform: "LinkedIn",
    publishedAt: "2026-04-17",
  },
  {
    title: "My Experience with AgenticSeek",
    description:
      "Hands-on exploration of AgenticSeek - sharing insights and takeaways from working with agentic AI workflows.",
    url: "https://www.linkedin.com/posts/amindadgar_my-experience-with-agenticseek-i-went-share-7450177355807072257-f93S",
    tag: "LinkedIn",
    platform: "LinkedIn",
    publishedAt: "2026-04-16",
  },
  {
    title: "AI Should Replace Repetitive Work, Not Human Creativity",
    description:
      "A reflection on AI replacing repetitive, exhausting tasks so we can move faster on meaningful work - and the challenge of deciding what can be delegated as the landscape changes.",
    url: "https://x.com/mramin22/status/2045868464439541812?s=20",
    tag: "AI",
    platform: "X",
    publishedAt: "2026-04-19",
  },
  {
    title: "How Are Methods in XAI Evaluated?",
    description:
      "A deep dive into evaluation methodologies for Explainable AI techniques, comparing quantitative and qualitative approaches.",
    url: "https://amindadgar.medium.com/how-are-methods-in-xai-evaluated-b5b3b942e06d",
    tag: "XAI",
    platform: "Medium",
    publishedAt: "2023-01-04",
  },
  {
    title: "What is Machine Learning Model Interpretation?",
    description:
      "Exploring the fundamentals of model interpretability - why it matters and how practitioners can leverage it for better AI systems.",
    url: "https://amindadgar.medium.com/what-is-machine-learning-model-interpretation-9556c3c247e6",
    tag: "ML",
    platform: "Medium",
    publishedAt: "2022-03-03",
  },
  {
    title: "Artificial Intelligence is Against Humanity - Wait, What?",
    description:
      "A thoughtful examination of common misconceptions about AI risks, separating fact from fiction in the debate around AI safety.",
    url: "https://amindadgar.medium.com/artificial-intelligence-is-against-humanity-wait-what-c1a8bc934146",
    tag: "AI Ethics",
    platform: "Medium",
    publishedAt: "2022-12-19",
  },
];

export const LINKEDIN_PROFILE_URL = "https://www.linkedin.com/in/amindadgar/";

export const allWritings = [...writings].sort(
  (left, right) => new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime(),
);

export const latestWritings = allWritings.slice(0, 3);

export const recommendations: RecommendationItem[] = [
  {
    author: "Katerina Bohle Carbonell",
    role: "Data Analyst | Researcher | Solving problems",
    relationship: "Katerina was senior to Mohammad Amin but didn't manage him directly",
    dateLabel: "August 6, 2025",
    excerpt:
      "It was an absolute pleasure working with Mohammad Amin Dadgar at TogetherCrew. I had the privilege of witnessing his significant growth in this role as a Data Scientist and his continuous development of expertise in AI. He brings a collaborative spirit, sharp problem-solving abilities, and an incredibly positive energy to any team.",
    quote: "He brings a collaborative spirit, sharp problem-solving abilities, and an incredibly positive energy to any team.",
    sourceUrl: LINKEDIN_PROFILE_URL,
    imageUrl:
      "https://media.licdn.com/dms/image/v2/C4D03AQGeQtcy0KHuPg/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1534276309232?e=1778112000&v=beta&t=AnFThVPZaV7GE_wTYsSAM0H0OGjniW71nUAjf5z5dVY",
  },
  {
    author: "Cyrille Derche",
    role: "Product & Tech @ Matrix eIFU - Entrepreneur - Ex-Founder",
    relationship: "Cyrille managed Mohammad Amin directly",
    dateLabel: "May 8, 2025",
    excerpt:
      "Amin is a talented developer with a strong track record in building AI-driven products and data pipelines. He consistently brings a collaborative spirit, sharp problem-solving abilities, and positive energy to any team he joins.",
    quote: "Amin is a talented developer with a strong track record in building AI-driven products and data pipelines.",
    sourceUrl: LINKEDIN_PROFILE_URL,
    imageUrl:
      "https://media.licdn.com/dms/image/v2/D4E03AQGssrXOF_wglQ/profile-displayphoto-scale_200_200/B4EZspKhZ.KkAY-/0/1765922183463?e=1778112000&v=beta&t=hc0OoqUKZWSc5x4LD4CD0wWw2f5aHuaTeh-TEh9MlJc",
  },
  {
    author: "Tjitse van der Molen",
    role: "Postdoctoral researcher at the Sharf Lab and Kosik Lab - University of California",
    relationship: "Tjitse worked with Mohammad Amin on the same team",
    dateLabel: "April 15, 2025",
    excerpt:
      "Amin is a great developer with knowledge about a variety of topics related to Artificial Intelligence, Software Engineering and Data Science. He is a fast learner who works hard and asks good questions, and it is always a pleasure to work with him.",
    quote: "He is a fast learner who works hard and asks good questions, and it is always a pleasure to work with him.",
    sourceUrl: LINKEDIN_PROFILE_URL,
    imageUrl:
      "https://media.licdn.com/dms/image/v2/C5603AQHNWVIuuyAMRw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1556132014693?e=1778112000&v=beta&t=Nqh2mqg4Q1RfDYAf3maluNe1tyF3OHMlE8P6Z8WRYR0",
  },
  {
    author: "Behzad Rabiei",
    role: "Backend Engineer | Node.js, Nest.js | AWS | Solidity, Web3",
    relationship: "Behzad worked with Mohammad Amin on the same team",
    dateLabel: "April 8, 2025",
    excerpt:
      "It has been a pleasure working with Mohammad Amin Dadgar at TogetherCrew. As a Data and AI Engineer, his passion and hard work really stood out. His creative ideas and dedication made our projects better every day.",
    quote: "His creative ideas and dedication made our projects better every day.",
    sourceUrl: LINKEDIN_PROFILE_URL,
    imageUrl: "/recommendations/behzad-rabiei.jpg",
  },
  {
    author: "Yasin Fakhar",
    role: "Agentic Software Engineer | AI Solution Engineer | MLOps Engineer | Computer Vision Engineer | Back-End Developer",
    relationship: "Yasin worked with Mohammad Amin on the same team",
    dateLabel: "August 1, 2024",
    excerpt:
      "I highly recommend Amin Dadgar, who I have had the pleasure of working with at HoopardVision and studying alongside in our master's program at University of Isfahan. He excels in his professional role, demonstrating creativity, expertise, and strong problem-solving abilities.",
    quote: "He excels in his professional role, demonstrating creativity, expertise, and strong problem-solving abilities.",
    sourceUrl: LINKEDIN_PROFILE_URL,
  },
  {
    author: "Poorya MohammadiNasab",
    role: "PhD candidate at Medical University of Vienna",
    relationship: "Poorya and Mohammad Amin studied together",
    dateLabel: "November 1, 2021",
    excerpt:
      "There is no better classmate than Amin. I highly recommend his expertise to any person looking for a computer engineer. He is professional in Artificial Intelligence, Machine Learning, Android Development, and Deep Learning, and would become an appreciated member of any team.",
    quote: "There is no better classmate than Amin.",
    sourceUrl: LINKEDIN_PROFILE_URL,
  },
  {
    author: "Ardavan Khalij",
    role: "Functional Analyst and Developer at AG",
    relationship: "Ardavan and Mohammad Amin studied together",
    dateLabel: "August 6, 2021",
    excerpt:
      "Since I know him, he was so passionate about learning and he was always active in different fields. He tries to do his best in his tasks, and I know him for four years and think he can be trusted with tasks you put on his shoulders.",
    quote: "Since I know him, he was so passionate about learning and he was always active in different fields.",
    sourceUrl: LINKEDIN_PROFILE_URL,
  },
];
