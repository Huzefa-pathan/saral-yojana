import { Link } from "wouter";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { buttonVariants } from "./ui/button";
import { MapPin, ArrowRight } from "lucide-react";
import { CATEGORIES } from "@/lib/data";
import { cn } from "@/lib/utils";

interface SchemeCardProps {
  scheme: any;
}

function getSourceBadgeText(source: string): string {
  if (source === "state") return "State Govt";
  if (source === "central") return "Central Govt";
  return source;
}

export function SchemeCard({ scheme }: SchemeCardProps) {
  const category = CATEGORIES.find(c => c.id === scheme.category);
  
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 overflow-hidden flex flex-col h-full bg-white">
      <CardHeader className="p-5 pb-2 space-y-3">
        <div className="flex justify-between items-start gap-2">
          <Badge 
            variant="secondary" 
            className={cn("rounded-md px-2.5 py-0.5 font-medium", category?.color || "bg-gray-100 text-gray-700")}
            data-testid={`badge-category-${scheme.id}`}
          >
            {category?.name || "General"}
          </Badge>
          <Badge variant="outline" className="text-xs text-gray-500 border-gray-200" data-testid={`badge-source-${scheme.id}`}>
            {getSourceBadgeText(scheme.source)}
          </Badge>
        </div>
        <Link href={`/scheme/${scheme.id}`} className="hover:text-primary transition-colors block">
          <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-primary transition-colors" data-testid={`title-${scheme.id}`}>
            {scheme.title}
          </h3>
        </Link>
      </CardHeader>
      
      <CardContent className="p-5 pt-2 flex-grow">
        {scheme.district && (
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-3" data-testid={`district-${scheme.id}`}>
            <MapPin className="w-3.5 h-3.5" />
            <span>{scheme.district}</span>
          </div>
        )}
        
        <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed" data-testid={`description-${scheme.id}`}>
          {scheme.description}
        </p>
      </CardContent>

      <CardFooter className="p-5 pt-0 border-t border-gray-50 bg-gray-50/50 mt-auto">
        <Link href={`/scheme/${scheme.id}`} className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "w-full justify-end group/btn text-primary hover:text-primary hover:bg-primary/5 px-0 font-medium")} data-testid={`link-details-${scheme.id}`}>
          Read Details <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </CardFooter>
    </Card>
  );
}
