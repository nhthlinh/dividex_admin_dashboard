import { api } from "../../config/api.config";
import { mockApi, USE_MOCK } from "../../services/mockApi";
import type { ApiResponse } from "../../config/api.types";
import type {
  ListUsersData,
  ListUsersParams,
  UserDetail,
  UserGroup,
  UserExpense,
  PaginationParams,
  PaginationResponse,
  UserLoginHistoryResponse,
  SearchUserParams,
  SearchUserResponse,
} from "./user.types";

export const UserAPI = {
  listUsers: async (
    params: ListUsersParams = {}
  ): Promise<ListUsersData> => {
    if (USE_MOCK) {
      return mockApi.listUsers(params);
    }

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

  searchUsers: async (
    params: SearchUserParams
  ): Promise<SearchUserResponse> => {
    if (USE_MOCK) {
      return mockApi.searchUsers(params);
    }

    const res = await api.get<ApiResponse<SearchUserResponse>>(
      "/users",
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

  getUserDetail: async (userUid: string): Promise<UserDetail> => {
    if (USE_MOCK) {
      return mockApi.getUserDetail(userUid);
    }

    const res = await api.get<ApiResponse<UserDetail>>(
      `/admin/users/${userUid}`
    );

    return res.data.data;
  },

  activateUser: async (userUid: string): Promise<boolean> => {
    if (USE_MOCK) {
      return mockApi.activateUser(userUid);
    }

    const res = await api.patch<ApiResponse<boolean>>(
      `/admin/users/${userUid}/activate`
    );

    return res.data.data;
  },

  deActivateUser: async (userUid: string): Promise<boolean> => {
    if (USE_MOCK) {
      return mockApi.deActivateUser(userUid);
    }

    const res = await api.patch<ApiResponse<boolean>>(
      `/admin/${userUid}`
    );

    return res.data.data;
  },

  listUserGroups: async (
    userUid: string,
    params: PaginationParams = {}
  ): Promise<PaginationResponse<UserGroup>> => {
    if (USE_MOCK) {
      return mockApi.listUserGroups(userUid, params);
    }

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
    if (USE_MOCK) {
      return mockApi.listUserExpenses(userUid, params);
    }

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

  getUserLoginHistory: async (
    user_uid: string,
    params: PaginationParams = {}
  ): Promise<UserLoginHistoryResponse> => {
    if (USE_MOCK) {
      return mockApi.getUserLoginHistory(user_uid, params);
    }

    const res = await api.get<ApiResponse<UserLoginHistoryResponse>>(
      `/admin/users/${user_uid}/login-history`,
      {
        params: {
          page: params.page ?? 1,
          page_size: params.page_size ?? 10,
        },
      }
    );

    return res.data.data;
  },
};

