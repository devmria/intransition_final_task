import { SuccessResponse, UserInventoriesResponse, UserProfile, UsersListResponse } from "@intransition/shared-types";
import axios from "axios";
import { parseAxiosError } from "~components/atoms/ErrorParser";

const BASE_URL = '/api/users';

export const UserService = {
  getUsers: async () => {
    const res = await axios.get<UsersListResponse>(`${BASE_URL}`, { withCredentials: true });
    return res.data;
  },

  getUserProfile: async (userId: string) => {
    try {
      const response = await axios.get<UserProfile>(`${BASE_URL}/${userId}`, { withCredentials: true });
      return response.data;
    } catch (error) {
      throw parseAxiosError(error);
    }
  },

  getUserOwnedInventories: async (userId: string) => {
    try {
      const response = await axios.get<UserInventoriesResponse>(`${BASE_URL}/${userId}/inventories/owned`, { withCredentials: true });
      return response.data.inventories;
    } catch (error) {
      throw parseAxiosError(error);
    }
  },

  getUserAccessibleInventories: async (userId: string) => {
    try {
      const response = await axios.get<UserInventoriesResponse>(`${BASE_URL}/${userId}/inventories/accessible`, { withCredentials: true });
      return response.data.inventories;
    } catch (error) {
      throw parseAxiosError(error);
    }
  },

  deleteUsers: async (userIds: string[]) => {
    try {
      const response = await axios.delete<SuccessResponse>(`${BASE_URL}`, { data: { userIds }, withCredentials: true });
      return response.data.message;
    } catch (error) {
      throw parseAxiosError(error);
    }
  },

  blockUsers: async (userIds: string[]) => {
    try {
      const response = await axios.post<SuccessResponse>( `${BASE_URL}/block`, { userIds }, { withCredentials: true });
      return response.data.message;
    } catch (error) {
      throw parseAxiosError(error);
    }
  },

  unblockUsers: async (userIds: string[]) => {
    try {
      const response = await axios.post<SuccessResponse>(`${BASE_URL}/unblock`, { userIds }, { withCredentials: true });
      return response.data.message;
    } catch (error) {
      throw parseAxiosError(error);
    }
  },

  makeAdminUsers: async (userIds: string[]) => {
    try {
      const response = await axios.post<SuccessResponse>(`${BASE_URL}/make-admin`, { userIds }, { withCredentials: true });
      return response.data.message;
    } catch (error) {
      throw parseAxiosError(error);
    }
  },

  removeAdminUsers: async (userIds: string[]) => {
    try {
      const response = await axios.post<SuccessResponse>(`${BASE_URL}/remove-admin`, { userIds }, { withCredentials: true });
      return response.data.message;
    } catch (error) {
      throw parseAxiosError(error);
    }
  }
};