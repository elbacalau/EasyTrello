import { UserData } from "@/types/userData";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


const initialState: UserData = {
  id: 0,
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  profilePictureUrl: null,
  dateCreated: null,
  dateModified: null,
  isActive: false,
  boards: [],
};


export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserData> ) => {      
      return action.payload;
    },
    clearUser: () => initialState,
  }
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;