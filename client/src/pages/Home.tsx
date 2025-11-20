import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { DistrictGrid } from "@/components/DistrictGrid";
import { CategoryGrid } from "@/components/CategoryGrid";
import { Footer } from "@/components/Footer";
import { SchemeCard } from "@/components/SchemeCard";
import { MOCK_SCHEMES } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const recentSchemes = MOCK_SCHEMES.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        
        <DistrictGrid />
        
        <CategoryGrid />

        {/* Recent Schemes Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Latest Schemes</h2>
                <p className="text-gray-500">Recently added government welfare programs</p>
              </div>
              <Link href="/schemes">
                <Button variant="outline" className="hidden sm:flex items-center gap-2">
                  View All Schemes <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentSchemes.map((scheme) => (
                <SchemeCard key={scheme.id} scheme={scheme} />
              ))}
            </div>
            
            <div className="mt-8 text-center sm:hidden">
              <Link href="/schemes">
                <Button variant="outline" className="w-full">
                  View All Schemes
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Need Help Finding a Scheme?</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Our intelligent search helps you find the most relevant government schemes based on your profile.
            </p>
            <Link href="/schemes">
              <Button size="lg" className="bg-white text-primary hover:bg-slate-100 text-lg px-8 h-14 rounded-full font-bold shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">
                Start Searching Now
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
