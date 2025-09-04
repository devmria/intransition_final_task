import { TagCreateRequest, TagResponse, TagsListResponse } from "@intransition/shared-types";
import axios from "axios";
import { parseAxiosError } from "~components/atoms/ErrorParser";

const BASE_URL = '/api/tags';

export const TagService = {
  getTags: async (search?: string) => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);

      const response = await axios.get<TagsListResponse>(
        `${BASE_URL}?${params.toString()}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw parseAxiosError(error);
    }
  },

  createTag: async (data: TagCreateRequest) => {
    try {
      const response = await axios.post<TagResponse>(
        `${BASE_URL}`,
        data,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw parseAxiosError(error);
    }
  },

};