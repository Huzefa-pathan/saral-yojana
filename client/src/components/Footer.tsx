import { Link } from "wouter";
import { Logo } from "./ui/logo";
import { ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <Logo />
            <p className="text-sm text-slate-400 leading-relaxed">
              Empowering citizens of Maharashtra with easy access to government schemes and welfare programs.
            </p>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/schemes" className="hover:text-primary transition-colors">Browse Schemes</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/support" className="hover:text-primary transition-colors">Support</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">Official Portals</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="https://www.india.gov.in/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-1">India.gov.in <ExternalLink className="w-3 h-3" /></a></li>
              <li><a href="https://www.mygov.in/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-1">MyGov <ExternalLink className="w-3 h-3" /></a></li>
              <li><a href="https://www.maharashtra.gov.in/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-1">Maharashtra.gov.in <ExternalLink className="w-3 h-3" /></a></li>
              <li><a href="https://myscheme.gov.in/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-1">MyScheme <ExternalLink className="w-3 h-3" /></a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">Feedback</h3>
            <p className="text-sm text-slate-400 mb-4">
              Help us improve your experience. Share your feedback with us.
            </p>
            <a 
              href="https://docs.google.com/forms" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Give Feedback
            </a>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} Saral Yojana Maharashtra. All rights reserved.</p>
          <p className="mt-2 text-xs">This is a prototype website for demonstration purposes.</p>
        </div>
      </div>
    </footer>
  );
}
