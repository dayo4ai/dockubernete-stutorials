export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  image_url: string
  rating: number
  stock: number
  created_at: string
  reviews?: Review[]
}

export interface Review {
  id: string
  user_name: string
  rating: number
  comment: string
  created_at: string
}

export interface Category {
  id: string
  name: string
  description: string
  product_count: number
}

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  address: {
    street: string
    city: string
    state: string
    zip_code: string
  }
  orders: Order[]
}

export interface Order {
  id: string
  date: string
  total: number
  status: "pending" | "shipped" | "delivered"
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface ApiError {
  message: string
  status?: number
}
