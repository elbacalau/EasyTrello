import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserData } from "../../api/interfaces/userData";


interface UserState extends UserData {
  token: string | null;
  isLoggedIn: boolean;
}

const initialState: UserState = {
  token: null,
  isLoggedIn: false,
  id: undefined,
  firstName: undefined,
  lastName: undefined,
  email: undefined,
  phoneNumber: undefined,
  profilePictureUrl: null,
  dateCreated: undefined,
  dateModified: null,
  isActive: undefined,
  boards: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ token: string } & UserData>) => {
      state.token = action.payload.token;
      state.isLoggedIn = true;
      Object.assign(state, action.payload); 
    },
    logout: (state) => {
      state.token = null;
      state.isLoggedIn = false;
      Object.assign(state, initialState); 
    },
  },
});

export const { loginSuccess, logout } = userSlice.actions;
export default userSlice.reducer;
