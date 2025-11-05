import Link from "next/link";
import { algorithms, AlgorithmCategory, AlgorithmId } from "@/lib/algorithms";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const categories: AlgorithmCategory[] = ["Beginner", "Intermediate", "Advanced", "Hashing", "Signatures"];

const difficultyColors = {
  Beginner: "bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30",
  Intermediate: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30",
  Advanced: "bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/30",
};

export function AppSidebar({ selectedAlgorithm }: { selectedAlgorithm: string }) {
  const groupedAlgorithms = algorithms.reduce((acc, algo) => {
    (acc[algo.category] = acc[algo.category] || []).push(algo);
    return acc;
  }, {} as Record<AlgorithmCategory, typeof algorithms>);

  return (
    <aside className="w-72 border-r bg-card/20 p-4 hidden md:block overflow-y-auto">
      <nav className="space-y-6">
        {categories.map((category) => (
          groupedAlgorithms[category] && (
            <div key={category}>
              <h2 className="px-2 mb-2 text-sm font-semibold tracking-wider text-muted-foreground uppercase">{category}</h2>
              <div className="space-y-2">
                {groupedAlgorithms[category].map((algo) => {
                  const Icon = algo.icon;
                  return (
                    <Link
                      key={algo.id}
                      href={`/?algorithm=${algo.id}`}
                      className={cn(
                        "block rounded-lg p-3 transition-all duration-200 glass-card hover:shadow-md hover:-translate-y-0.5",
                        selectedAlgorithm === algo.id
                          ? "ring-2 ring-primary bg-primary/10 dark:bg-primary/20"
                          : "hover:bg-primary/5 dark:hover:bg-primary/10"
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5 text-primary" />
                          <h3 className="font-semibold font-headline text-base">{algo.name}</h3>
                        </div>
                        <Badge variant="outline" className={cn("text-xs", difficultyColors[algo.difficulty])}>
                          {algo.difficulty}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground pl-8">{algo.description}</p>
                    </Link>
                  );
                })}
              </div>
            </div>
          )
        ))}
      </nav>
    </aside>
  );
}
