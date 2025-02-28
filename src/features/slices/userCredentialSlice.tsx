import { UserCredentialFormSchemaType, userCredentialType } from '@/schemas/userCredential.index';
import { RootState } from '@/store';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { userCredentialImpl } from '../logic/userCredentialImpl';

export interface userCredentialState {
  id: string;
  userId: string;
  tokens: number;
  companyName: string;
  companyDescription: string;
  companyUrl: string;
  companyLogo: string;
  apiKey: string;
  loading: boolean;
}
const initialState: userCredentialState = {
  id: '',
  userId: '',
  tokens: 0,
  companyName: '',
  companyDescription: '',
  companyUrl: '',
  companyLogo: '',
  apiKey: '',
  loading: false,
};

const userCredentialSlice = createSlice({
  name: 'userCredential',
  initialState,
  reducers: {
    setUserCredential(state, action: PayloadAction<userCredentialState>) {
      return { ...state, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initDataFromBackendAsync.pending, (state) => {
        // Handle pending state if needed
        state.loading = true;
      })
      .addCase(initDataFromBackendAsync.fulfilled, (state, action: PayloadAction<userCredentialType>) => {
        return { ...state, ...action.payload, loading: false };
      })
      .addCase(initDataFromBackendAsync.rejected, (state, action) => {})
      .addCase(setApiKeyAsync.pending, (state) => {
        // Handle pending state if needed
      })
      .addCase(setApiKeyAsync.fulfilled, (state, action: PayloadAction<{ apiKey: string }>) => {
        state.apiKey = action.payload.apiKey;
      })
      .addCase(setApiKeyAsync.rejected, (state, action) => {});
  },
});

export const createUserCredentialAsync = createAsyncThunk('userCredential/createUserCredential', async (payload: UserCredentialFormSchemaType, thunkAPI) => {
  try {
    const userCredentialImplHandler = new userCredentialImpl();
    userCredentialImplHandler.createUserCredential(payload);
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const initDataFromBackendAsync = createAsyncThunk('userCredential/initDataFromBackend', async (_, thunkAPI) => {
  try {
    const userCredentialImplHandler = new userCredentialImpl();
    const data = userCredentialImplHandler.getUserCredential();
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const setApiKeyAsync = createAsyncThunk('user/setApiKey', async (payload: { apiKey: string }, thunkAPI) => {
  try {
    const userCredentialImplHandler = new userCredentialImpl();
    const data = await userCredentialImplHandler.setApiKey(payload.apiKey);
    return { apiKey: data.apiKey };
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export function getInitialValuesOfUserCredentialState() {
  return initialState;
}

export const { setUserCredential } = userCredentialSlice.actions;

export const selectUserCredential = (state: RootState) => state.userCredential;

export default userCredentialSlice.reducer;
