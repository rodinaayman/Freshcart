import { Product } from "@/interfaces/products.interfsces";

const BASE_URL = "https://ecommerce.routemisr.com/api/v1";

interface SearchParams {
  keyword?: string;
  categoryIds?: string[];
  brandIds?: string[];
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
  limit?: number;
}

interface SearchResponse {
  results: number;
  metadata: {
    currentPage: number;
    numberOfPages: number;
    limit: number;
  };
  data: Product[];
}

export const searchProducts = async (params: SearchParams): Promise<SearchResponse> => {
  try {
    let url = `${BASE_URL}/products?limit=${params.limit || 50}`;
    
    if (params.keyword) url += `&keyword=${params.keyword}`;
    
    if (params.categoryIds && params.categoryIds.length > 0) {
      params.categoryIds.forEach(id => url += `&category[in]=${id}`);
    }

    if (params.brandIds && params.brandIds.length > 0) {
      params.brandIds.forEach(id => url += `&brand[in]=${id}`);
    }

    if (params.minPrice) url += `&price[gte]=${params.minPrice}`;
    if (params.maxPrice) url += `&price[lte]=${params.maxPrice}`;
    if (params.sort) url += `&sort=${params.sort}`;

    const response = await fetch(url, { cache: 'no-store' });
    
    if (!response.ok) {
      throw new Error("Failed to search products");
    }

    return await response.json();
  } catch (error) {
    console.error("Search service error:", error);
    return {
      results: 0,
      metadata: { currentPage: 1, numberOfPages: 1, limit: 50 },
      data: []
    };
  }
};