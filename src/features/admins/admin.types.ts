export interface Admin {
  email: string
  uid: string
  role: string
  status: string
}

export interface ListAdminsParams {
  search?: string
  page?: number
  page_size?: number
}

export interface ListAdminsResponse {
  content: Admin[]
  current_page: number
  page_size: number
  total_rows: number
  total_pages: number
}

export interface CreateAdminRequest {
  email: string
}
