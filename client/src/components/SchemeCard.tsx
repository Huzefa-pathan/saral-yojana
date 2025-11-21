import { Link } from "wouter";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { buttonVariants } from "./ui/button";
import { Calendar, MapPin, ArrowRight, CheckCircle2 } from "lucide-react";
import { type Scheme, CATEGORIES } from "@/lib/data";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface SchemeCardProps {
  scheme: Scheme;
}

export function SchemeCard({ scheme }: SchemeCardProps) {
  const category = CATEGORIES.find(c => c.id === scheme.categoryDetected);
  
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 overflow-hidden flex flex-col h-full bg-white">
      <CardHeader className="p-5 pb-2 space-y-3">
        <div className="flex justify-between items-start gap-2">
          <Badge 
            variant="secondary" 
            className={cn("rounded-md px-2.5 py-0.5 font-medium", category?.color || "bg-gray-100 text-gray-700")}
          >
            {category?.name || scheme.categoryDetected || "General"}
          </Badge>
          <Badge variant="outline" className="text-xs text-gray-500 border-gray-200">
            {scheme.source}
          </Badge>
        </div>
        <Link href={`/scheme/${scheme.id}`} className="hover:text-primary transition-colors block">
          <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-primary transition-colors">
            {scheme.title}
          </h3>
        </Link>
      </CardHeader>
      
      <CardContent className="p-5 pt-2 flex-grow">
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>{scheme.districtDetected || "All Maharashtra"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{scheme.publishedDate ? format(new Date(scheme.publishedDate), "MMM d, yyyy") : "N/A"}</span>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
          {scheme.description}
        </p>
      </CardContent>

      <CardFooter className="p-5 pt-0 border-t border-gray-50 bg-gray-50/50 mt-auto">
        <div className="w-full flex items-center justify-between pt-4">
          <div className="flex gap-2">
             {scheme.relevanceScore >= 8 && (
               <div className="flex items-center gap-1 text-[10px] font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                 <CheckCircle2 className="w-3 h-3" /> Highly Relevant
               </div>
             )}
          </div>
          <Link href={`/scheme/${scheme.id}`} className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "group/btn text-primary hover:text-primary hover:bg-primary/5 px-0 font-medium")}>
            Read Details <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
