import { Link } from "wouter";
import { Button } from "./ui/button";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Saral Yojana Logo" className="h-10 w-auto" />
          <span className="text-xl font-bold text-primary">Saral Yojana</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <Link href="/schemes" className="hover:text-primary transition-colors">All Schemes</Link>
          <Link href="/about" className="hover:text-primary transition-colors">About</Link>
          <Link href="/support" className="hover:text-primary transition-colors">Support</Link>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/schemes">
            <Button className="bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all">
              Find Schemes
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
