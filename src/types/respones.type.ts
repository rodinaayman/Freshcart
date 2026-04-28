import { Category } from "@/interfaces/categories.interface";
import { ListingResponse } from "@/interfaces/listing.api.interface";
import { Product } from "@/interfaces/products.interfsces";
import { Brand } from '../interfaces/brands.interface';

export type CategoriesResponse  = ListingResponse<Category>;
export type ProductsResponse  = ListingResponse<Product>;
export type BrandsResponse  = ListingResponse<Brand>;