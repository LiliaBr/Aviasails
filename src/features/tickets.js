import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { sendRequest } from '../_utils';

export const fetchTickets = createAsyncThunk('fetchTickets', async (_, { dispatch, getState, signal }) => {
	dispatch(clear());
	if (!getState().filters.checkedList.length) return; 

	let sId = await sendRequest('https://aviasales-test-api.kata.academy/search', { signal });
	let stop = false;
	while (!stop) {
		if (signal.aborted) throw new Error('Request has been aborted');
		const filters = getState().filters.checkedList;
		let dataPacket = await sendRequest(`https://aviasales-test-api.kata.academy/tickets?searchId=${sId.searchId}`, { signal }, 5);
		if (dataPacket.stop || signal.aborted || !filters.length) stop = true;
		dataPacket.tickets = dataPacket.tickets.filter((ticket) => {
			return ticket.segments.some((segment) => {
				return filters.indexOf(segment.stops.length) != -1;
			});
		});

		if (signal.aborted) throw new Error('Request has been aborted');
		dispatch(providePacket(dataPacket.tickets));
	}
});

export const ticketsSlice = createSlice({
	name: 'tickets',
	initialState: {
		loading: false,
		error: null,
		value: [],
		pageSize: 10,
	},
	reducers: {
		providePacket: (state, action) => {
			state.value = state.value.concat(action.payload);
		},
		sort: (state, action) => {
			state.value = state.value
				.sort((a, b) => {
					let f1 = 0,
						f2 = 0;
					switch (action.payload) {
						case 'optimal':
						case 'cheap':
							f1 = a.price - b.price;
							if (action.payload != 'optimal') break;
						case 'fast': {
							for (let i = 0; i < a.segments.length; i++) f2 += a.segments[i].duration - b.segments[i].duration;
							break;
						}
						default:
							throw new Error('Invalid sort criterion');
					}
					return f1 + f2;
				})
				.slice(0, state.pageSize);
		},
		clear: (state) => {
			state.value = [];
		},
	},
	extraReducers: {

		[fetchTickets.pending]: (state) => {
			state.loading = true;
			state.error = null;
		},
		[fetchTickets.fulfilled]: (state) => {
			state.loading = false;
		},
		[fetchTickets.rejected]: (state, action) => {
			if (action.error.name != 'AbortError') {
				state.loading = false;
				state.error = action.error.message;
				console.error('Rejected!\n%s: %s', action.error.name, action.error.message);
			}
		},
	},
});

export const { providePacket, sort, clear } = ticketsSlice.actions;
export default ticketsSlice.reducer;