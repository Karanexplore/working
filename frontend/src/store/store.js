import { configureStore } from '@reduxjs/toolkit';

import commonSlice from './commonSlice.js';
import adminSlice from './adminSlice.js';
import participantSlice from './participantSlice.js';
import organizerSlice from './organizerSlice.js';
import ticketSlice from './ticketSlice.js';

export default configureStore({
    reducer: {
        common: commonSlice,
        admin: adminSlice,
        participant: participantSlice,
        organizer: organizerSlice,
        ticket: ticketSlice
    }
});

