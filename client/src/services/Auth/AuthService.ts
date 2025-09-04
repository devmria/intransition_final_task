import { LoginRequest, RegisterRequest, SuccessResponse, UserProfile } from "@intransition/shared-types";
import axios from "axios";
import { parseAxiosError } from "~components/atoms/ErrorParser";

const BASE_URL = '/api';

export const AuthService = {
  login: async (data: LoginRequest) => {
    try {
      const res = await axios.post<UserProfile>(
        `${BASE_URL}/login`,
        data,
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      throw parseAxiosError(error);
    }
  },

  register: async (data: RegisterRequest) => {
    try {
      const res = await axios.post<UserProfile>(
        `${BASE_URL}/register`,
        data,
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      throw parseAxiosError(error)
    }
  },

  logout: async () => {
    try {
      const res = await axios.post<SuccessResponse>(
        `${BASE_URL}/logout`, 
        { withCredentials: true }
      );
      return res.data.message;
    } catch (error) {
        throw parseAxiosError(error);
      }
  },

  getCurrentUser: async () => {
    try {
      const res = await axios.get<UserProfile>(
        `${BASE_URL}/current`, 
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      throw parseAxiosError(error);
    }
  }
};