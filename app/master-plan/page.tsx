import MasterPlan from "@/components/MasterPlan";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Master Plan - Baan Mae Villa",
  description: "Interactive master plan showing all available villa plots and their current status",
};

export default function MasterPlanPage() {
  return (
    <div className="min-h-screen bg-neutral-950">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-playfair font-light text-white mb-4">
              Master Plan
            </h1>
            <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
              Explore our interactive master plan to see all available villa plots, their specifications, and current availability status.
            </p>
          </div>
          
          <MasterPlan />
        </div>
      </div>
    </div>
  );
}
