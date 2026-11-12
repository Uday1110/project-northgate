import React, { useState, useRef } from 'react';
import { useToast } from '../../context/ToastContext';

interface UploadBundleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCaseCreated?: (newCase: any) => void;
  onNavigate?: (path: string) => void;
}

export const UploadBundleModal: React.FC<UploadBundleModalProps> = ({
  isOpen,
  onClose,
  onCaseCreated,
  onNavigate,
}) => {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStep, setUploadStep] = useState<number>(0);
  const [entityName, setEntityName] = useState('Meridian Strategic Ventures Ltd');
  const [jurisdiction, setJurisdiction] = useState('United Kingdom / Private Ltd');

  if (!isOpen) return null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      setFiles((prev) => [...prev, ...droppedFiles]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const resetAndClose = () => {
    setFiles([]);
    setIsUploading(false);
    setUploadStep(0);
    onClose();
  };

  const startExtractionPipeline = () => {
    if (files.length === 0) {
      showToast('Files Required', 'Please select or drag at least one formation document packet to ingest.', 'warning');
      return;
    }

    setIsUploading(true);
    setUploadStep(1);

    // Simulate Step 1: Uploading files
    setTimeout(() => {
      setUploadStep(2); // Entity Parser (OCR)
    }, 1200);

    // Simulate Step 2: Public Registry Lookup
    setTimeout(() => {
      setUploadStep(3); // Public Registry Lookup
    }, 2400);

    // Simulate Step 3: Ownership Reconciliation
    setTimeout(() => {
      setUploadStep(4); // Cap table & UBOs resolved
    }, 3600);

    // Final Completion
    setTimeout(() => {
      setIsUploading(false);
      const newCaseId = `CASE-2024-${Math.floor(1000 + Math.random() * 9000)}`;
      const newCase = {
        caseId: newCaseId,
        entityName: entityName || 'Meridian Strategic Ventures Ltd',
        lei: '213800MSV' + Math.floor(10000000 + Math.random() * 90000000),
        crn: '09' + Math.floor(100000 + Math.random() * 900000),
        jurisdiction: jurisdiction || 'United Kingdom / Private Ltd',
        status: 'Ready for Review',
        cycleTime: '01m 12s',
        assignedAnalyst: 'Marcus Vance (KYC Senior Analyst)',
        documentsReceived: files.length,
        receivedAgo: 'Just now',
        uboThreshold: 25.0,
      };

      if (onCaseCreated) {
        onCaseCreated(newCase);
      }

      showToast(
        'Formation Packet Ingested & Analyzed',
        `Successfully extracted ${files.length} documents for ${newCase.entityName} (${newCase.caseId}). UBO hierarchy resolved.`,
        'success',
        5000
      );

      resetAndClose();

      if (onNavigate) {
        onNavigate('/processing-state');
      }
    }, 4500);
  };

  const steps = [
    { num: 1, title: 'Uploading Dossier Assets', desc: 'Secure hash verification & WORM ledger check' },
    { num: 2, title: 'Entity Parser (OCR & Text Extraction)', desc: 'Extracting legal text, officers, and shareholders' },
    { num: 3, title: 'Public Registry Lookup (MCP Tool)', desc: 'Cross-referencing UK Companies House and GLEIF' },
    { num: 4, title: 'Cap Table & UBO Resolution', desc: 'Calculating effective ownership (threshold >= 25%)' },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={resetAndClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden my-8 transform transition-all"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="upload-modal-title"
      >
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-blue-600 flex items-center justify-center font-bold text-lg text-white shadow-sm">
              <span className="material-symbols-outlined text-xl">cloud_upload</span>
            </div>
            <div>
              <h2 id="upload-modal-title" className="text-base font-bold text-white tracking-tight">
                Corporate Dossier Ingestion
              </h2>
              <p className="text-xs text-slate-300">
                Automated OCR extraction, spatial linking, and multi-tier reconciliation (&lt; 90s SLA)
              </p>
            </div>
          </div>

          {!isUploading && (
            <button
              onClick={resetAndClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {isUploading ? (
            /* Upload & Extraction Progress Screen */
            <div className="py-4 space-y-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 text-blue-700 flex items-center justify-center animate-spin">
                  <span className="material-symbols-outlined text-2xl">sync</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Ingesting & Analyzing Formation Packet...
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Running automated 4-worker pipeline against {entityName} in accordance with FATF / 5AMLD rules.
                </p>
              </div>

              {/* Progress Steps */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
                {steps.map((s) => {
                  const isDone = uploadStep > s.num;
                  const isCurrent = uploadStep === s.num;
                  return (
                    <div
                      key={s.num}
                      className={`flex items-start gap-3 p-2.5 rounded transition-colors ${
                        isCurrent
                          ? 'bg-blue-50 border border-blue-200'
                          : isDone
                          ? 'bg-emerald-50/50'
                          : 'opacity-50'
                      }`}
                    >
                      <div className="mt-0.5">
                        {isDone ? (
                          <span className="material-symbols-outlined text-emerald-600 text-lg">check_circle</span>
                        ) : isCurrent ? (
                          <span className="material-symbols-outlined text-blue-600 text-lg animate-spin">progress_activity</span>
                        ) : (
                          <span className="material-symbols-outlined text-slate-400 text-lg">radio_button_unchecked</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                          <span>{s.title}</span>
                          {isDone && <span className="text-[10px] text-emerald-700 font-mono font-bold">DONE</span>}
                          {isCurrent && <span className="text-[10px] text-blue-700 font-mono font-bold">PROCESSING</span>}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{s.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Upload Selection Form */
            <>
              {/* Entity Context Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Legal Entity Name
                  </label>
                  <input
                    type="text"
                    value={entityName}
                    onChange={(e) => setEntityName(e.target.value)}
                    placeholder="e.g. Meridian Strategic Ventures Ltd"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Jurisdiction & Entity Form
                  </label>
                  <select
                    value={jurisdiction}
                    onChange={(e) => setJurisdiction(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  >
                    <option value="United Kingdom / Private Ltd">United Kingdom / Private Ltd</option>
                    <option value="Singapore / Pte Ltd">Singapore / Pte Ltd</option>
                    <option value="Cayman Islands / Exempted Co">Cayman Islands / Exempted Co</option>
                    <option value="Delaware, US / LLC">Delaware, US / LLC</option>
                  </select>
                </div>
              </div>

              {/* Drag and Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50/50'
                    : 'border-slate-300 hover:border-slate-400 bg-slate-50/50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mb-2">
                  <span className="material-symbols-outlined text-2xl">cloud_upload</span>
                </div>
                <div className="text-xs font-bold text-slate-800">
                  Drop formation dossier files here or <span className="text-blue-600 underline">browse</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Articles of Association, Register of Members, Director Rosters, Passports, Utility Bills (PDF up to 50MB)
                </p>
              </div>

              {/* Sample Files Shortcut */}
              <div className="flex items-center justify-between text-xs bg-blue-50/60 p-2.5 rounded-lg border border-blue-100">
                <span className="text-blue-900 font-medium flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-blue-600">lightbulb</span>
                  Quick Demo: Load standard institutional formation bundle (4 files)
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const mockFiles = [
                      new File(['articles content'], 'Articles_of_Association.pdf', { type: 'application/pdf' }),
                      new File(['members content'], 'Register_of_Members.pdf', { type: 'application/pdf' }),
                      new File(['director roster'], 'Director_Roster.pdf', { type: 'application/pdf' }),
                      new File(['passport scan'], 'Passport_Signatory.pdf', { type: 'application/pdf' }),
                    ];
                    setFiles(mockFiles);
                  }}
                  className="px-2.5 py-1 rounded bg-blue-600 text-white font-semibold text-[11px] hover:bg-blue-700 transition-colors cursor-pointer shadow-sm"
                >
                  Load 4 Files
                </button>
              </div>

              {/* Selected Files List */}
              {files.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>Attached Dossier Files ({files.length})</span>
                    <button
                      type="button"
                      onClick={() => setFiles([])}
                      className="text-rose-600 hover:text-rose-800 text-[11px] font-semibold cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 rounded bg-slate-100 text-xs border border-slate-200"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="material-symbols-outlined text-sm text-slate-500">description</span>
                          <span className="font-medium text-slate-800 truncate">{file.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            ({Math.round(file.size / 1024 || 124)} KB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-slate-400 hover:text-rose-600 p-0.5 rounded cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        {!isUploading && (
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              Compliant with FedRAMP High & WORM Storage standards
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={resetAndClose}
                className="px-3.5 py-2 rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-100 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={startExtractionPipeline}
                disabled={files.length === 0}
                className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
                  files.length === 0
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-blue-700 text-white hover:bg-blue-800 cursor-pointer'
                }`}
              >
                <span className="material-symbols-outlined text-sm">bolt</span>
                <span>Ingest & Start Extraction Pipeline</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
