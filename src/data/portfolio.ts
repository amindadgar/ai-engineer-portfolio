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
  sourceUrl: string;
  imageUrl?: string;
};

const writings: WritingItem[] = [
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

export const latestWritings = allWritings.slice(0, 5);

export const recommendations: RecommendationItem[] = [
  {
    author: "Katerina Bohle Carbonell",
    role: "Data Analyst | Researcher | Solving problems",
    relationship: "Katerina was senior to Mohammad Amin but didn't manage him directly",
    dateLabel: "August 6, 2025",
    excerpt:
      "It was an absolute pleasure working with Mohammad Amin Dadgar at TogetherCrew. I had the privilege of witnessing his significant growth in this role as a Data Scientist and his continuous development of expertise in AI. He brings a collaborative spirit, sharp problem-solving abilities, and an incredibly positive energy to any team.",
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
    sourceUrl: LINKEDIN_PROFILE_URL,
  },
  {
    author: "Poorya MohammadiNasab",
    role: "PhD candidate at Medical University of Vienna",
    relationship: "Poorya and Mohammad Amin studied together",
    dateLabel: "November 1, 2021",
    excerpt:
      "There is no better classmate than Amin. I highly recommend his expertise to any person looking for a computer engineer. He is professional in Artificial Intelligence, Machine Learning, Android Development, and Deep Learning, and would become an appreciated member of any team.",
    sourceUrl: LINKEDIN_PROFILE_URL,
  },
  {
    author: "Ardavan Khalij",
    role: "Functional Analyst and Developer at AG",
    relationship: "Ardavan and Mohammad Amin studied together",
    dateLabel: "August 6, 2021",
    excerpt:
      "Since I know him, he was so passionate about learning and he was always active in different fields. He tries to do his best in his tasks, and I know him for four years and think he can be trusted with tasks you put on his shoulders.",
    sourceUrl: LINKEDIN_PROFILE_URL,
  },
];
