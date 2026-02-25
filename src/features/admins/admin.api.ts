import { api } from "../../config/api.config"
import type { ApiResponse } from "../../config/api.types"
import type { ActivateAdminRequest, Admin, CreateAdminRequest, ListAdminsParams, ListAdminsResponse } from "./admin.types"

export const AdminAPI = {
  listAdmins: async (
    params: ListAdminsParams
  ): Promise<ListAdminsResponse> => {
    const res = await api.get<ApiResponse<ListAdminsResponse>>('/admin', {
      params: {
        search: params.search,
        page: params.page ?? 1,
        page_size: params.page_size ?? 10,
      },
    })
    return res.data.data
  },

  createAdmin: async (
    data: CreateAdminRequest
  ): Promise<void> => {
    await api.post<Admin>('/admin', data)
  },

  deleteAdmin: async (adminUid: string): Promise<void> => {
    await api.delete(`/admin/${adminUid}`)
  },

  activateAdmin: async (data: ActivateAdminRequest): Promise<void> => {
    await api.patch<Admin>("/admin/activate", data);
  },

  deActivateAdmin: async (adminUid: string): Promise<void> => {
    await api.patch(`/admin/${adminUid}`)
  },
}
