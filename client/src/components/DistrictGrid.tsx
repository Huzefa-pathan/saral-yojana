import { Link } from "wouter";
import { Card, CardContent } from "./ui/card";
import { MapPin } from "lucide-react";
import { STATES } from "@/lib/data";

export function DistrictGrid() {
  // Show top 8 states for the home page
  const displayedStates = STATES.slice(0, 8);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Browse by State</h2>
            <p className="text-gray-500">Find schemes tailored to each state-level program</p>
          </div>
          <Link href="/schemes">
            <a className="text-primary font-medium hover:underline flex items-center gap-1">
              View all states
            </a>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {displayedStates.map((state) => (
            <Link key={state} href={`/schemes?district=${state}`}>
              <Card className="hover:border-primary/50 hover:shadow-md cursor-pointer transition-all group bg-slate-50 border-slate-100">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center h-32 gap-3">
                  <div className="bg-white p-2 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors">
                    {state}
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
