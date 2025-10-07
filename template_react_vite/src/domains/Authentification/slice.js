import { createSlice } from '@reduxjs/toolkit';

const AuthSlice = createSlice({
    name: 'auth',
    initialState: {
        loading: false,
        error: null,
        userUUID: null,
    },
    reducers: {
        setUUID: (state, action) => {
            console.log("Mise à jour UUID user dans le slice :", action.payload);
            state.userUUID = action.payload;
            console.log("UUID user mis à jour dans le state :", state.userUUID);
        },
    },
    extraReducers: (builder) => {
        builder
            
    },
});

export default AuthSlice.reducer;
export const { setUUID } = AuthSlice.actions;