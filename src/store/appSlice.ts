import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

export interface AppType {
  id: string;
  name: string;
  plan?: string;
  user_role?: string;
  short_id?: string;
}

interface AppState {
  selectedApp: AppType | null;
  apps: AppType[];
}

const initialState: AppState = {
  selectedApp: null,
  apps: [],
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setApps: (state, action: PayloadAction<AppType[]>) => {
      state.apps = action.payload;
    },
    setSelectedApp: (state, action: PayloadAction<AppType | null>) => {
      state.selectedApp = action.payload;
    },
  },
  extraReducers: (builder) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    builder.addCase(HYDRATE, (state, action: any) => {
      return {
        ...state,
        ...action.payload.app,
      };
    });
  },
});

export const { setApps, setSelectedApp } = appSlice.actions;

export default appSlice.reducer;
