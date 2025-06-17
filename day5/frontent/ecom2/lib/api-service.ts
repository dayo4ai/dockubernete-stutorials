import type { Product, Category, User } from "./types"

// Make API URL configurable with fallback
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001"

// Enhanced mock data as fallback
const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Wireless Bluetooth Headphones",
    description:
      "High-quality wireless headphones with noise cancellation and long battery life. Perfect for music lovers and professionals.",
    price: 99.99,
    category: "Electronics",
    image_url: "https://picsum.photos/seed/headphones/400/300",
    rating: 4.5,
    stock: 25,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
  },
  {
    id: "2",
    name: "Premium Cotton T-Shirt",
    description: "Comfortable and stylish cotton t-shirt perfect for everyday wear. Made from 100% organic cotton.",
    price: 29.99,
    category: "Clothing",
    image_url: "https://picsum.photos/seed/tshirt/400/300",
    rating: 4.2,
    stock: 50,
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
  },
  {
    id: "3",
    name: "Smart Fitness Watch",
    description: "Track your fitness goals with this advanced smartwatch featuring heart rate monitoring and GPS.",
    price: 199.99,
    category: "Electronics",
    image_url: "https://picsum.photos/seed/watch/400/300",
    rating: 4.7,
    stock: 15,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
  {
    id: "4",
    name: "Organic Coffee Beans",
    description: "Premium organic coffee beans sourced from sustainable farms. Rich flavor and aroma.",
    price: 24.99,
    category: "Food",
    image_url: "https://picsum.photos/seed/coffee/400/300",
    rating: 4.8,
    stock: 100,
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
  },
  {
    id: "5",
    name: "Yoga Mat Pro",
    description: "Non-slip yoga mat perfect for all types of yoga and exercise routines. Eco-friendly materials.",
    price: 49.99,
    category: "Sports",
    image_url: "https://picsum.photos/seed/yoga/400/300",
    rating: 4.4,
    stock: 30,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
  },
  {
    id: "6",
    name: "Skincare Serum Set",
    description: "Complete skincare routine with vitamin C serum and hyaluronic acid. Anti-aging formula.",
    price: 79.99,
    category: "Beauty",
    image_url: "https://picsum.photos/seed/skincare/400/300",
    rating: 4.6,
    stock: 20,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
  },
  {
    id: "7",
    name: "Stainless Steel Water Bottle",
    description: "Insulated water bottle that keeps drinks cold for 24 hours or hot for 12 hours.",
    price: 34.99,
    category: "Home & Kitchen",
    image_url: "https://picsum.photos/seed/bottle/400/300",
    rating: 4.3,
    stock: 75,
    created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days ago
  },
  {
    id: "8",
    name: "Wireless Gaming Mouse",
    description: "High-precision wireless gaming mouse with customizable RGB lighting and programmable buttons.",
    price: 89.99,
    category: "Electronics",
    image_url: "https://picsum.photos/seed/mouse/400/300",
    rating: 4.5,
    stock: 40,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    id: "9",
    name: "Designer Sunglasses",
    description: "Stylish designer sunglasses with UV protection. Perfect for any occasion.",
    price: 149.99,
    category: "Clothing",
    image_url: "https://picsum.photos/seed/sunglasses/400/300",
    rating: 4.1,
    stock: 22,
    created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago
  },
  {
    id: "10",
    name: "Protein Powder",
    description: "High-quality whey protein powder for muscle building and recovery. Chocolate flavor.",
    price: 59.99,
    category: "Sports",
    image_url: "https://picsum.photos/seed/protein/400/300",
    rating: 4.4,
    stock: 60,
    created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
  },
  {
    id: "11",
    name: "Essential Oil Diffuser",
    description: "Ultrasonic aromatherapy diffuser with LED lights and timer settings.",
    price: 45.99,
    category: "Home & Kitchen",
    image_url: "https://picsum.photos/seed/diffuser/400/300",
    rating: 4.2,
    stock: 35,
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
  },
  {
    id: "12",
    name: "Face Moisturizer",
    description: "Hydrating face moisturizer with SPF 30 protection. Suitable for all skin types.",
    price: 32.99,
    category: "Beauty",
    image_url: "https://picsum.photos/seed/moisturizer/400/300",
    rating: 4.6,
    stock: 45,
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
  },
]

const MOCK_CATEGORIES: Category[] = [
  { id: "1", name: "Electronics", description: "Latest electronic gadgets and devices", product_count: 25 },
  { id: "2", name: "Clothing", description: "Fashion and apparel for all occasions", product_count: 40 },
  { id: "3", name: "Sports", description: "Sports equipment and fitness gear", product_count: 15 },
  { id: "4", name: "Beauty", description: "Beauty and personal care products", product_count: 30 },
  { id: "5", name: "Food", description: "Gourmet food and beverages", product_count: 20 },
  { id: "6", name: "Home & Kitchen", description: "Home essentials and kitchen appliances", product_count: 35 },
]

// Error types for better error handling
enum ApiErrorType {
  CORS = "CORS",
  NETWORK = "NETWORK",
  TIMEOUT = "TIMEOUT",
  NOT_FOUND = "NOT_FOUND",
  SERVER_ERROR = "SERVER_ERROR",
  UNKNOWN = "UNKNOWN",
}

interface ApiError {
  type: ApiErrorType
  message: string
  originalError?: Error
}

export class ApiService {
  private static apiStatus: "unknown" | "online" | "offline" = "unknown"

  private static determineErrorType(error: any): ApiError {
    // CORS Error Detection
    if (error.name === "TypeError" && error.message.includes("Failed to fetch")) {
      return {
        type: ApiErrorType.CORS,
        message: "CORS error or network unavailable - API server may not be running or accessible",
        originalError: error,
      }
    }

    // Network/Connection Errors
    if (error.name === "TypeError" || error.message.includes("NetworkError")) {
      return {
        type: ApiErrorType.NETWORK,
        message: "Network connection error - please check your internet connection",
        originalError: error,
      }
    }

    // Timeout Errors
    if (error.name === "AbortError" || error.message.includes("timeout")) {
      return {
        type: ApiErrorType.TIMEOUT,
        message: "Request timeout - API server is not responding",
        originalError: error,
      }
    }

    // HTTP Status Errors
    if (error.status) {
      if (error.status === 404) {
        return {
          type: ApiErrorType.NOT_FOUND,
          message: "API endpoint not found",
          originalError: error,
        }
      }
      if (error.status >= 500) {
        return {
          type: ApiErrorType.SERVER_ERROR,
          message: "Server error - API is experiencing issues",
          originalError: error,
        }
      }
    }

    return {
      type: ApiErrorType.UNKNOWN,
      message: error.message || "Unknown error occurred",
      originalError: error,
    }
  }

  private static async fetchWithErrorHandling<T>(url: string): Promise<T> {
    try {
      console.log(`🌐 Attempting to fetch from: ${url}`)

      const controller = new AbortController()
      const timeoutId = setTimeout(() => {
        controller.abort()
        console.log(`⏰ Request timeout for: ${url}`)
      }, 5000) // 5 second timeout

      const response = await fetch(url, {
        signal: controller.signal,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        mode: "cors", // Explicitly set CORS mode
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const error = new Error(`HTTP ${response.status}: ${response.statusText}`)
        ;(error as any).status = response.status
        throw error
      }

      const data = await response.json()
      console.log(`✅ Successfully fetched data from ${url}`)
      this.apiStatus = "online"
      return data
    } catch (error: any) {
      const apiError = this.determineErrorType(error)
      console.warn(`❌ API Error for ${url}:`, {
        type: apiError.type,
        message: apiError.message,
        originalError: apiError.originalError,
      })

      this.apiStatus = "offline"
      throw apiError
    }
  }

  static async getProducts(count = 20): Promise<Product[]> {
    try {
      const data = await this.fetchWithErrorHandling<Product[]>(`${API_BASE_URL}/products/?count=${count}`)
      return data
    } catch (error: any) {
      console.warn(`🔄 Using mock products data due to API error: ${error.message}`)

      // Return mock data with requested count, cycling through if needed
      const mockData = []
      for (let i = 0; i < count; i++) {
        const product = { ...MOCK_PRODUCTS[i % MOCK_PRODUCTS.length] }
        // Make each product unique by modifying the ID
        if (i >= MOCK_PRODUCTS.length) {
          product.id = `${product.id}-${Math.floor(i / MOCK_PRODUCTS.length)}`
        }
        mockData.push(product)
      }

      return mockData
    }
  }

  static async getProduct(productId: string): Promise<Product> {
    try {
      const data = await this.fetchWithErrorHandling<Product>(`${API_BASE_URL}/products/${productId}`)
      return data
    } catch (error: any) {
      console.warn(`🔄 Using mock product data due to API error: ${error.message}`)

      // Return mock product or first available
      const foundProduct = MOCK_PRODUCTS.find((p) => p.id === productId)
      if (foundProduct) {
        return foundProduct
      }

      // If not found, return first product with the requested ID
      return { ...MOCK_PRODUCTS[0], id: productId }
    }
  }

  static async getCategories(): Promise<Category[]> {
    try {
      const data = await this.fetchWithErrorHandling<Category[]>(`${API_BASE_URL}/categories/`)
      return data
    } catch (error: any) {
      console.warn(`🔄 Using mock categories data due to API error: ${error.message}`)
      return MOCK_CATEGORIES
    }
  }

  static async getCurrentUser(): Promise<User> {
    try {
      const data = await this.fetchWithErrorHandling<User>(`${API_BASE_URL}/users/current`)
      return data
    } catch (error: any) {
      console.warn(`🔄 Using mock user data due to API error: ${error.message}`)
      return {
        id: "mock-user-1",
        name: "John Doe",
        email: "john.doe@example.com",
        avatar: "https://i.pravatar.cc/150?u=john",
        address: {
          street: "123 Main St",
          city: "New York",
          state: "NY",
          zip_code: "10001",
        },
        orders: [
          {
            id: "order-1",
            date: new Date().toISOString(),
            total: 299.99,
            status: "delivered",
          },
          {
            id: "order-2",
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            total: 149.99,
            status: "shipped",
          },
        ],
      }
    }
  }

  // Enhanced method to check API health with detailed error reporting
  static async checkApiHealth(): Promise<{
    isHealthy: boolean
    status: "online" | "offline"
    error?: ApiError
    responseTime?: number
  }> {
    const startTime = Date.now()

    try {
      console.log(`🏥 Checking API health at: ${API_BASE_URL}`)

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000) // 3 second timeout for health check

      const response = await fetch(`${API_BASE_URL}/`, {
        method: "GET",
        signal: controller.signal,
        mode: "cors",
        headers: {
          Accept: "application/json",
        },
      })

      clearTimeout(timeoutId)
      const responseTime = Date.now() - startTime

      if (response.ok) {
        console.log(`✅ API is healthy - Response time: ${responseTime}ms`)
        this.apiStatus = "online"
        return {
          isHealthy: true,
          status: "online",
          responseTime,
        }
      } else {
        const error = this.determineErrorType(new Error(`HTTP ${response.status}`))
        console.warn(`⚠️ API health check failed:`, error)
        this.apiStatus = "offline"
        return {
          isHealthy: false,
          status: "offline",
          error,
          responseTime,
        }
      }
    } catch (error: any) {
      const apiError = this.determineErrorType(error)
      const responseTime = Date.now() - startTime

      console.warn(`❌ API health check failed:`, apiError)
      this.apiStatus = "offline"

      return {
        isHealthy: false,
        status: "offline",
        error: apiError,
        responseTime,
      }
    }
  }

  // Get current API status
  static getApiStatus(): "unknown" | "online" | "offline" {
    return this.apiStatus
  }

  // Get API base URL for debugging
  static getApiUrl(): string {
    return API_BASE_URL
  }
}
