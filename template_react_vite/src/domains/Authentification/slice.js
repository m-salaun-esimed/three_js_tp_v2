import { createSlice } from '@reduxjs/toolkit';

const AuthSlice = createSlice({
    name: 'auth',
    initialState: {
        loading: false,
        error: null,
        userUUID: null,
        email: null,
        username: null,
        firstName: null,
        lastName: null,
    },
    reducers: {
        setUUID: (state, action) => {
            console.log("Mise à jour UUID user dans le slice :", action.payload);
            state.userUUID = action.payload;
            console.log("UUID user mis à jour dans le state :", state.userUUID);
        },
        setEmail: (state, action) => {
            state.email = action.payload;
            console.log("Email mis à jour dans le state :", state.email);
        },
        setUsername: (state, action) => {
            state.username = action.payload;
            console.log("Username mis à jour dans le state :", state.username);
        },
        setFirstName: (state, action) => {
            state.firstName = action.payload;
            console.log("FirstName mis à jour dans le state :", state.firstName);
        },
        setLastName: (state, action) => {
            state.lastName = action.payload;
            console.log("LastName mis à jour dans le state :", state.lastName);
        },
        setUser: (state, action) => {
            const { uuid, email, username, firstName, lastName } = action.payload;
            state.userUUID = uuid;
            state.email = email;
            state.username = username;
            state.firstName = firstName;
            state.lastName = lastName;
        },
    },
    extraReducers: (builder) => {
        builder
    },
});

export default AuthSlice.reducer;
export const { setUUID, setEmail, setUsername, setFirstName, setLastName, setUser } = AuthSlice.actions;