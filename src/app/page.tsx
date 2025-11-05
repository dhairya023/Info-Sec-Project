import { AppHeader } from '@/components/layout/app-header';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { Workspace } from '@/components/crypto/workspace';
import { VisualizationPanel } from '@/components/crypto/visualization-panel';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function PageSkeleton() {
  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      <AppHeader />
      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 border-r p-4">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
        <main className="flex flex-1 flex-col overflow-y-auto">
          <div className="flex-1 p-8">
            <Skeleton className="h-12 w-1/4 mb-6" />
            <Skeleton className="h-64 w-full" />
          </div>
        </main>
      </div>
    </div>
  )
}

function PageContent({ algorithm }: { algorithm: string }) {
  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      <AppHeader />
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar selectedAlgorithm={algorithm} />
        <div className="flex flex-1 flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <Workspace algorithm={algorithm} />
          </main>
          <VisualizationPanel />
        </div>
      </div>
    </div>
  );
}

export default function Home({ searchParams }: { searchParams?: { algorithm?: string } }) {
  const selectedAlgorithm = searchParams?.algorithm || 'caesar';

  return (
    <Suspense fallback={<PageSkeleton />}>
      <PageContent algorithm={selectedAlgorithm} />
    </Suspense>
  );
}
