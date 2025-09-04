import axios from "axios";
import { InventoryDetail, InventoryListResponse, InventoryCreateResponse, InventoryCreateRequest, InventoryUpdate, InventoryQueryFilters, SuccessResponse } from "@intransition/shared-types";
import { parseAxiosError } from "~components/atoms/ErrorParser";

const BASE_URL = '/api';

export const InventoryService = {
  getInventories: async (filters: InventoryQueryFilters) => {
    try {
      const response = await axios.get<InventoryListResponse>(
        `${BASE_URL}/inventories`,
        { 
          params: filters,
          withCredentials: true 
        }
      );
      return response.data;
    } catch (error) {
      throw parseAxiosError(error);
    }
  },

  getInventory: async (id: string) => {
    try {
      const response = await axios.get<InventoryDetail>(
        `${BASE_URL}/inventories/${id}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw parseAxiosError(error);
    }
  },

  createInventory: async (data: InventoryCreateRequest) => {
    try {
      const response = await axios.post<InventoryCreateResponse>(
        `${BASE_URL}/inventories`,
        data,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw parseAxiosError(error);
    }
  },

  updateInventory: async (id: string, data: InventoryUpdate) => {
    try {
      const response = await axios.put<InventoryUpdate>(
        `${BASE_URL}/inventories/${id}`,
        data,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw parseAxiosError(error);
    }
  },

  deleteInventory: async (id: string) => {
    try {
      const response = await axios.delete<SuccessResponse>(
        `${BASE_URL}/inventories/${id}`,
        { withCredentials: true }
      );
      return response.data.message;
    } catch (error) {
      throw parseAxiosError(error);
    }
  },

  deleteInventories: async (ids: string[]) => {
    try {
      const response = await axios.delete<SuccessResponse>(
        `${BASE_URL}/inventories/bulk`,
        { 
          data: { ids },
          withCredentials: true 
        }
      );
      return response.data.message;
    } catch (error) {
      throw parseAxiosError(error);
    }
  }
};