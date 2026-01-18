import { API } from '../client';
import { ChatHistoryPayload, ChatMessage } from '../../utils/types';
import { ApiResponse } from '../../types/genericType';

export const chatHistoryApi = async (
  payload: ChatHistoryPayload
): Promise<ApiResponse<ChatMessage[]>> => {
  const { data } = await API.get<ApiResponse<ChatMessage[]>>(`/chat_history?name=${payload.name}`);
  return data;
};
