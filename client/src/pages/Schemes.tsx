import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SchemeCard } from "@/components/SchemeCard";
import { CATEGORIES, DISTRICTS } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, X, Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { fetchSchemes } from "@/lib/api";

export default function Schemes() {
  const [location] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [districtFilter, setDistrictFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    const d = params.get("district");
    const c = params.get("category");

    if (q) setSearchTerm(q);
    if (d) setDistrictFilter(d);
    if (c) setCategoryFilter(c);
  }, [location]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["schemes", page, searchTerm, districtFilter, categoryFilter],
    queryFn: () => fetchSchemes({
      page,
      size: 20,
      q: searchTerm || undefined,
      district: districtFilter !== "all" ? districtFilter : undefined,
      category: categoryFilter !== "all" ? categoryFilter : undefined,
    }),
  });

  const clearFilters = () => {
    setSearchTerm("");
    setDistrictFilter("all");
    setCategoryFilter("all");
    setPage(1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Government Schemes</h1>
          <p className="text-gray-600">Find and apply for schemes relevant to you.</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 sticky top-20 z-40">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-5 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                placeholder="Search schemes..." 
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="pl-9"
              />
            </div>
            
            <div className="md:col-span-3">
              <Select value={districtFilter} onValueChange={(val) => {
                setDistrictFilter(val);
                setPage(1);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="District" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Districts</SelectItem>
                  {DISTRICTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-3">
              <Select value={categoryFilter} onValueChange={(val) => {
                setCategoryFilter(val);
                setPage(1);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {CATEGORIES.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-1">
               {(searchTerm || districtFilter !== "all" || categoryFilter !== "all") && (
                 <Button variant="ghost" size="icon" onClick={clearFilters} title="Clear Filters" className="w-full">
                   <X className="w-4 h-4" />
                 </Button>
               )}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading schemes...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
              <X className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Error loading schemes</h3>
            <p className="text-gray-500 mb-6">Please try again later.</p>
          </div>
        ) : data && data.schemes.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.schemes.map(scheme => (
                <SchemeCard key={scheme.id} scheme={scheme} />
              ))}
            </div>
            
            {data.total > data.size && (
              <div className="mt-8 flex justify-center gap-2">
                <Button 
                  variant="outline" 
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <span className="flex items-center px-4 text-sm text-gray-600">
                  Page {page} of {Math.ceil(data.total / data.size)}
                </span>
                <Button 
                  variant="outline" 
                  disabled={page >= Math.ceil(data.total / data.size)}
                  onClick={() => setPage(p => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <Filter className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No schemes found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or filters to find what you're looking for.</p>
            <Button onClick={clearFilters} variant="outline">Clear Filters</Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
