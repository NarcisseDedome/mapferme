'use client';

import { useState } from 'react';
import { Printer, Download, FileText, Check } from 'lucide-react';
import { generateOrderReceiptPDF, OrderReceiptData } from '@/lib/pdf-receipt';

interface PrintReceiptButtonProps {
  orderData?: OrderReceiptData;
}

export default function PrintReceiptButton({ orderData }: PrintReceiptButtonProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownloadPDF = () => {
    if (!orderData) {
      // Si pas de données structurées, basculer sur l'impression directe
      if (typeof window !== 'undefined') window.print();
      return;
    }

    try {
      setDownloading(true);
      generateOrderReceiptPDF(orderData);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3500);
    } catch (err) {
      console.error('Erreur génération reçu PDF:', err);
      // Fallback sur window.print()
      if (typeof window !== 'undefined') window.print();
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
      <button
        onClick={handleDownloadPDF}
        type="button"
        disabled={downloading}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-[#234B35] hover:bg-[#1b3c2a] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5 active:translate-y-0"
      >
        {downloaded ? (
          <>
            <Check className="w-4 h-4 text-emerald-300" />
            <span>Reçu PDF téléchargé !</span>
          </>
        ) : (
          <>
            <Download className="w-4 h-4 text-emerald-300" />
            <span>
              {downloading ? 'Génération du PDF...' : 'Télécharger mon Reçu PDF (À présenter)'}
            </span>
          </>
        )}
      </button>

      <button
        onClick={handlePrint}
        type="button"
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border border-[#234B35]/30 text-[#234B35] hover:bg-[#F6F2E9] font-bold text-xs transition"
      >
        <Printer className="w-4 h-4 text-[#557A46]" />
        <span>Imprimer</span>
      </button>
    </div>
  );
}
