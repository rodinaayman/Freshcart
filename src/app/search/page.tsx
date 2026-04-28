"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { FaBoxOpen, FaSearch, FaFilter, FaTimes } from "react-icons/fa";
import { Category } from "@/interfaces/categories.interface";
import { Brand } from "@/interfaces/brands.interface";
import { searchProducts } from "@/services/search.service";
import ProductCard from "@/components/shared/ProductCard";

const BASE_URL = "https://ecommerce.routemisr.com/api/v1";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchInput, setSearchInput] = useState(query);
  const [sortBy, setSortBy] = useState("");

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          fetch(`${BASE_URL}/categories`).then(res => res.json()),
          fetch(`${BASE_URL}/brands`).then(res => res.json())
        ]);
        setCategories(catRes.data || []);
        setBrands(brandRes.data || []);
      } catch (error) {
        console.error("Error fetching filters:", error);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const result = await searchProducts({
          keyword: query,
          categoryIds: selectedCategories,
          brandIds: selectedBrands,
          minPrice: minPrice,
          maxPrice: maxPrice,
          sort: sortBy,
          limit: 50
        });
        
        setProducts(result.data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query, selectedCategories, selectedBrands, minPrice, maxPrice, sortBy]);

  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/search?q=${searchInput}`);
    } else {
      router.push('/search');
    }
    setSelectedCategories([]);
    setSelectedBrands([]);
    setMinPrice("");
    setMaxPrice("");
  };

  const handleCategoryChange = (id: string) => {
    setSelectedCategories(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleBrandChange = (id: string) => {
    setSelectedBrands(prev => 
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  };

  const handlePricePreset = (min: string, max: string) => {
    setMinPrice(min);
    setMaxPrice(max);
  };

  const clearFilters = () => {
    router.push('/search');
    setSelectedCategories([]);
    setSelectedBrands([]);
    setMinPrice("");
    setMaxPrice("");
    setSortBy("");
  };

  const removeFilter = (type: "category" | "brand" | "query", id?: string) => {
    if (type === "query") {
      router.push('/search');
    } else if (type === "category" && id) {
      setSelectedCategories(prev => prev.filter(c => c !== id));
    } else if (type === "brand" && id) {
      setSelectedBrands(prev => prev.filter(b => b !== id));
    }
  };

  const getCategoryName = (id: string) => categories.find(c => c._id === id)?.name || "";
  const getBrandName = (id: string) => brands.find(b => b._id === id)?.name || "";

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-6">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-primary-600 transition-colors">Home</Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-medium">Search Results</span>
          </nav>
          
          <form onSubmit={handleSearchSubmit} className="max-w-2xl">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                placeholder="Search for products..." 
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-lg" 
                type="text" 
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
          </form>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          
          <div className="hidden lg:block w-72 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
              <div className="space-y-6">
                
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900">Categories</h3>
                  </div>
                  <div className="space-y-2 max-h-52 overflow-y-auto">
                    {categories.map((cat) => (
                      <label key={cat._id} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" 
                          type="checkbox" 
                          checked={selectedCategories.includes(cat._id)}
                          onChange={() => handleCategoryChange(cat._id)}
                        />
                        <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{cat.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <hr className="border-gray-100" />

                <div>
                  <h3 className="font-bold text-gray-900 mb-4">Price Range</h3>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Min (EGP)</label>
                      <input 
                        placeholder="0" 
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none" 
                        type="number" 
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Max (EGP)</label>
                      <input 
                        placeholder="No limit" 
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none" 
                        type="number" 
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => handlePricePreset("0", "500")} className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors bg-gray-100 text-gray-600 hover:bg-gray-200">Under 500</button>
                    <button type="button" onClick={() => handlePricePreset("0", "1000")} className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors bg-gray-100 text-gray-600 hover:bg-gray-200">Under 1K</button>
                    <button type="button" onClick={() => handlePricePreset("0", "5000")} className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors bg-gray-100 text-gray-600 hover:bg-gray-200">Under 5K</button>
                    <button type="button" onClick={() => handlePricePreset("0", "10000")} className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors bg-gray-100 text-gray-600 hover:bg-gray-200">Under 10K</button>
                  </div>
                </div>

                <hr className="border-gray-100" />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900">Brands</h3>
                  </div>
                  <div className="space-y-2 max-h-52 overflow-y-auto">
                    {brands.map((brand) => (
                      <label key={brand._id} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" 
                          type="checkbox" 
                          checked={selectedBrands.includes(brand._id)}
                          onChange={() => handleBrandChange(brand._id)}
                        />
                        <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{brand.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>

          <main className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <button className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors">
                  <FaFilter /> Filters
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Sort by:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none bg-white"
                >
                  <option value="">Relevance</option>
                  <option value="price">Price: Low to High</option>
                  <option value="-price">Price: High to Low</option>
                  <option value="-ratingsAverage">Rating: High to Low</option>
                  <option value="title">Name: A to Z</option>
                  <option value="-title">Name: Z to A</option>
                </select>
              </div>
            </div>

            {(query || selectedCategories.length > 0 || selectedBrands.length > 0) && (
              <div className="mb-6 flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-500 flex items-center gap-1"><FaFilter className="text-xs" /> Active:</span>
                
                {query && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs">
                    "{query}"
                    <button onClick={() => removeFilter("query")} className="hover:text-red-500"><FaTimes /></button>
                  </span>
                )}

                {selectedCategories.map(id => (
                  <span key={id} className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary-100 text-primary-700 text-xs">
                    {getCategoryName(id)}
                    <button onClick={() => removeFilter("category", id)} className="hover:text-red-500"><FaTimes /></button>
                  </span>
                ))}

                {selectedBrands.map(id => (
                  <span key={id} className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-violet-100 text-violet-700 text-xs">
                    {getBrandName(id)}
                    <button onClick={() => removeFilter("brand", id)} className="hover:text-red-500"><FaTimes /></button>
                  </span>
                ))}

                <button onClick={clearFilters} className="text-xs text-gray-500 hover:text-gray-700 underline ml-2">Clear all</button>
              </div>
            )}

            {products.length === 0 ? (
               <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                 <FaBoxOpen className="mx-auto w-16 h-16 text-gray-300 mb-4" />
                 <h3 className="text-xl font-semibold text-gray-800 mb-2">No results found</h3>
                 <p className="text-gray-500 mb-6">Try adjusting your filters or search term.</p>
                 <button onClick={clearFilters} className="text-primary-600 font-medium hover:underline">Clear Filters</button>
               </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-green-600" /></div>}>
      <SearchContent />
    </Suspense>
  );
}