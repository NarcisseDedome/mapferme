'use client';

import { Printer, Download } from 'lucide-react';

export default function PrintReceiptButton() {
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <button
      onClick={handlePrint}
      type="button"
      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-[#234B35] text-[#234B35] hover:bg-[#F6F2E9] font-bold text-xs shadow-2xs transition"
    >
      <Printer className="w-4 h-4 text-[#557A46]" />
      <span>Télécharger / Imprimer mon reçu officiel (PDF)</span>
    </button>
  );
}
