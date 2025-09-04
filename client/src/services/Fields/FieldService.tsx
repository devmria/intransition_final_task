import { CustomField, CustomFieldCreateRequest,SuccessResponse } from "@intransition/shared-types";
import axios from "axios";
import { parseAxiosError } from "~components/atoms/ErrorParser";

const BASE_URL = '/api';

//custom-fields

export const FieldService = {
  createField: async (id: string, data: CustomFieldCreateRequest) => {
    try {
      const response = await axios.post<CustomField>(
        `${BASE_URL}/custom-fields/${id}`,
        data,
        { withCredentials: true }
      )
      return response.data
    } catch (error) {
      throw parseAxiosError(error);
    }
  },

  deleteField: async (fieldId: string) => {
    try {
      const response = await axios.delete<SuccessResponse>(
        `${BASE_URL}/custom-fields/${fieldId}`,
        { withCredentials: true }
      )
      return response.data.message;
    } catch (error) {
      throw parseAxiosError(error);
    }
  }
}