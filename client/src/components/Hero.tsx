import { useState } from "react";
import { Search, MapPin, Filter } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { STATES, CATEGORIES } from "@/lib/data";
import { useLocation } from "wouter";
import heroBg from "@assets/generated_images/hero_background_of_lush_agriculture_fields_in_maharashtra.png";

export function Hero() {
  const [search, setSearch] = useState("");
  const [district, setDistrict] = useState("");
  const [category, setCategory] = useState("");
  const [, setLocation] = useLocation();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (search) params.append("q", search);
    if (district) params.append("district", district);
    if (category) params.append("category", category);
    setLocation(`/schemes?${params.toString()}`);
  };

  return (
    <div className="relative w-full min-h-[600px] flex items-center justify-center overflow-hidden py-20 md:py-0">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroBg} 
          alt="Maharashtra Agriculture" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 to-primary/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-700">
          Saral Yojana Maharashtra
        </h1>
        <p className="text-xl text-slate-100 mb-10 max-w-2xl mx-auto drop-shadow-md animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
          Connecting citizens with government welfare schemes. Find benefits for farmers, students, women, and more.
        </p>

        {/* Search Box */}
        <div className="bg-white p-4 rounded-2xl shadow-2xl max-w-4xl mx-auto flex flex-col md:flex-row gap-3 animate-in fade-in zoom-in-95 duration-700 delay-300 items-center">
          <div className="flex-1 relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input 
              placeholder="Search schemes (e.g., crop insurance)" 
              className="pl-10 h-12 border-gray-200 bg-gray-50 focus:bg-white transition-colors text-base"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="w-full md:w-48">
            <Select value={district} onValueChange={setDistrict}>
              <SelectTrigger className="h-12 border-gray-200 bg-gray-50 focus:bg-white">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <SelectValue placeholder="State" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {STATES.map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:w-48">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-12 border-gray-200 bg-gray-50 focus:bg-white">
                <div className="flex items-center gap-2 text-gray-600">
                  <Filter className="w-4 h-4" />
                  <SelectValue placeholder="Category" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            className="w-full md:w-auto h-12 px-8 bg-primary hover:bg-blue-700 text-white font-semibold rounded-lg transition-all"
            onClick={handleSearch}
          >
            Search
          </Button>
        </div>
        
        <div className="mt-6 flex flex-col md:flex-row items-center justify-center gap-4 text-sm text-white/80 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
          <span>Trending:</span>
          <div className="flex flex-wrap justify-center gap-2">
             <span className="bg-white/20 px-3 py-1 rounded-full hover:bg-white/30 cursor-pointer transition-colors">Crop Insurance</span>
             <span className="bg-white/20 px-3 py-1 rounded-full hover:bg-white/30 cursor-pointer transition-colors">Education Loan</span>
             <span className="bg-white/20 px-3 py-1 rounded-full hover:bg-white/30 cursor-pointer transition-colors">Housing</span>
          </div>
        </div>
      </div>
    </div>
  );
}
