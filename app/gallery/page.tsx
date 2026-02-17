import { Metadata } from "next";
import { VillaGallery } from "@/components/VillaGallery";

// 3D Perspective images for Type A and Type B houses
const typeAImages = [
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600607687920-4e2a09cf161d?w=1200&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600047509319-42699d5bdbc4?w=1200&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600566753376-12c8ac7ecb73?w=1200&q=80&auto=format&fit=crop",
];

const typeBImages = [
  "https://images.unsplash.com/photo-1600047509319-42699d5bdbc4?w=1200&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600566753376-12c8ac7ecb73?w=1200&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600607687920-4e2a09cf161d?w=1200&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80&auto=format&fit=crop",
];

export const metadata: Metadata = {
  title: "Gallery - Baan Mae Villa",
  description: "Explore our 3D perspective renders and architectural visualizations of Type A and Type B luxury villas",
};

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-neutral-950">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-playfair font-light text-white mb-4">
              3D Perspective Gallery
            </h1>
            <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
              Experience our luxury villas through stunning 3D architectural visualizations and perspective renders
            </p>
          </div>

          {/* Type A Gallery */}
          <section className="mb-20">
            <div className="mb-8">
              <h2 className="text-3xl font-playfair font-light text-white mb-2">
                Type A Villas
              </h2>
              <div className="flex flex-wrap gap-4 text-sm text-neutral-400">
                <span>3 Bedrooms</span>
                <span>•</span>
                <span>126 sq wah (504 m²)</span>
                <span>•</span>
                <span>350 m² usable area</span>
              </div>
              <p className="mt-3 text-neutral-300">
                Modern 3-bedroom villas featuring contemporary design, private pools, and premium finishes. 
                Perfect for families seeking luxury living in Pattaya.
              </p>
            </div>
            
            <VillaGallery 
              images={typeAImages} 
              alt="Type A Villa 3D Perspective Renders"
              overlay={
                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg px-4 py-2">
                  <p className="text-white font-medium">Type A - 3 Bedroom Villa</p>
                </div>
              }
            />
          </section>

          {/* Type B Gallery */}
          <section className="mb-20">
            <div className="mb-8">
              <h2 className="text-3xl font-playfair font-light text-white mb-2">
                Type B Villas
              </h2>
              <div className="flex flex-wrap gap-4 text-sm text-neutral-400">
                <span>4 Bedrooms</span>
                <span>•</span>
                <span>157.5 sq wah (630 m²)</span>
                <span>•</span>
                <span>420 m² usable area</span>
              </div>
              <p className="mt-3 text-neutral-300">
                Spacious 4-bedroom villas with expanded living areas, home theater options, and luxury amenities. 
                Designed for those who desire extra space and premium features.
              </p>
            </div>
            
            <VillaGallery 
              images={typeBImages} 
              alt="Type B Villa 3D Perspective Renders"
              overlay={
                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg px-4 py-2">
                  <p className="text-white font-medium">Type B - 4 Bedroom Villa</p>
                </div>
              }
            />
          </section>

          {/* Features Overview */}
          <section className="bg-neutral-900 rounded-xl border border-neutral-800 p-8">
            <h3 className="text-2xl font-playfair font-light text-white mb-6 text-center">
              Premium Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <h4 className="text-white font-medium mb-2">Modern Architecture</h4>
                <p className="text-neutral-400 text-sm">Contemporary design with clean lines and premium materials</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-white font-medium mb-2">Private Pools</h4>
                <p className="text-neutral-400 text-sm">Each villa includes a private swimming pool and garden area</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h4 className="text-white font-medium mb-2">24/7 Security</h4>
                <p className="text-neutral-400 text-sm">Gated community with round-the-clock security services</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h4 className="text-white font-medium mb-2">Smart Home</h4>
                <p className="text-neutral-400 text-sm">Integrated smart home technology for modern convenience</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h4 className="text-white font-medium mb-2">Premium Finishes</h4>
                <p className="text-neutral-400 text-sm">High-quality materials and luxury fittings throughout</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="text-white font-medium mb-2">Energy Efficient</h4>
                <p className="text-neutral-400 text-sm">Sustainable design with energy-saving features</p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="mt-16 text-center">
            <div className="bg-gradient-to-r from-amber-500/20 to-amber-600/20 rounded-xl border border-amber-500/30 p-8">
              <h3 className="text-2xl font-playfair font-light text-white mb-4">
                Ready to Experience Luxury Living?
              </h3>
              <p className="text-neutral-300 mb-8 max-w-2xl mx-auto">
                Schedule a private viewing of our show villas or download our complete sales kit for detailed information.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/master-plan"
                  className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-neutral-900 py-3 px-6 rounded-lg font-medium transition-colors"
                >
                  View Master Plan
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center gap-2 border border-amber-400/50 bg-amber-400/10 hover:bg-amber-400/20 text-amber-400 py-3 px-6 rounded-lg font-medium transition-colors"
                >
                  Schedule Viewing
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
