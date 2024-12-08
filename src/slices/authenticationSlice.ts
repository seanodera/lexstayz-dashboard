import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getUserDetails} from "@/data/usersData";
import {signInWithEmailAndPassword} from "firebase/auth";
import {auth, firestore} from "@/lib/firebase";
import {doc} from "firebase/firestore";
import {getCurrentUser} from "@/data/hotelsData";
import {updateDoc} from "@firebase/firestore";
import {redirect} from "next/navigation";



export const getUserDetailsAsync = createAsyncThunk('authentication/user',
    async (id: string) => {
        try {
            const userDetails = await getUserDetails(id)
            return userDetails;

        } catch (error) {
            console.error("Failed to fetch user details", error);
            throw error;
        }
    });

export const signInUserAsync = createAsyncThunk('authentication/signIn',
    async ({email, password}: { email: string, password: string }, {dispatch, rejectWithValue}) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const payload = await dispatch(getUserDetailsAsync(userCredential.user.uid));

            console.log(payload);
            return userCredential;
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('An unknown error occurred');
        }
    }
);

export const updateUserAsync = createAsyncThunk('authentication/updateUser',
    async ({details}:{details: any}, {rejectWithValue}) => {
    try {
        const user = getCurrentUser()
        await updateDoc(doc(firestore, 'hosts', user.uid), details);
        return details;
    } catch (error){
        if (error instanceof Error){
            return rejectWithValue(error.message);
        } else {
            return rejectWithValue('An unknown error occurred');
        }
    }
    })


interface AuthenticationState {
    isAuthenticated: boolean,
    user?: any,

    isLoading: boolean,
    hasError: boolean,
    errorMessage: string,
    hasRun: boolean,
}

const initialState: AuthenticationState = {
    isAuthenticated: false,
    user: undefined,

    isLoading: false,
    hasError: false,
    errorMessage: '',
    hasRun: false,
}

const AuthenticationSlice = createSlice({
    name: "authentication",
    initialState: initialState,
    reducers: {
        loginUser: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload;
        },
        logoutUser: (state, action) => {
            state.isAuthenticated = false;
        },
        resetAuthError: (state) => {
            state.hasError = false;
            state.errorMessage = ''
        }
    },
    extraReducers: builder => {
        builder
            .addCase(getUserDetailsAsync.fulfilled, (state, action) => {
                state.user = action.payload as any;
                state.isLoading = false;
            })
            .addCase(getUserDetailsAsync.rejected, (state, action) => {
                state.hasError = true;
                state.isLoading = false;
                state.errorMessage = action.error.message || 'Failed to fetch user';
            })
            .addCase(getUserDetailsAsync.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(signInUserAsync.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(signInUserAsync.fulfilled, (state) => {
                state.isAuthenticated = true;
                state.isLoading = false;
                state.hasError = false;
                state.errorMessage = '';

            })
            .addCase(signInUserAsync.rejected, (state, action) => {
                state.hasError = true;
                state.errorMessage = action.payload as string;
                state.isLoading = false;
            })
            .addCase(updateUserAsync.fulfilled, (state, action) => {
                state.user = {...state.user, ...action.payload};
                state.isLoading = false;
                state.hasError = false;
                state.errorMessage = '';
            })
            .addCase(updateUserAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.hasError = true;
                state.errorMessage = action.payload as string || 'Failed to update user';
            })
            .addCase(updateUserAsync.pending, (state) => {
                state.isLoading = true;
            })
    }
})

export const selectCurrentUser = (state: any) => state.authentication.user;
export const selectIsAuthenticated = (state: any) => state.authentication.isAuthenticated;
export const selectIsAuthLoading = (state: any) => state.authentication.isLoading;
export const selectAuthHasError = (state: any) => state.authentication.hasError;
export const selectAuthErrorMessage = (state: any) => state.authentication.errorMessage;

export const {loginUser, logoutUser,resetAuthError} = AuthenticationSlice.actions;
export default AuthenticationSlice.reducer
