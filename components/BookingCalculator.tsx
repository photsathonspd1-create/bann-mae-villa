"use client";

import { useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { t } from "@/lib/i18n";
import jsPDF from "jspdf";
import { Download } from "lucide-react";

type Props = {
  villaId?: string;
  villaName?: string;
  price?: number;
};

export function BookingCalculator({ villaId, villaName, price = 0 }: Props) {
  const { locale } = useLocale();
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [lineId, setLineId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Booking calculation constants
  const BOOKING_FEE = 200000; // Fixed 200,000 THB
  const CONTRACT_PERCENTAGE = 0.3; // 30% of selling price
  
  // Calculations
  const contractFee = price * CONTRACT_PERCENTAGE;
  const remainingAmount = price - BOOKING_FEE - contractFee;
  const monthlyInstallment = remainingAmount / 12;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(null);
    setError(null);
    
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          phone,
          lineId: lineId || null,
          villaId: villaId || null,
          totalAmount: price,
          bookingFee: BOOKING_FEE,
          contractFee,
          installmentAmount: monthlyInstallment,
        }),
      });
      
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to create booking.");
      }
      
      setSuccess("Booking created successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to create booking.");
    } finally {
      setSubmitting(false);
    }
  }

  function generatePDF() {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text("BAAN MAE VILLA - BOOKING CALCULATION", 20, 20);
    
    // Villa Information
    doc.setFontSize(14);
    doc.text(`Villa: ${villaName || "Selected Villa"}`, 20, 40);
    doc.text(`Price: ${price.toLocaleString()} THB`, 20, 50);
    
    // Customer Information
    doc.text(`Customer: ${customerName || "N/A"}`, 20, 70);
    doc.text(`Phone: ${phone || "N/A"}`, 20, 80);
    if (lineId) doc.text(`Line ID: ${lineId}`, 20, 90);
    
    // Payment Breakdown
    doc.setFontSize(16);
    doc.text("Payment Breakdown:", 20, 110);
    
    doc.setFontSize(12);
    doc.text(`Booking Fee: ${BOOKING_FEE.toLocaleString()} THB`, 20, 125);
    doc.text(`Contract Fee (30%): ${contractFee.toLocaleString()} THB`, 20, 135);
    doc.text(`Remaining Amount: ${remainingAmount.toLocaleString()} THB`, 20, 145);
    doc.text(`Monthly Installment (12 months): ${monthlyInstallment.toLocaleString()} THB`, 20, 155);
    
    // Total
    doc.setFontSize(14);
    doc.text(`Total: ${price.toLocaleString()} THB`, 20, 175);
    
    // Footer
    doc.setFontSize(10);
    doc.text("Generated on: " + new Date().toLocaleDateString(), 20, 190);
    
    // Save the PDF
    doc.save(`booking-${villaName?.replace(/\s+/g, '-') || 'villa'}-${Date.now()}.pdf`);
  }

  return (
    <section className="mt-4 rounded-2xl border border-white/10 bg-black/60 p-5 shadow-lg">
      <h2 className="text-lg font-semibold text-white">
        Booking Calculator {villaName ? `– ${villaName}` : ""}
      </h2>
      <p className="mt-1 text-xs text-neutral-400">
        Calculate your booking payments and download PDF
      </p>

      {/* Price Display */}
      <div className="mt-4 rounded-lg border border-neutral-700 bg-neutral-900 p-4">
        <div className="text-2xl font-bold text-yellow-500">
          {price.toLocaleString()} THB
        </div>
        <div className="text-xs text-neutral-400">Total Villa Price</div>
      </div>

      {/* Payment Breakdown */}
      <div className="mt-4 space-y-2">
        <h3 className="text-sm font-medium text-white">Payment Breakdown</h3>
        
        <div className="flex justify-between text-sm">
          <span className="text-neutral-300">Booking Fee:</span>
          <span className="text-white font-medium">{BOOKING_FEE.toLocaleString()} THB</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-neutral-300">Contract Fee (30%):</span>
          <span className="text-white font-medium">{contractFee.toLocaleString()} THB</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-neutral-300">Remaining Amount:</span>
          <span className="text-white font-medium">{remainingAmount.toLocaleString()} THB</span>
        </div>
        
        <div className="flex justify-between text-sm border-t border-neutral-700 pt-2">
          <span className="text-neutral-300">Monthly Installment (12 months):</span>
          <span className="text-yellow-500 font-bold">{monthlyInstallment.toLocaleString()} THB</span>
        </div>
      </div>

      {/* PDF Download Button */}
      <button
        onClick={generatePDF}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
      >
        <Download className="h-4 w-4" />
        Download Booking PDF
      </button>

      {/* Customer Information Form */}
      <form onSubmit={handleSubmit} className="mt-6 space-y-3">
        <h3 className="text-sm font-medium text-white">Customer Information</h3>
        
        {error && (
          <p className="rounded border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
            {error}
          </p>
        )}
        {success && (
          <p className="rounded border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200">
            {success}
          </p>
        )}

        <div className="space-y-1">
          <label className="block text-xs font-medium text-neutral-200">
            Full Name
          </label>
          <input
            type="text"
            required
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white outline-none ring-amber-500/40 focus:border-amber-400 focus:ring-2"
            placeholder="Enter your full name"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-medium text-neutral-200">
            Phone Number
          </label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white outline-none ring-amber-500/40 focus:border-amber-400 focus:ring-2"
            placeholder="Enter your phone number"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-medium text-neutral-200">
            Line ID (Optional)
          </label>
          <input
            type="text"
            value={lineId}
            onChange={(e) => setLineId(e.target.value)}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white outline-none ring-amber-500/40 focus:border-amber-400 focus:ring-2"
            placeholder="Enter your Line ID"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-amber-400 px-4 py-2.5 text-sm font-semibold text-neutral-950 transition-colors hover:bg-amber-300 disabled:opacity-60"
        >
          {submitting ? "Creating Booking..." : "Create Booking"}
        </button>
      </form>
    </section>
  );
}
