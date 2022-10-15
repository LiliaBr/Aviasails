
import { createListenerMiddleware } from '@reduxjs/toolkit';

import { providePacket, sort } from '../features/tickets';

const ticketsMiddleware = createListenerMiddleware();

ticketsMiddleware.startListening({
	actionCreator: providePacket,
	effect: async (action, listenerApi) => {
		listenerApi.dispatch(sort(listenerApi.getState().sorting.criterion));
	},
});

export default ticketsMiddleware;