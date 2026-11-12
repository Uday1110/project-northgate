import { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { IntakeQueue } from './pages/IntakeQueue';
import { ProcessingState } from './pages/ProcessingState';
import { OwnershipWorkbench } from './pages/OwnershipWorkbench';
import { RegistryReconciliation } from './pages/RegistryReconciliation';
import { SourceDocumentViewer } from './pages/SourceDocumentViewer';
import { DeficiencyPunchList } from './pages/DeficiencyPunchList';
import { AuditTrail } from './pages/AuditTrail';
import { ToastProvider } from './context/ToastContext';
import { UploadBundleModal } from './components/modals/UploadBundleModal';
import { CaseInspectionModal } from './components/modals/CaseInspectionModal';

export function App() {
  // Initialize path from window.location.hash or fallback to default
  const getInitialPath = () => {
    const hash = window.location.hash.replace('#', '');
    if (hash && hash.startsWith('/')) {
      return hash;
    }
    return '/intake-queue';
  };

  const [currentPath, setCurrentPath] = useState<string>(getInitialPath);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isCaseInspectionOpen, setIsCaseInspectionOpen] = useState(false);
  const [customCases, setCustomCases] = useState<any[]>([]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && hash.startsWith('/')) {
        setCurrentPath(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (path: string) => {
    window.location.hash = path;
    setCurrentPath(path);
    window.scrollTo(0, 0);
  };

  const handleCaseCreated = (newCase: any) => {
    setCustomCases((prev) => [newCase, ...prev]);
  };

  const renderCurrentPage = () => {
    switch (currentPath) {
      case '/':
      case '/intake-queue':
        return (
          <IntakeQueue
            onNavigate={navigate}
            onOpenUpload={() => setIsUploadModalOpen(true)}
            onOpenCaseInspection={() => setIsCaseInspectionOpen(true)}
            customCases={customCases}
          />
        );
      case '/processing-state':
        return <ProcessingState onNavigate={navigate} />;
      case '/ownership-workbench':
        return <OwnershipWorkbench onNavigate={navigate} />;
      case '/registry-reconciliation':
        return <RegistryReconciliation onNavigate={navigate} />;
      case '/document-viewer':
        return <SourceDocumentViewer onNavigate={navigate} />;
      case '/deficiency-punch-list':
        return <DeficiencyPunchList onNavigate={navigate} />;
      case '/audit-trail':
        return <AuditTrail onNavigate={navigate} />;
      default:
        return (
          <IntakeQueue
            onNavigate={navigate}
            onOpenUpload={() => setIsUploadModalOpen(true)}
            onOpenCaseInspection={() => setIsCaseInspectionOpen(true)}
            customCases={customCases}
          />
        );
    }
  };

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#f8f9ff] flex flex-col font-body-md text-on-surface w-full overflow-x-hidden">
        {/* Fixed Header */}
        <Header
          currentPath={currentPath}
          onOpenUpload={() => setIsUploadModalOpen(true)}
          onOpenCaseInspection={() => setIsCaseInspectionOpen(true)}
        />

        {/* Main Body with Fixed Sidebar */}
        <div className="flex pt-14 w-full">
          <Sidebar currentPath={currentPath} onNavigate={navigate} />
          <main className="ml-64 flex-1 min-w-0 pb-12 min-h-[calc(100vh-3.5rem)] w-[calc(100%-16rem)] overflow-x-hidden">
            {renderCurrentPage()}
          </main>
        </div>

        {/* Global Modals */}
        <UploadBundleModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onCaseCreated={handleCaseCreated}
          onNavigate={navigate}
        />

        <CaseInspectionModal
          isOpen={isCaseInspectionOpen}
          onClose={() => setIsCaseInspectionOpen(false)}
          onNavigate={navigate}
        />
      </div>
    </ToastProvider>
  );
}

export default App;
