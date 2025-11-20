import { Link } from "wouter";
import { Card, CardContent } from "./ui/card";
import { CATEGORIES } from "@/lib/data";
import * as Icons from "lucide-react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function CategoryGrid() {
  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Explore Categories</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Browse schemes by beneficiary type or sector to find exactly what applies to you.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((category) => {
            // Dynamically get the icon component
            const IconComponent = (Icons[category.iconName as keyof typeof Icons] as LucideIcon) || Icons.HelpCircle;
            
            return (
              <Link key={category.id} href={`/schemes?category=${category.id}`}>
                <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden border-none shadow-sm group h-full">
                  <CardContent className="p-6 flex flex-col items-center text-center gap-4 h-full justify-between bg-white">
                    <div className={cn("p-4 rounded-2xl transition-colors", category.color)}>
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2 text-lg">{category.name}</h3>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        {category.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
