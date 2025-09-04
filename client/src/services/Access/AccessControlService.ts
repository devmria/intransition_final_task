import { InventoryAccessListResponse, AddAccessResponse, RevokeAccessResponse, GrantAccessData, RevokeAccessData } from "@intransition/shared-types";
import axios from "axios";
import { parseAxiosError } from "~components/atoms/ErrorParser";

const BASE_URL = '/api';

export const AccessControlService = {
  getInventoryUsers: async (inventoryId: string) => {
    try {
      const response = await axios.get<InventoryAccessListResponse>(
        `${BASE_URL}/inventories/${inventoryId}/access`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw parseAxiosError(error);
    }
  },

  grantAccess: async (inventoryId: string, data: GrantAccessData) => {
    try {
      const response = await axios.post<AddAccessResponse>(
        `${BASE_URL}/inventories/${inventoryId}/access`,
        data,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw parseAxiosError(error); 
    }
  },

  revokeAccess: async (inventoryId: string, data: RevokeAccessData) => {
    try {
      const response = await axios.delete<RevokeAccessResponse>(
        `${BASE_URL}/inventories/${inventoryId}/access/${data.userId}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw parseAxiosError(error);
    }
  }
  
};