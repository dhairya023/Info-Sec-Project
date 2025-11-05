import { Logo } from "@/components/icons/logo";
import { ThemeToggle } from "@/components/theme-toggle";

export function AppHeader() {
  return (
    <header className="flex h-16 items-center justify-between border-b px-4 md:px-6 flex-shrink-0">
      <div className="flex items-center gap-3">
        <Logo />
        <h1 className="text-xl font-bold font-headline">CryptoLab</h1>
      </div>
      <ThemeToggle />
    </header>
  );
}
