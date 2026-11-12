import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';

interface PageProps {
  onNavigate: (path: string) => void;
}

export const SourceDocumentViewer: React.FC<PageProps> = () => {
  const { showToast } = useToast();
  const [selectedDoc, setSelectedDoc] = useState<string>('Articles_of_Association.pdf');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [selectedBoundingBox, setSelectedBoundingBox] = useState<string | null>('box-address');

  const handleDownloadPDF = () => {
    const dummyContent = `%PDF-1.4\n% Project Northgate Evidentiary PDF Export\nDocument: ${selectedDoc}\nCase: CASE-2024-8841\nSHA-256 Hash: d9e4f210a4b71c8901fd5523491209b837482910\nTimestamp: ${new Date().toISOString()}\n`;
    const blob = new Blob([dummyContent], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', selectedDoc);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('Evidentiary PDF Downloaded', `Successfully downloaded ${selectedDoc} with embedded OCR coordinates.`, 'success');
  };

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.min(175, Math.max(75, prev + delta)));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 w-full min-w-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Source Document Viewer & OCR Bounding Vault
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
              Spatial Evidentiary Linking
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Every extracted legal field links directly to pixel-level bounding coordinates in the evidentiary PDF.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-end sm:self-auto flex-shrink-0">
          <span className="text-xs font-mono text-slate-500 bg-white px-3 py-2 rounded-lg border border-slate-200 hidden sm:inline">
            SHA-256: d9e4f210...b71c8901
          </span>
          <button 
            type="button"
            onClick={handleDownloadPDF}
            className="px-3.5 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-950 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none"
          >
            <span className="material-symbols-outlined text-base">download</span>
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Main Split Layout: Document Vault List (Left) + Document Canvas (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Dossier File Vault */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Ingested Dossier Files (5)
          </span>

          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => setSelectedDoc('Articles_of_Association.pdf')}
              className={`w-full text-left p-3 rounded-lg text-xs transition-all flex items-center justify-between cursor-pointer ${
                selectedDoc === 'Articles_of_Association.pdf' 
                  ? 'bg-slate-900 text-white font-semibold shadow-sm' 
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <span className="material-symbols-outlined text-base">description</span>
                <span className="truncate">Articles of Association.pdf</span>
              </div>
              <span className="text-[10px] opacity-75 font-mono ml-2">24 pgs</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedDoc('Register_of_Members.pdf')}
              className={`w-full text-left p-3 rounded-lg text-xs transition-all flex items-center justify-between cursor-pointer ${
                selectedDoc === 'Register_of_Members.pdf' 
                  ? 'bg-slate-900 text-white font-semibold shadow-sm' 
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <span className="material-symbols-outlined text-base">description</span>
                <span className="truncate">Register of Members.pdf</span>
              </div>
              <span className="text-[10px] opacity-75 font-mono ml-2">8 pgs</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedDoc('Passport_Arthur_Pendelton.pdf')}
              className={`w-full text-left p-3 rounded-lg text-xs transition-all flex items-center justify-between cursor-pointer ${
                selectedDoc === 'Passport_Arthur_Pendelton.pdf' 
                  ? 'bg-slate-900 text-white font-semibold shadow-sm' 
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <span className="material-symbols-outlined text-base text-rose-500">badge</span>
                <span className="truncate">Passport - A. Pendelton.pdf</span>
              </div>
              <span className="text-[10px] text-rose-600 font-bold font-mono ml-2">EXPIRED</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedDoc('Proof_of_Address_Utility.pdf')}
              className={`w-full text-left p-3 rounded-lg text-xs transition-all flex items-center justify-between cursor-pointer ${
                selectedDoc === 'Proof_of_Address_Utility.pdf' 
                  ? 'bg-slate-900 text-white font-semibold shadow-sm' 
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <span className="material-symbols-outlined text-base">receipt_long</span>
                <span className="truncate">Proof of Address.pdf</span>
              </div>
              <span className="text-[10px] opacity-75 font-mono ml-2">1 pg</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedDoc('Certificate_of_Incorporation.pdf')}
              className={`w-full text-left p-3 rounded-lg text-xs transition-all flex items-center justify-between cursor-pointer ${
                selectedDoc === 'Certificate_of_Incorporation.pdf' 
                  ? 'bg-slate-900 text-white font-semibold shadow-sm' 
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <span className="material-symbols-outlined text-base">verified</span>
                <span className="truncate">Cert of Incorporation.pdf</span>
              </div>
              <span className="text-[10px] opacity-75 font-mono ml-2">2 pgs</span>
            </button>
          </div>

          <div className="pt-4 border-t border-slate-200 text-[11px] text-slate-500 space-y-1.5">
            <div><strong>OCR Pipeline:</strong> Leptos v2.8 (Internal Module)</div>
            <div><strong>Spatial Precision:</strong> Sub-pixel bounding layer</div>
            <div className="text-blue-700 font-mono text-[10px]">PROVISIONAL-GAP-4 (Internal OCR)</div>
          </div>
        </div>

        {/* Right 3 Cols: PDF Page Canvas with Bounding Box Overlay */}
        <div className="lg:col-span-3 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800">
                Viewing: {selectedDoc}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">
                100% OCR CONFIDENCE
              </span>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <button 
                type="button"
                onClick={() => handleZoom(-15)}
                className="w-7 h-7 bg-slate-100 rounded hover:bg-slate-200 font-bold flex items-center justify-center cursor-pointer transition-colors"
                title="Zoom Out"
              >
                &minus;
              </button>
              <span className="font-mono px-2 text-slate-700 font-semibold">{zoomLevel}%</span>
              <button 
                type="button"
                onClick={() => handleZoom(15)}
                className="w-7 h-7 bg-slate-100 rounded hover:bg-slate-200 font-bold flex items-center justify-center cursor-pointer transition-colors"
                title="Zoom In"
              >
                +
              </button>
              <button 
                type="button"
                onClick={() => setZoomLevel(100)}
                className="px-2 py-1 bg-slate-100 rounded hover:bg-slate-200 text-[10px] font-semibold cursor-pointer ml-1"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Rendered Document View */}
          <div 
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top left' }}
            className="bg-slate-50 border border-slate-300 p-8 rounded-lg font-serif text-slate-900 text-sm leading-relaxed relative min-h-[460px] shadow-inner select-text transition-transform duration-200"
          >
            {selectedDoc === 'Articles_of_Association.pdf' && (
              <>
                <div className="text-center font-bold text-base mb-6 tracking-wide border-b pb-3 border-slate-300">
                  COMPANIES ACT 2006 &bull; ARTICLES OF ASSOCIATION
                  <div className="text-xs font-normal text-slate-600 mt-1">
                    Company No. 08921471 &bull; Harbor Crest Holdings Ltd &bull; Registered in England and Wales
                  </div>
                </div>

                <p className="mb-4">
                  <strong>Clause 10 &mdash; Exclusion of Model Articles:</strong> The regulations contained in the Model Articles for Private Companies Limited by Shares shall apply save as excluded herein.
                </p>

                <p className="mb-4">
                  <strong>Clause 11 &mdash; Share Capital:</strong> The share capital of the Company consists of 100,000 Ordinary Shares of &pound;1.00 each, distributed according to the statutory register.
                </p>

                {/* Bounding Box on Clause 12 - Address Discrepancy */}
                <div 
                  onClick={() => setSelectedBoundingBox('box-address')}
                  className={`p-4 bg-rose-50 border-2 rounded-lg relative cursor-pointer transition-all ${
                    selectedBoundingBox === 'box-address' 
                      ? 'border-rose-600 ring-2 ring-rose-400/40 shadow-sm' 
                      : 'border-rose-400 hover:border-rose-500'
                  }`}
                >
                  <div className="absolute -top-3 left-3 bg-rose-600 text-white font-mono text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                    <span className="material-symbols-outlined text-[12px]">crop_free</span>
                    Bounding Box [x:120, y:450, w:640, h:78] &bull; Discrepancy #1
                  </div>

                  <strong>Clause 12 &mdash; Registered Office Address:</strong>
                  <div className="text-rose-950 font-bold mt-1">
                    Suite 401, 25 Finsbury Circus, London EC2M 7EE, United Kingdom
                  </div>
                  <div className="text-[11px] text-rose-700 mt-1 font-sans">
                    Statutory Mismatch: Official Companies House register records 128 Cannon Street.
                  </div>
                </div>

                <p className="mt-6 text-xs text-slate-500 italic">
                  [Document continues on Page 5 &bull; Authenticated by Corporate Secretary &bull; Digital Signature verified]
                </p>
              </>
            )}

            {selectedDoc === 'Register_of_Members.pdf' && (
              <>
                <div className="text-center font-bold text-base mb-6 tracking-wide border-b pb-3 border-slate-300">
                  STATUTORY REGISTER OF MEMBERS & SHAREHOLDERS
                  <div className="text-xs font-normal text-slate-600 mt-1">
                    Harbor Crest Holdings Ltd &bull; As of 15 October 2024
                  </div>
                </div>

                {/* Bounding Box for Shareholder 1 */}
                <div 
                  onClick={() => setSelectedBoundingBox('box-sh1')}
                  className="p-3 bg-blue-50 border-2 border-blue-500 rounded-lg relative mb-4 cursor-pointer"
                >
                  <div className="absolute -top-3 left-3 bg-blue-600 text-white font-mono text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                    Bounding Box [x:110, y:220] &bull; Shareholder #1
                  </div>
                  <div className="font-bold text-slate-900">Member: Atlantic Horizon Capital Ltd</div>
                  <div className="text-xs text-slate-700 font-mono mt-0.5">Holding: 60,000 Ordinary Shares (60.00% Direct Equity)</div>
                </div>

                {/* Bounding Box for Shareholder 2 */}
                <div 
                  onClick={() => setSelectedBoundingBox('box-sh2')}
                  className="p-3 bg-slate-100 border border-slate-300 rounded-lg relative mb-4 cursor-pointer"
                >
                  <div className="font-bold text-slate-900">Member: Julian Sterling</div>
                  <div className="text-xs text-slate-700 font-mono mt-0.5">Holding: 22,000 Ordinary Shares (22.00% Direct Equity)</div>
                </div>

                <div className="p-3 bg-slate-100 border border-slate-300 rounded-lg relative">
                  <div className="font-bold text-slate-900">Member: Vanguard Pacific Nominees Ltd</div>
                  <div className="text-xs text-slate-700 font-mono mt-0.5">Holding: 18,000 Ordinary Shares (18.00% Direct Equity)</div>
                </div>
              </>
            )}

            {selectedDoc === 'Passport_Arthur_Pendelton.pdf' && (
              <div className="text-center py-8 space-y-4">
                <span className="material-symbols-outlined text-5xl text-rose-500">badge</span>
                <div className="max-w-md mx-auto p-4 bg-rose-50 border-2 border-rose-400 rounded-xl text-left">
                  <div className="font-bold text-rose-950 text-sm">Identity Document: Passport (Arthur Pendelton)</div>
                  <div className="text-xs text-rose-800 mt-1 font-mono">Document No: 981240912GBR &bull; Nationality: British Citizen</div>
                  <div className="text-xs text-rose-900 font-bold mt-2 bg-rose-200 px-2 py-1 rounded inline-block">
                    EXPIRED: 12 Jan 2024 (Validity Lapsed)
                  </div>
                  <p className="text-[11px] text-rose-700 mt-2">
                    Action required: Remediation notice dispatched to Relationship Manager to collect renewed unexpired credential.
                  </p>
                </div>
              </div>
            )}

            {selectedDoc !== 'Articles_of_Association.pdf' && selectedDoc !== 'Register_of_Members.pdf' && selectedDoc !== 'Passport_Arthur_Pendelton.pdf' && (
              <div className="text-center py-12 space-y-3">
                <span className="material-symbols-outlined text-4xl text-slate-400">description</span>
                <h3 className="font-bold text-slate-800 text-sm">{selectedDoc}</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Spatial OCR extraction completed. Coordinates indexed into WORM storage ledger.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
