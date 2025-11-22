import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CATEGORIES } from "@/lib/data";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, MapPin, ExternalLink, Share2, FileText, CheckCircle, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { fetchSchemeById } from "@/lib/api";

export default function SchemeDetails() {
  const { id } = useParams();
  
  const { data: scheme, isLoading, error } = useQuery({
    queryKey: ["scheme", id],
    queryFn: () => fetchSchemeById(id!),
    enabled: !!id,
  });

  const category = scheme ? CATEGORIES.find(c => c.id === scheme.categoryDetected) : null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading scheme details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !scheme) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Scheme Not Found</h1>
            <Link href="/schemes" className={buttonVariants()}>
              Back to Schemes
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <Link href="/schemes" className="inline-flex items-center text-sm text-gray-500 hover:text-primary mb-6">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to all schemes
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-white to-gray-50">
            <div className="flex flex-wrap gap-3 mb-4">
              {category && <Badge className={category.color}>{category.name}</Badge>}
              <Badge variant="outline">{scheme.source}</Badge>
              {scheme.districtDetected && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {scheme.districtDetected}
                </Badge>
              )}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {scheme.title}
            </h1>
            
            <div className="flex items-center text-sm text-gray-500 gap-6">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" /> Published: {scheme.publishedDate ? format(new Date(scheme.publishedDate), "MMMM d, yyyy") : "N/A"}
              </span>
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" /> Description
                </h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {scheme.description}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" /> Eligibility & Benefits
                </h2>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span>Resident of Maharashtra State.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span>Detailed eligibility criteria would be listed here based on the full scheme document.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span>Specific benefits and subsidy amounts would be detailed here.</span>
                  </li>
                </ul>
              </section>
            </div>

            <div className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                <h3 className="font-bold text-blue-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <a href={scheme.link} target="_blank" rel="noopener noreferrer" className="block w-full">
                    <Button className="w-full bg-primary hover:bg-blue-700 gap-2">
                      Visit Official Website <ExternalLink className="w-4 h-4" />
                    </Button>
                  </a>
                  <Button 
                    variant="outline" 
                    className="w-full gap-2"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: scheme.title,
                          text: scheme.description,
                          url: window.location.href,
                        });
                      }
                    }}
                  >
                    Share Scheme <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-2">Need Help?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Contact the department helpline for assistance with this scheme.
                </p>
                <div className="font-mono text-lg font-bold text-gray-800">
                  1800-123-4567
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
