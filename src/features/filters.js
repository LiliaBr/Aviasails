import { createSlice } from '@reduxjs/toolkit';


export const defaultSelected = [];
export const filtersSlice = createSlice({
	name: 'filters',
	initialState: {
		checkedList: defaultSelected,
		indeterminate: false,
		checkAll: true
	},
	reducers: {
	
		setCheckedList: (state, action) => { 
			state.checkedList = action.payload;
		},
		setIndeterminate: (state, action) => { 
			state.indeterminate = action.payload;
		},
		setCheckAll: (state, action) => {
			state.checkAll = action.payload;
		}
	}
});

export const { setCheckedList, setIndeterminate, setCheckAll } = filtersSlice.actions;
export default filtersSlice.reducer;