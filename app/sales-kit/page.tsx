import { Metadata } from "next";
import { SalesKit } from "@/components/SalesKit";

export const metadata: Metadata = {
  title: "Sales Kit - Baan Mae Villa",
  description: "Download our complete sales kit with pricing, floor plans, and 3D renders for real estate agents and clients",
};

export default function SalesKitPage() {
  return (
    <div className="min-h-screen bg-neutral-950">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-playfair font-light text-white mb-4">
              Sales Kit
            </h1>
            <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
              Complete resource package for real estate agents and potential buyers. 
              Download all essential materials in one place.
            </p>
          </div>
          
          <SalesKit />
          
          {/* Additional Information */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
              <h3 className="text-xl font-playfair font-light text-white mb-4">
                For Real Estate Agents
              </h3>
              <ul className="space-y-3 text-neutral-300">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Complete pricing information for all villa types</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>High-resolution images for marketing materials</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Detailed floor plans and specifications</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Project brochure with full amenities information</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
              <h3 className="text-xl font-playfair font-light text-white mb-4">
                For Potential Buyers
              </h3>
              <ul className="space-y-3 text-neutral-300">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Compare different villa types and layouts</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Review available plots and current pricing</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Visualize your future home with 3D renders</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Share with family and decision makers</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Contact Section */}
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-amber-500/20 to-amber-600/20 rounded-xl border border-amber-500/30 p-8">
              <h3 className="text-2xl font-playfair font-light text-white mb-4">
                Need More Information?
              </h3>
              <p className="text-neutral-300 mb-6 max-w-2xl mx-auto">
                Our sales team is ready to assist you with detailed information, 
                private viewings, and personalized consultations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-neutral-900 py-3 px-6 rounded-lg font-medium transition-colors"
                >
                  Contact Sales Team
                </a>
                <a
                  href="/master-plan"
                  className="inline-flex items-center justify-center gap-2 border border-amber-400/50 bg-amber-400/10 hover:bg-amber-400/20 text-amber-400 py-3 px-6 rounded-lg font-medium transition-colors"
                >
                  View Master Plan
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
