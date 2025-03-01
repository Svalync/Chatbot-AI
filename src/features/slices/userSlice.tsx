import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { userCredentialState } from "./userCredentialSlice";
import userImpl from "../logic/userImpl";
import { RootState } from "@/store";

export interface userState {
  id: string;
  name: string;
  image: string;
  email: string;
  tokens: Number | undefined;
  loading: boolean;
  userCredentials: userCredentialState[];
}

const initialState: userState = {
  id: "",
  name: "",
  image: "",
  email: "",
  tokens: undefined,
  loading: false,
  userCredentials: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    getUser(state, action: PayloadAction<userState>) {
      return { ...state, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initUserFromBackendAsync.pending, (state) => {
        // Handle pending state if needed
      })
      .addCase(initUserFromBackendAsync.fulfilled, (state, action) => {
        // Update your state with the fetched data
        // Object.assign(state, action.payload);
        state.id = action.payload.id;
        state.name = action.payload.name;
        state.image = action.payload.image;
        state.email = action.payload.email;
        state.tokens = action.payload.tokens;
      })
      .addCase(initUserFromBackendAsync.rejected, (state, action) => {
        // Handle error state if needed
      });
  },
  // Add reducers for additional action types here, and handle loading state as needed
});

export const initUserFromBackendAsync = createAsyncThunk(
  "user/initUserFromBackend",
  async (_, thunkAPI) => {
    try {
      const userHandler = new userImpl();
      const response: userState = await userHandler.initUserFromBackend();
      return { ...response };
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export function getInitialUserState() {
  return initialState;
}
export const { getUser } = userSlice.actions;

export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
