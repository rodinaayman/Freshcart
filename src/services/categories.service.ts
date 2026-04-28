import { CategoriesResponse } from "@/types/respones.type";
import { Category } from '@/interfaces/categories.interface';
import { Product } from '@/interfaces/products.interfsces';
import { ListingResponse } from "@/interfaces/listing.api.interface";

const BASE_URL = "https://ecommerce.routemisr.com/api/v1";

export async function getCategories(): Promise<CategoriesResponse> {
    try {
        const response = await fetch(`${BASE_URL}/categories`, { cache: 'no-store' });
        if (!response.ok) {
            throw new Error(response.statusText + " Error Occurred");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
        return {
            results: 0,
            metadata: { currentPage: 1, numberOfPages: 1, limit: 40 },
            data: []
        };
    }
}

export async function getCategoryDetails(id: string): Promise<Category | null> {
  try {
    const res = await fetch(`${BASE_URL}/categories/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching category details:", error);
    return null;
  }
}

export async function getSubcategories(categoryId: string): Promise<ListingResponse<any>> {
  try {
    const res = await fetch(`${BASE_URL}/categories/${categoryId}/subcategories`, { cache: 'no-store' });
    if (!res.ok) {
      return { results: 0, metadata: { currentPage: 1, numberOfPages: 1, limit: 40 }, data: [] };
    }
    const data = await res.json();
    return data; 
  } catch (error) {
    return { results: 0, metadata: { currentPage: 1, numberOfPages: 1, limit: 40 }, data: [] };
  }
}

export async function getSubcategoryDetails(id: string): Promise<any> {
  try {
    const res = await fetch(`${BASE_URL}/subcategories/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching subcategory details:", error);
    return null;
  }
}

export async function getSubcategoryProducts(id: string): Promise<ListingResponse<Product>> {
  try {
    const res = await fetch(`${BASE_URL}/products?subcategory[in]=${id}`, { cache: 'no-store' });
    if (!res.ok) {
      return { results: 0, metadata: { currentPage: 1, numberOfPages: 1, limit: 40 }, data: [] };
    }
    const data = await res.json();
    return data; 
  } catch (error) {
    return { results: 0, metadata: { currentPage: 1, numberOfPages: 1, limit: 40 }, data: [] };
  }
}

export async function getCategoryProducts(id: string): Promise<ListingResponse<Product>> {
  try {
    const res = await fetch(`${BASE_URL}/products?category[in]=${id}`, { cache: 'no-store' });
    if (!res.ok) {
       return { results: 0, metadata: { currentPage: 1, numberOfPages: 1, limit: 40 }, data: [] };
    }
    const data = await res.json();
    return data; 
  } catch (error) {
    return { results: 0, metadata: { currentPage: 1, numberOfPages: 1, limit: 40 }, data: [] };
  }
}

