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
      // НЕ модифицируем state напрямую
      const newState = { ...state };  // Создаем новый объект состояния
      channelsAdapter.removeOne(newState, payload); // Удаляем канал из нового состояния
      if (newState.currentChannelId === payload) {
        // Если удаляется текущий канал, обновляем currentChannelId
        newState.currentChannelId = newState.ids[0] || null;
      }
      return newState; // Возвращаем обновленный объект состояния
    },
    changeChannel: (state, { payload }) => {
      // Используем новый объект состояния, чтобы избежать мутации
      return { ...state, currentChannelId: payload };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchChannels.fulfilled, (state, { payload }) => {
      const newState = { ...state };  // Создаем новый объект состояния
      newState.currentChannelId = payload.length > 0 ? payload[0].id : null; // Устанавливаем первый канал в качестве текущего
      channelsAdapter.setAll(newState, payload);  // Обновляем все каналы
      return newState;  // Возвращаем новый объект состояния
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
