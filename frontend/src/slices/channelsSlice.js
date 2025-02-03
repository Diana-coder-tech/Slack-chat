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
      // Используем removeOne для корректного обновления состояния
      if (state.currentChannelId === payload) {
        const firstChannelId = state.ids[0] || null;
        channelsAdapter.removeOne(state, payload);
        state.currentChannelId = firstChannelId;
      } else {
        channelsAdapter.removeOne(state, payload);
      }
    },
    changeChannel: (state, { payload }) => {
      // Просто обновляем currentChannelId с помощью мутирующего метода
      state.currentChannelId = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchChannels.fulfilled, (state, { payload }) => {
      // Обновляем все каналы через channelsAdapter
      channelsAdapter.setAll(state, payload);
      // Если каналы есть, устанавливаем первый канал как текущий
      state.currentChannelId = payload.length > 0 ? payload[0].id : null;
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
