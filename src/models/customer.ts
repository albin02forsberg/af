// Customer models shared across API and UI

// Firestore stored shape (document data)
export type CustomerDoc = {
  name: string
  email: string | null
  phone: string | null
  notes: string | null
  createdAt: number
  updatedAt: number
  orgId: string
}

// Client-exposed shape (includes id)
export type Customer = CustomerDoc & { id: string }

// Payload to create a customer
export type CustomerCreate = {
  name: string
  email?: string
  phone?: string
  notes?: string
}

// Payload to update a customer (partial)
export type CustomerUpdate = Partial<CustomerCreate>

// API response types
export type CustomersListResponse = { customers: Customer[] }
export type CustomerResponse = Customer
export type ApiError = { error: string }
