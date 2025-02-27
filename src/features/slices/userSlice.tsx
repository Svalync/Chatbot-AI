import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface userState {
    id: string;
    name: string;
    email: string;
    tokens: Number | undefined;
    loading: boolean;
  }
  
  const initialState: userState = {
    id: '',
    name: '',
    email: '',
    tokens: undefined,
    loading: false,
  };

  const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        getUser(state, action: PayloadAction<userState>) {
            return { ...state, ...action.payload };
          },
    },
    extraReducers: (builder) => {},
    // Add reducers for additional action types here, and handle loading state as needed
  });
  
  export const {getUser} = userSlice.actions;

  export default userSlice.reducer;