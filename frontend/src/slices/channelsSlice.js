import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { fetchChannels } from './fetchData.js';

const channelsAdapter = createEntityAdapter();

const initialState = channelsAdapter.getInitialState({
  currentChannelId: null,
});

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    addChannels: (state, { payload }) => {
      channelsAdapter.addMany(state, payload);
      if (!state.currentChannelId) {
        const generalChannel = Object.values(state.entities).find(ch => ch.name === 'general');
        state.currentChannelId = generalChannel ? generalChannel.id : state.ids[0] || null;
      }
    },
    addChannel: (state, { payload }) => {
      channelsAdapter.addOne(state, payload);
    },
    renameChannel: (state, { payload }) => {
      channelsAdapter.updateOne(state, {
        id: payload.id,
        changes: { name: payload.name },
      });
    },
    removeChannel: (state, { payload }) => {
      channelsAdapter.removeOne(state, payload);
      if (state.currentChannelId === payload) {
        const generalChannel = Object.values(state.entities).find(ch => ch.name === 'general');
        state.currentChannelId = generalChannel ? generalChannel.id : state.ids[0] || null;
      }
    },
    changeChannel: (state, { payload }) => {
      state.currentChannelId = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchChannels.fulfilled, (state, { payload }) => {
      channelsAdapter.setAll(state, payload);
      const generalChannel = payload.find(ch => ch.name === 'general');
      state.currentChannelId = generalChannel ? generalChannel.id : payload[0]?.id || null;
    });
  },
});

export const { actions } = channelsSlice;
const selectors = channelsAdapter.getSelectors((state) => state.channels);

export const customSelectors = {
  allChannels: selectors.selectAll,
  channelsNames: createSelector(
    selectors.selectAll,
    (allChannels) => allChannels.map(({ name }) => name),
  ),
  currentChannel: (state) => {
    const { currentChannelId } = state.channels;
    return selectors.selectById(state, currentChannelId);
  },
};

export default channelsSlice.reducer;
