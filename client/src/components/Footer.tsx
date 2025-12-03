import { Link } from "wouter";
import { ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Logo + Text */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <img src="/logo.png" alt="Saral Yojana Logo" className="h-10 w-auto" />
            </Link>
            
            <p className="text-sm text-slate-400 leading-relaxed">
              Empowering citizens of Maharashtra with easy access to government schemes and welfare programs.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/schemes" className="hover:text-primary transition-colors">All Schemes</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">About</Link></li>
              <li><Link href="/support" className="hover:text-primary transition-colors">Support</Link></li>
            </ul>
          </div>

          {/* Government Links */}
          <div>
            <h3 className="text-white font-bold mb-4">Official Portals</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="https://www.india.gov.in/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-1">India.gov.in <ExternalLink className="w-3 h-3" /></a></li>
              <li><a href="https://www.mygov.in/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-1">MyGov <ExternalLink className="w-3 h-3" /></a></li>
              <li><a href="https://www.maharashtra.gov.in/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-1">Maharashtra.gov.in <ExternalLink className="w-3 h-3" /></a></li>
              <li><a href="https://myscheme.gov.in/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-1">MyScheme <ExternalLink className="w-3 h-3" /></a></li>
            </ul>
          </div>

          {/* Feedback */}
          <div>
            <h3 className="text-white font-bold mb-4">Feedback</h3>
            <p className="text-sm text-slate-400 mb-4">
              Help us improve Saral Yojana by submitting your feedback.
            </p>
            <Link 
              href="/support#review-system" 
              className="inline-block bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Give Feedback
            </Link>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} Saral Yojana. All rights reserved.</p>
          {/* <p className="mt-2 text-xs">This is a prototype website for demonstration purposes.</p> */}
        </div>
      </div>
    </footer>
  );
}
