import { api } from "../../config/api.config";
import type { ApiResponse } from "../../config/api.types";
import type { ListUsersData, ListUsersParams } from "./user.types";

export const UserAPI = {
  listUsers: async (
    params: ListUsersParams = {}
  ): Promise<ListUsersData> => {
    const res = await api.get<ApiResponse<ListUsersData>>(
      "/admin/users",
      {
        params: {
          search: params.search,
          order_by: params.order_by ?? "full_name",
          sort_type: params.sort_type ?? "desc",
          page: params.page ?? 1,
          page_size: params.page_size ?? 10,
        },
      }
    );

    return res.data.data;
  },
};
