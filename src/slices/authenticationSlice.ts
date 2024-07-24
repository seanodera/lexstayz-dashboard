import {createSlice} from "@reduxjs/toolkit";


const AuthenticationSlice = createSlice({
    name: "authentication",
    initialState: {
        isAuthenticated: false,
        user: {
            uid: '',
            email: '',
            name: '',
            avatar: '',
        },
    },
    reducers: {
        loginUser: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload;
        },
        logoutUser: (state, action) => {
            state.isAuthenticated = false;
        }
    }
})

export const selectCurrentUser = (state: any) => state.authentication.user;
export const selectIsAuthenticated = (state: any) => state.authentication.isAuthenticated;

export const {loginUser,logoutUser} = AuthenticationSlice.actions;
export default AuthenticationSlice.reducer