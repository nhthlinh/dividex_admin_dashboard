import { api } from "../../config/api.config"
import type { Admin, CreateAdminRequest, ListAdminsParams, ListAdminsResponse } from "./admin.types"

export const AdminAPI = {
  listAdmins: async (
    params: ListAdminsParams
  ): Promise<ListAdminsResponse> => {
    const res = await api.get<ListAdminsResponse>('/admin', {
      params: {
        search: params.search,
        page: params.page ?? 1,
        page_size: params.page_size ?? 10,
      },
    })
    return res.data
  },

  createAdmin: async (
    data: CreateAdminRequest
  ): Promise<Admin> => {
    const res = await api.post<Admin>('/admin', data)
    return res.data
  },

  deleteAdmin: async (adminUid: string): Promise<void> => {
    await api.delete(`/api/admin/${adminUid}`)
  },
}
