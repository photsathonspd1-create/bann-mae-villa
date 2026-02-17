"use client";

import { useState } from "react";
import { Download, FileText, Image, Loader2 } from "lucide-react";

export function SalesKit() {
  const [downloading, setDownloading] = useState<string | null>(null);

  const salesKitItems = [
    {
      id: "price-list",
      title: "Complete Price List",
      description: "Detailed pricing for all villa types and available plots",
      type: "PDF",
      size: "2.4 MB",
      url: "/api/sales-kit/price-list",
      icon: FileText,
    },
    {
      id: "brochure",
      title: "Project Brochure",
      description: "Comprehensive project overview and specifications",
      type: "PDF",
      size: "8.7 MB",
      url: "/api/sales-kit/brochure",
      icon: FileText,
    },
    {
      id: "floor-plans",
      title: "Floor Plans Collection",
      description: "Detailed floor plans for Type A and Type B villas",
      type: "PDF",
      size: "5.2 MB",
      url: "/api/sales-kit/floor-plans",
      icon: FileText,
    },
    {
      id: "3d-renders",
      title: "3D Perspective Renders",
      description: "High-resolution 3D visualizations of all villa types",
      type: "ZIP",
      size: "45.8 MB",
      url: "/api/sales-kit/3d-renders",
      icon: Image,
    },
  ];

  const handleDownload = async (item: typeof salesKitItems[0]) => {
    setDownloading(item.id);
    
    try {
      const response = await fetch(item.url);
      
      if (!response.ok) {
        throw new Error("Download failed");
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${item.title.toLowerCase().replace(/\s+/g, "-")}.${item.type.toLowerCase()}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download error:", error);
      alert("Download failed. Please try again.");
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-playfair font-light text-white mb-4">
          Sales Kit
        </h2>
        <p className="text-neutral-400 max-w-2xl mx-auto">
          Download our complete sales kit with detailed pricing, floor plans, and high-resolution renders for your clients.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {salesKitItems.map((item) => {
          const Icon = item.icon;
          const isDownloading = downloading === item.id;
          
          return (
            <div
              key={item.id}
              className="bg-neutral-800 rounded-lg border border-neutral-700 p-6 hover:border-amber-500/50 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-amber-400" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-white mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-neutral-400 mb-3">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-neutral-500">
                      <span className="bg-neutral-700 px-2 py-1 rounded">
                        {item.type}
                      </span>
                      <span>{item.size}</span>
                    </div>
                    
                    <button
                      onClick={() => handleDownload(item)}
                      disabled={isDownloading}
                      className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-600 disabled:opacity-50 text-neutral-900 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      {isDownloading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Downloading...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          Download
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="text-sm">
            <p className="text-amber-400 font-medium mb-1">For Real Estate Agents</p>
            <p className="text-neutral-300">
              These materials are optimized for client presentations and include all necessary information for property sales.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
