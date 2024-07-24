import {createSlice} from "@reduxjs/toolkit";


const createStaySlice = createSlice({
    name: "createStay",
    initialState: {
        name: '',
        type: '',
        stay: {},
        rooms: {}
    },
    reducers: {
        setStayPartial: (state, action) => {
            state.stay = {
                id: 'create',
                ...action.payload
            };
        }
    }
})

export const selectPartialStay = (state: any) => state.createStay.stay;
export const {setStayPartial} = createStaySlice.actions;
export default createStaySlice.reducer