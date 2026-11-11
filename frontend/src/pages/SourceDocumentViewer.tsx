import React, { useState } from 'react';

interface PageProps {
  onNavigate: (path: string) => void;
}

export const SourceDocumentViewer: React.FC<PageProps> = () => {
  const [selectedDoc, setSelectedDoc] = useState<string>('Articles_of_Association.pdf');

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Source Document Viewer & OCR Bounding Vault</h1>
            <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-xs font-semibold">
              Spatial Evidentiary Linking
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Every extracted legal field links directly to pixel-level bounding coordinates in the evidentiary PDF.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-500 bg-white px-2.5 py-1 rounded border border-slate-200">
            SHA-256: d9e4f210...b71c8901
          </span>
          <button className="px-3 py-1.5 rounded bg-primary text-white hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 shadow-sm">
            <span className="material-symbols-outlined text-sm">download</span>
            Download Original PDF
          </button>
        </div>
      </div>

      {/* Main Split Layout: Document Vault List (Left) + Document Canvas with Bounding Box (Right) */}
      <div className="grid grid-cols-4 gap-6">
        {/* Left Column: Dossier File Vault */}
        <div className="bg-white p-4 rounded border border-slate-200 shadow-sm space-y-3">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Ingested Dossier Files (5)
          </span>

          <div className="space-y-1.5">
            <button
              onClick={() => setSelectedDoc('Articles_of_Association.pdf')}
              className={`w-full text-left p-2.5 rounded text-xs transition-colors flex items-center justify-between ${
                selectedDoc === 'Articles_of_Association.pdf' 
                  ? 'bg-primary-container text-white font-semibold' 
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <span className="material-symbols-outlined text-sm">description</span>
                <span className="truncate">Articles of Association.pdf</span>
              </div>
              <span className="text-[10px] opacity-75 font-mono">24 pgs</span>
            </button>

            <button
              onClick={() => setSelectedDoc('Register_of_Members.pdf')}
              className={`w-full text-left p-2.5 rounded text-xs transition-colors flex items-center justify-between ${
                selectedDoc === 'Register_of_Members.pdf' 
                  ? 'bg-primary-container text-white font-semibold' 
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <span className="material-symbols-outlined text-sm">description</span>
                <span className="truncate">Register of Members.pdf</span>
              </div>
              <span className="text-[10px] opacity-75 font-mono">8 pgs</span>
            </button>

            <button
              onClick={() => setSelectedDoc('Passport_Arthur_Pendelton.pdf')}
              className={`w-full text-left p-2.5 rounded text-xs transition-colors flex items-center justify-between ${
                selectedDoc === 'Passport_Arthur_Pendelton.pdf' 
                  ? 'bg-primary-container text-white font-semibold' 
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <span className="material-symbols-outlined text-sm text-red-500">badge</span>
                <span className="truncate">Passport - A. Pendelton.pdf</span>
              </div>
              <span className="text-[10px] text-red-500 font-bold font-mono">EXPIRED</span>
            </button>

            <button
              onClick={() => setSelectedDoc('Proof_of_Address_Utility.pdf')}
              className={`w-full text-left p-2.5 rounded text-xs transition-colors flex items-center justify-between ${
                selectedDoc === 'Proof_of_Address_Utility.pdf' 
                  ? 'bg-primary-container text-white font-semibold' 
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <span className="material-symbols-outlined text-sm">receipt_long</span>
                <span className="truncate">Proof of Address.pdf</span>
              </div>
              <span className="text-[10px] opacity-75 font-mono">1 pg</span>
            </button>
          </div>

          <div className="pt-4 border-t border-slate-200 text-[11px] text-slate-500 space-y-1">
            <div><strong>OCR Pipeline:</strong> Leptos v2.8 (Internal Module)</div>
            <div><strong>Spatial Precision:</strong> Sub-pixel bounding layer</div>
            <div className="text-blue-700 font-mono text-[10px]">PROVISIONAL-GAP-4 (Internal OCR)</div>
          </div>
        </div>

        {/* Right 3 Cols: PDF Page Canvas with Bounding Box Overlay */}
        <div className="col-span-3 bg-white p-6 rounded border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800">Page 4 of 24 — Form IN01 / Articles of Association</span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">
                100% OCR CONFIDENCE
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <button className="px-2 py-1 bg-slate-100 rounded hover:bg-slate-200 font-bold">&minus;</button>
              <span className="font-mono px-1">100%</span>
              <button className="px-2 py-1 bg-slate-100 rounded hover:bg-slate-200 font-bold">+</button>
            </div>
          </div>

          {/* Rendered Document View */}
          <div className="bg-slate-50 border border-slate-300 p-8 rounded font-serif text-slate-900 text-sm leading-relaxed relative min-h-[420px] shadow-inner select-text">
            <div className="text-center font-bold text-base mb-6 tracking-wide border-b pb-3 border-slate-300">
              COMPANIES ACT 2006 &bull; ARTICLES OF ASSOCIATION
              <div className="text-xs font-normal text-slate-600 mt-1">Company No. 08921471 &bull; Registered in England and Wales</div>
            </div>

            <p className="mb-4">
              <strong>Clause 10 &mdash; Exclusion of Model Articles:</strong> The regulations contained in the Model Articles for Private Companies Limited by Shares shall apply save as excluded herein.
            </p>

            <p className="mb-4">
              <strong>Clause 11 &mdash; Share Capital:</strong> The share capital of the Company consists of 100,000 Ordinary Shares of &pound;1.00 each.
            </p>

            {/* Bounding Box on Clause 12 - Address Discrepancy */}
            <div className="p-3 bg-red-50 border-2 border-red-500 rounded relative group transition-all">
              <div className="absolute -top-3 left-3 bg-red-600 text-white font-mono text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                <span className="material-symbols-outlined text-[12px]">crop_free</span>
                Bounding Box [x:120, y:450] &bull; Discrepancy #1
              </div>

              <strong>Clause 12 &mdash; Registered Office Address:</strong>
              <div className="text-red-950 font-bold mt-1">
                Suite 401, 25 Finsbury Circus, London EC2M 7EE, United Kingdom
              </div>
              <div className="text-[11px] text-red-700 mt-1 font-sans">
                Statutory Mismatch: Official Companies House register records 128 Cannon Street.
              </div>
            </div>

            <p className="mt-6 text-xs text-slate-500 italic">
              [Document continues on Page 5 &bull; Authenticated by Corporate Secretary &bull; Seal attached]
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
