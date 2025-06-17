import type { Product, Category, User } from "./types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://friendly-space-zebra-r4pr7j4pq5jcxj47-8001.app.github.dev";

// Common fetch options
const defaultOptions: RequestInit = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
};

// Helper function to handle fetch responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export class ApiService {
  static async checkApiHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}`, defaultOptions);
      return response.ok;
    } catch (error) {
      console.error("API health check failed:", error);
      return false;
    }
  }

  static async getProducts(count = 20): Promise<Product[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/?count=${count}`, defaultOptions);
      return handleResponse<Product[]>(response);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      throw error;
    }
  }

  static async getProduct(productId: string): Promise<Product> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}`, defaultOptions);
      return handleResponse<Product>(response);
    } catch (error) {
      console.error("Failed to fetch product:", error);
      throw error;
    }
  }

  static async getCategories(): Promise<Category[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/`, defaultOptions);
      return handleResponse<Category[]>(response);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      throw error;
    }
  }

  static async getCurrentUser(): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/current`, defaultOptions);
      return handleResponse<User>(response);
    } catch (error) {
      console.error("Failed to fetch current user:", error);
      throw error;
    }
  }
}
