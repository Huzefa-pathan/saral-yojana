import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CATEGORIES } from "@/lib/data";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, ExternalLink, Share2, FileText, CheckCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchSchemeById } from "@/lib/api";

export default function SchemeDetails() {
  const { id } = useParams();
  
  const { data: scheme, isLoading, error } = useQuery({
    queryKey: ["scheme", id],
    queryFn: () => fetchSchemeById(id!),
    enabled: !!id,
  });

  const category = scheme ? CATEGORIES.find(c => c.id === scheme.category) : null;

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
              {scheme.district && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {scheme.district}
                </Badge>
              )}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {scheme.title}
            </h1>
          </div>

          <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" /> Description
                </h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {scheme.fullDescription}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" /> Eligibility
                </h2>
                <ul className="space-y-3 text-gray-700">
                  {scheme.eligibility.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" /> Benefits
                </h2>
                <ul className="space-y-3 text-gray-700">
                  {scheme.benefits.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {scheme.documentsRequired.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" /> Documents Required
                  </h2>
                  <ul className="space-y-3 text-gray-700">
                    {scheme.documentsRequired.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                <h3 className="font-bold text-blue-900 mb-4">Apply Now</h3>
                <div className="space-y-3">
                  {scheme.applyMode !== "offline" && scheme.applyOnlineLink && (
                    <a href={scheme.applyOnlineLink} target="_blank" rel="noopener noreferrer" className="block w-full">
                      <Button className="w-full bg-primary hover:bg-blue-700 gap-2">
                        Apply Online <ExternalLink className="w-4 h-4" />
                      </Button>
                    </a>
                  )}
                  {scheme.applyMode !== "online" && scheme.applyOfflineInfo && (
                    <div className="bg-white p-4 rounded-lg border border-blue-200">
                      <p className="text-sm font-medium text-blue-900 mb-2">Apply Offline</p>
                      <p className="text-sm text-gray-700">{scheme.applyOfflineInfo}</p>
                    </div>
                  )}
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
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
