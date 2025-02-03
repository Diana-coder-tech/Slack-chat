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
    addChannels: channelsAdapter.addMany,
    addChannel: channelsAdapter.addOne,
    renameChannel: channelsAdapter.updateOne,
    removeChannel: (state, { payload }) => {
      const newState = { ...state };
      if (newState.currentChannelId === payload) {
        newState.currentChannelId = newState.ids[0] || null;
      }
      channelsAdapter.removeOne(newState, payload);
      return newState; // Возвращаем измененное состояние
    },
    changeChannel: (state, { payload }) => ({
      ...state,
      currentChannelId: payload,
    }),
  },
  extraReducers: (builder) => {
    builder.addCase(fetchChannels.fulfilled, (state, { payload }) => {
      console.log('Каналы загружены:', payload); // Проверка загруженных каналов
      const newState = { ...state };
      channelsAdapter.setAll(newState, payload);
      newState.currentChannelId = payload.length > 0 ? payload[0].id : null;
      return newState; // Возвращаем измененное состояние
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
