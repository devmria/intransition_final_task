import { CategoryResponse } from "@intransition/shared-types";
import axios from "axios";
import { parseAxiosError } from "~components/atoms/ErrorParser";

const BASE_URL = '/api/categories';

export const CategoryService = {
  getCategories: async () => {
    try {
      const response = await axios.get<CategoryResponse>(
        BASE_URL,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw parseAxiosError(error);
    }
  }
};