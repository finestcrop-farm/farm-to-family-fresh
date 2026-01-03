import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Construction } from "lucide-react";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/BottomNav";

type ComingSoonProps = {
  title: string;
  description?: string;
};

const ComingSoon: React.FC<ComingSoonProps> = ({ title, description }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-gradient-hero text-primary-foreground safe-area-top">
        <div className="px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full bg-primary-foreground/10 active:bg-primary-foreground/20 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-heading text-lg font-bold">{title}</h1>
        </div>
      </header>

      <main className="px-4 py-10">
        <section className="bg-card border border-border rounded-2xl shadow-card p-6 text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-secondary flex items-center justify-center mb-4">
            <Construction className="w-7 h-7 text-muted-foreground" />
          </div>
          <h2 className="font-heading text-xl font-bold text-foreground">Coming soon</h2>
          <p className="text-sm text-muted-foreground mt-2">
            {description || "We’re building this screen right now."}
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <Button variant="hero" size="lg" onClick={() => navigate("/")}>Go to Home</Button>
            <Button variant="outline" size="lg" onClick={() => navigate(-1)}>Go Back</Button>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
};

export default ComingSoon;
