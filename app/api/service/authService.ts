import { API } from '../client';
import { LoginPayload, LoginResponse, UserResponse } from '../../types/auth';

export const usersApi = async (
  payload: LoginPayload
): Promise<UserResponse> => {
  const { data } = await API.post<UserResponse>('/users', payload);
  return data;
};
