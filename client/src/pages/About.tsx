import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Package, CheckCircle2, Users, Globe } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero */}
        <section className="bg-primary text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Saral Yojana</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Bridging the gap between the Government of Maharashtra and its citizens through accessible, transparent, and simplified information about welfare schemes.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-16 container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="w-12 h-12 bg-blue-100 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Our Vision</h3>
              <p className="text-gray-600">
                To ensure every eligible citizen in Maharashtra is aware of and can access the government benefits they are entitled to.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Who We Serve</h3>
              <p className="text-gray-600">
                Farmers, students, women, senior citizens, and rural communities across all 36 districts of Maharashtra.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">What We Do</h3>
              <p className="text-gray-600">
                We aggregate scheme information from multiple official sources (PIB, India.gov, State Portals) into one easy-to-search platform.
              </p>
            </div>
          </div>
        </section>

        {/* Stats 
        <section className="bg-slate-900 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">500+</div>
                <div className="text-slate-400">Schemes Listed</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">36</div>
                <div className="text-slate-400">Districts Covered</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">8</div>
                <div className="text-slate-400">Major Categories</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">10k+</div>
                <div className="text-slate-400">Daily Visitors</div>
              </div>
            </div>
          </div>
        </section>*/}
      </main>

      <Footer />
    </div>
  );
}
