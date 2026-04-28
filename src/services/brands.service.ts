import { Brand } from "@/interfaces/brands.interface";
import { ListingResponse } from "@/interfaces/listing.api.interface"; // استيراد الـ Interface
import { Product } from "@/interfaces/products.interfsces";

const BASE_URL = "https://ecommerce.routemisr.com/api/v1";

export async function getBrands(): Promise<ListingResponse<Brand>> {
    try {
        const response = await fetch(`${BASE_URL}/brands`, { 
            cache: 'no-store'
        });
        
        if (!response.ok) {
            throw new Error(response.statusText + " Error occurred in fetching Brands");
        }
        
        const data = await response.json();
        return data; 

    } catch (error) {
        console.error("Error fetching brands:", error);
        return {
            results: 0,
            metadata: { currentPage: 1, numberOfPages: 1, limit: 40 },
            data: []
        };
    }
}

export async function getBrandDetails(id: string): Promise<Brand | null> {
  try {
    const res = await fetch(`${BASE_URL}/brands/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching Brand details:", error);
    return null;
  }
}

export async function getBrandProducts(id: string): Promise<ListingResponse<Product>> {
  try {
    const res = await fetch(`${BASE_URL}/products?brand=${id}`, { cache: 'no-store' });
    if (!res.ok) {
      return { results: 0, metadata: { currentPage: 1, numberOfPages: 1, limit: 40 }, data: [] };
    }
    const data = await res.json();
    return data;
  } catch (error) {
    return { results: 0, metadata: { currentPage: 1, numberOfPages: 1, limit: 40 }, data: [] };
  }
}