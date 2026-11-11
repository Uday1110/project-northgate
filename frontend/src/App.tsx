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

  const renderCurrentPage = () => {
    switch (currentPath) {
      case '/':
      case '/intake-queue':
        return <IntakeQueue onNavigate={navigate} />;
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
        return <IntakeQueue onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col font-body-md text-on-surface">
      <Header currentPath={currentPath} />
      <div className="flex pt-14">
        <Sidebar currentPath={currentPath} onNavigate={navigate} />
        <main className="ml-64 flex-1 pb-12 min-h-[calc(100vh-3.5rem)]">
          {renderCurrentPage()}
        </main>
      </div>
    </div>
  );
}

export default App;
