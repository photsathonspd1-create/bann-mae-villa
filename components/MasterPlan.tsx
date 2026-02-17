"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Home, Check, X } from "lucide-react";

type Villa = {
  id: string;
  name: string;
  slug: string;
  plotNumber: string;
  status: string;
  price: number;
  areaSqM: number;
  areaSqWah: number;
  usableAreaSqM: number;
  type: string;
  nameTh?: string;
  nameEn?: string;
  nameCn?: string;
};

type PlotPosition = {
  plotNumber: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

// Plot positions based on master plan layout
const plotPositions: PlotPosition[] = [
  { plotNumber: "A3", x: 150, y: 200, width: 120, height: 100 },
  { plotNumber: "A4", x: 300, y: 200, width: 120, height: 100 },
  { plotNumber: "B5", x: 150, y: 350, width: 120, height: 100 },
  { plotNumber: "B6", x: 300, y: 350, width: 120, height: 100 },
  { plotNumber: "B7", x: 450, y: 350, width: 120, height: 100 },
  { plotNumber: "B8", x: 600, y: 350, width: 120, height: 100 },
];

export default function MasterPlan() {
  const [villas, setVillas] = useState<Villa[]>([]);
  const [selectedPlot, setSelectedPlot] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/villas")
      .then((res) => res.json())
      .then((data) => {
        setVillas(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setVillas([]);
        setLoading(false);
      });
  }, []);

  const getVillaByPlot = (plotNumber: string) => {
    return villas.find((villa) => villa.plotNumber === plotNumber);
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "SOLD":
        return "bg-red-500";
      case "AVAILABLE":
        return "bg-emerald-500";
      case "RESERVED":
        return "bg-amber-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusBorderColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "SOLD":
        return "border-red-500";
      case "AVAILABLE":
        return "border-emerald-500";
      case "RESERVED":
        return "border-amber-500";
      default:
        return "border-gray-500";
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-400 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-playfair font-light text-white mb-2">Master Plan</h2>
        <p className="text-neutral-400">Click on any plot to view detailed information</p>
      </div>

      {/* Legend */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-emerald-500 rounded"></div>
          <span className="text-sm text-neutral-300">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-sm text-neutral-300">Sold</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-amber-500 rounded"></div>
          <span className="text-sm text-neutral-300">Reserved</span>
        </div>
      </div>

      {/* Master Plan Container */}
      <div className="relative bg-neutral-800 rounded-lg overflow-hidden">
        {/* Master Plan Background Image */}
        <div className="relative h-[600px] w-full">
          <Image
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80&auto=format&fit=crop"
            alt="Master Plan Layout"
            fill
            className="object-cover opacity-30"
            sizes="(max-width: 768px) 100vw, 1200px"
          />
          
          {/* Plot Overlays */}
          <svg className="absolute inset-0 w-full h-full">
            {plotPositions.map((plot) => {
              const villa = getVillaByPlot(plot.plotNumber);
              const isSelected = selectedPlot === plot.plotNumber;
              const statusColor = villa ? getStatusColor(villa.status) : "bg-gray-500";
              const borderColor = villa ? getStatusBorderColor(villa.status) : "border-gray-500";

              return (
                <g key={plot.plotNumber}>
                  <rect
                    x={plot.x}
                    y={plot.y}
                    width={plot.width}
                    height={plot.height}
                    className={`cursor-pointer transition-all duration-200 ${
                      isSelected ? "stroke-2" : "stroke-1"
                    } ${borderColor}`}
                    fill="transparent"
                    stroke="currentColor"
                    onClick={() => setSelectedPlot(plot.plotNumber)}
                    onMouseEnter={() => setSelectedPlot(plot.plotNumber)}
                    onMouseLeave={() => setSelectedPlot(null)}
                  />
                  
                  {/* Plot Label */}
                  <text
                    x={plot.x + plot.width / 2}
                    y={plot.y + plot.height / 2 - 10}
                    className="pointer-events-none select-none"
                    textAnchor="middle"
                    fill="white"
                    fontSize="16"
                    fontWeight="bold"
                  >
                    {plot.plotNumber}
                  </text>
                  
                  {/* Status Indicator */}
                  {villa && (
                    <circle
                      cx={plot.x + plot.width / 2}
                      cy={plot.y + plot.height / 2 + 15}
                      r="6"
                      className={`pointer-events-none ${statusColor}`}
                    />
                  )}
                </g>
              );
            })}
          </svg>

          {/* Plot Details Popup */}
          {selectedPlot && (() => {
            const villa = getVillaByPlot(selectedPlot);
            const plot = plotPositions.find((p) => p.plotNumber === selectedPlot);
            
            if (!villa || !plot) return null;

            return (
              <div
                className="absolute bg-neutral-900 border border-neutral-700 rounded-lg p-4 shadow-xl z-10"
                style={{
                  left: `${plot.x + plot.width + 10}px`,
                  top: `${plot.y}px`,
                  minWidth: "280px",
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-white">
                    {villa.nameEn || villa.name}
                  </h3>
                  <button
                    onClick={() => setSelectedPlot(null)}
                    className="text-neutral-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Status:</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      villa.status === "SOLD" 
                        ? "bg-red-500/20 text-red-400" 
                        : "bg-emerald-500/20 text-emerald-400"
                    }`}>
                      {villa.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Type:</span>
                    <span className="text-white">{villa.type}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Price:</span>
                    <span className="text-amber-400 font-medium">{formatPrice(villa.price)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Land Size:</span>
                    <span className="text-white">{villa.areaSqWah} sq wah ({villa.areaSqM} m²)</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Usable Area:</span>
                    <span className="text-white">{villa.usableAreaSqM} m²</span>
                  </div>
                </div>

                {villa.status === "AVAILABLE" && (
                  <Link
                    href={`/villas/${villa.slug}`}
                    className="mt-4 block w-full text-center bg-amber-500 hover:bg-amber-400 text-neutral-900 py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    View Details
                  </Link>
                )}
              </div>
            );
          })()}
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-neutral-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <Home className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-neutral-400 text-sm">Available</p>
              <p className="text-white text-xl font-semibold">
                {villas.filter(v => v.status === "AVAILABLE").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-neutral-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
              <X className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <p className="text-neutral-400 text-sm">Sold</p>
              <p className="text-white text-xl font-semibold">
                {villas.filter(v => v.status === "SOLD").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-neutral-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
              <MapPin className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <p className="text-neutral-400 text-sm">Total Plots</p>
              <p className="text-white text-xl font-semibold">{villas.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
