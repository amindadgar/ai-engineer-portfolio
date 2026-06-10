import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WritingCard from "@/components/WritingCard";
import { allWritings } from "@/data/portfolio";

const Writings = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="px-6 pb-20 pt-28 md:pt-32">
        <div className="mx-auto max-w-4xl">
          <Link
            to="/#writings"
            className="mb-10 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          <header className="mb-12">
            <p className="label-mono mb-3">Writings archive</p>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              Essays, threads, and practical notes on AI engineering
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
              A full list of my published thoughts across Medium, LinkedIn, and X — from model
              interpretation and XAI to agentic systems and product-facing AI workflows.
            </p>
          </header>

          <div className="space-y-4">
            {allWritings.map((writing) => (
              <WritingCard key={writing.title} writing={writing} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Writings;
