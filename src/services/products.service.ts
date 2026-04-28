import { Product } from "@/interfaces/products.interfsces";
import { ListingResponse } from "@/interfaces/listing.api.interface";

const BASE_URL = "https://ecommerce.routemisr.com/api/v1";

export async function getProducts(limit: number = 40): Promise<ListingResponse<Product>> {
  try {
    const response = await fetch(`${BASE_URL}/products?limit=${limit}`, { cache: 'no-store' });
    if (!response.ok) throw new Error("Error occurred in fetching products");
    return await response.json();
  } catch (error) {
    return { results: 0, metadata: { currentPage: 1, numberOfPages: 1, limit }, data: [] };
  }
}

export async function getProductDetails(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`${BASE_URL}/products/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching product details:", error);
    return null;
  }
}

export async function getRelatedProducts(categoryId: string, currentProductId: string): Promise<Product[]> {
  try {
    const res = await fetch(`${BASE_URL}/products?category[in]=${categoryId}`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data: ListingResponse<Product> = await res.json();
    return data.data.filter(p => p._id !== currentProductId).slice(0, 6);
  } catch (error) {
    return [];
  }
}



export async function searchProducts(keyword: string): Promise<ListingResponse<Product>> {
  try {
    const response = await fetch(`${BASE_URL}/products?keyword=${keyword}`, { cache: 'no-store' });
    if (!response.ok) throw new Error("Error occurred in searching products");
    return await response.json();
  } catch (error) {
    return { results: 0, metadata: { currentPage: 1, numberOfPages: 1, limit: 40 }, data: [] };
  }
}