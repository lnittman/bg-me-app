import { Header } from "@/components/ui/header";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="fixed inset-0 flex flex-col bg-background">
      <Header />
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
} 