import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  loading: boolean;
  error: string | null;
  userUUID: string | null;
  email: string | null;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
}

const initialState: AuthState = {
  loading: false,
  error: null,
  userUUID: null,
  email: null,
  username: null,
  firstName: null,
  lastName: null,
};

const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUUID: (state, action: PayloadAction<string | null>) => {
      console.log("Mise à jour UUID user dans le slice :", action.payload);
      state.userUUID = action.payload;
      console.log("UUID user mis à jour dans le state :", state.userUUID);
    },
    setEmail: (state, action: PayloadAction<string | null>) => {
      state.email = action.payload;
      console.log("Email mis à jour dans le state :", state.email);
    },
    setUsername: (state, action: PayloadAction<string | null>) => {
      state.username = action.payload;
      console.log("Username mis à jour dans le state :", state.username);
    },
    setFirstName: (state, action: PayloadAction<string | null>) => {
      state.firstName = action.payload;
      console.log("FirstName mis à jour dans le state :", state.firstName);
    },
    setLastName: (state, action: PayloadAction<string | null>) => {
      state.lastName = action.payload;
      console.log("LastName mis à jour dans le state :", state.lastName);
    },
    setUser: (
      state,
      action: PayloadAction<{
        uuid: string | null;
        email: string | null;
        username: string | null;
        firstName: string | null;
        lastName: string | null;
      }>
    ) => {
      const { uuid, email, username, firstName, lastName } = action.payload;
      state.userUUID = uuid;
      state.email = email;
      state.username = username;
      state.firstName = firstName;
      state.lastName = lastName;
    },
  },
});

export const { setUUID, setEmail, setUsername, setFirstName, setLastName, setUser } = AuthSlice.actions;
export default AuthSlice.reducer;