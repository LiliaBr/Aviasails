import { createSlice } from '@reduxjs/toolkit';


export const sortingSlice = createSlice({
	name: 'sorting',
	initialState: {
		criterion: 'cheap' 
	},
	reducers: {
	
		setCriterion: (state, action) => {
			state.criterion = action.payload;
		}
	}
});

export const { setCriterion } = sortingSlice.actions;
export default sortingSlice.reducer;