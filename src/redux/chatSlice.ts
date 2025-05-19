import { authAxios, unauthAxios } from "@config/axiosConfig";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { endPoint } from "@services/endPoint";
import { Conversation, Message } from "interfaces/chat.interface";
import { showToast, ToastType } from "shared/toast";

interface ChatState {
  messages: Message[];
  loading: boolean;
  error: string | null;
  getMessageSuccess: boolean;
  conversationId: string | null;
  getConversationSuccess: boolean;
}

const initialState: ChatState = {
  messages: [],
  loading: false,
  error: null,
  getMessageSuccess: false,
  getConversationSuccess: false,
  conversationId: null,
};

export const getConversation = createAsyncThunk(
  "chat/conversation",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAxios.post<Conversation>(
        endPoint.CHAT.GET_CONVERSATION
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Lấy dữ liệu cuộc trò chuyện thất bại"
      );
    }
  }
);

export const getMessages = createAsyncThunk(
  "chat/getmessages",
  async (conversationId: string, { rejectWithValue }) => {
    try {
      const response = await authAxios.get<Message[]>(
        endPoint.CHAT.GET_MESSAGES.replace(":id", conversationId)
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Lấy dữ liệu cuộc trò chuyện thất bại"
      );
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getConversation.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.getConversationSuccess = false;
      })
      .addCase(getConversation.fulfilled, (state, action) => {
        state.loading = false;
        state.conversationId = action.payload.id;
        state.getConversationSuccess = true;
      })
      .addCase(getConversation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.getConversationSuccess = false;
        showToast(ToastType.ERROR, "Lấy dữ liệu cuộc trò chuyện thất bại");
      })
      .addCase(getMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.getMessageSuccess = false;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
        state.getMessageSuccess = true;
      })
      .addCase(getMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.getMessageSuccess = false;
        showToast(ToastType.ERROR, "Lấy dữ liệu cuộc trò chuyện thất bại");
      });
  },
});

export const {} = chatSlice.actions;

export const conversationSelector = (state: { chat: ChatState }) =>
  state.chat.conversationId;

export const messagesSelector = (state: { chat: ChatState }) =>
  state.chat.messages;

export default chatSlice.reducer;
