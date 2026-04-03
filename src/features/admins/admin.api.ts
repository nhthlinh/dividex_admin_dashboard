import { api } from "../../config/api.config"
import { mockApi, USE_MOCK } from "../../services/mockApi"
import type { ApiResponse } from "../../config/api.types"
import type { ActivateAdminRequest, Admin, CreateAdminRequest, ListAdminsParams, ListAdminsResponse } from "./admin.types"

export const AdminAPI = {
  listAdmins: async (
    params: ListAdminsParams
  ): Promise<ListAdminsResponse> => {
    if (USE_MOCK) {
      return mockApi.listAdmins(params);
    }

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
    if (USE_MOCK) {
      await mockApi.createAdmin(data);
      return;
    }

    await api.post<Admin>('/admin', data)
  },

  deleteAdmin: async (adminUid: string): Promise<void> => {
    if (USE_MOCK) {
      await mockApi.deleteAdmin(adminUid);
      return;
    }

    await api.delete(`/admin/${adminUid}`)
  },

  activateAdmin: async (data: ActivateAdminRequest): Promise<void> => {
    if (USE_MOCK) {
      await mockApi.activateAdmin();
      return;
    }

    await api.patch<Admin>("/admins/activate", data);
  },
  
  deActivateAdmin: async (adminUid: string): Promise<void> => {
    if (USE_MOCK) {
      await mockApi.deActivateAdmin(adminUid);
      return;
    }

    await api.delete(`/admin/${adminUid}/deactivate`)
  },
}
