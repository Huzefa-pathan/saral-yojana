import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { CategoryGrid } from "@/components/CategoryGrid";
import { Footer } from "@/components/Footer";
import { SchemeCard } from "@/components/SchemeCard";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Loader2 } from "lucide-react";
import { fetchSchemes } from "@/lib/api";

export default function Home() {

  const { data, isLoading } = useQuery({
    queryKey: ["recent-schemes"],
    queryFn: () => fetchSchemes({ page: 1, size: 3 }),
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        
        <CategoryGrid />

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Latest Schemes</h2>
                <p className="text-gray-500">Recently added and updated government schemes</p>
              </div>
              <Link href="/schemes">
                <Button variant="outline" className="hidden sm:flex items-center gap-2">
                  View all schemes <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-2" />
                <p className="text-gray-500 text-sm">Loading schemes...</p>
              </div>
            ) : data && data.schemes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {data.schemes.map((scheme) => (
                  <SchemeCard key={scheme.id} scheme={scheme} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                No schemes available.
              </div>
            )}
            
            <div className="mt-8 text-center sm:hidden">
              <Link href="/schemes">
                <Button variant="outline" className="w-full">
                  View all schemes
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 bg-primary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Need help finding a scheme?</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Use our intelligent scheme search to quickly check eligibility and view application steps.
            </p>
            <Link href="/schemes">
              <Button size="lg" className="bg-white text-primary hover:bg-slate-100 text-lg px-8 h-14 rounded-full font-bold shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">
                Start searching
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
