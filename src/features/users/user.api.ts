import { api } from "../../config/api.config";
import type { ApiResponse } from "../../config/api.types";
import type {
  ListUsersData,
  ListUsersParams,
  UserDetail,
  UserGroup,
  UserExpense,
  PaginationParams,
  PaginationResponse,
} from "./user.types";

export const UserAPI = {
  listUsers: async (
    params: ListUsersParams = {}
  ): Promise<ListUsersData> => {
    const res = await api.get<ApiResponse<ListUsersData>>("/admin/users", {
      params: {
        search: params.search,
        order_by: params.order_by ?? "full_name",
        sort_type: params.sort_type ?? "desc",
        page: params.page ?? 1,
        page_size: params.page_size ?? 10,
      },
    });

    return res.data.data;
  },

  getUserDetail: async (userUid: string): Promise<UserDetail> => {
    const res = await api.get<ApiResponse<UserDetail>>(
      `/admin/users/${userUid}`
    );

    return res.data.data;
  },

  activateUser: async (userUid: string): Promise<boolean> => {
    const res = await api.patch<ApiResponse<boolean>>(
      `/admin/users/${userUid}/activate`
    );

    return res.data.data;
  },

  listUserGroups: async (
    userUid: string,
    params: PaginationParams = {}
  ): Promise<PaginationResponse<UserGroup>> => {
    const res = await api.get<ApiResponse<PaginationResponse<UserGroup>>>(
      `/admin/users/${userUid}/groups`,
      {
        params: {
          search: params.search,
          page: params.page ?? 1,
          page_size: params.page_size ?? 10,
        },
      }
    );

    return res.data.data;
  },

  listUserExpenses: async (
    userUid: string,
    params: PaginationParams = {}
  ): Promise<PaginationResponse<UserExpense>> => {
    const res = await api.get<ApiResponse<PaginationResponse<UserExpense>>>(
      `/admin/users/${userUid}/expenses`,
      {
        params: {
          search: params.search,
          page: params.page ?? 1,
          page_size: params.page_size ?? 10,
        },
      }
    );

    return res.data.data;
  },
};

