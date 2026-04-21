import { Link } from "react-router-dom";
import { ArrowLeft, BookOpenText } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WritingCard from "@/components/WritingCard";
import { Button } from "@/components/ui/button";
import { allWritings } from "@/data/portfolio";

const Writings = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="px-6 pb-20 pt-28 md:pt-32">
        <div className="mx-auto max-w-5xl">
          <Button asChild variant="ghost" className="mb-8 rounded-xl px-0 text-muted-foreground hover:text-foreground">
            <Link to="/#writings">
              <ArrowLeft />
              Back to home
            </Link>
          </Button>

          <section className="relative overflow-hidden rounded-[2rem] border border-border bg-card/80 p-8 md:p-12">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <div className="mb-10 max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm text-primary">
                <BookOpenText className="h-4 w-4" />
                Writings archive
              </div>
              <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
                Essays, threads, and practical notes on <span className="text-gradient">AI engineering</span>
              </h1>
              <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
                A full list of my published thoughts across Medium, LinkedIn, and X, from model
                interpretation and XAI to agentic systems and product-facing AI workflows.
              </p>
            </div>

            <div className="space-y-6">
              {allWritings.map((writing) => (
                <WritingCard key={writing.title} writing={writing} />
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Writings;
