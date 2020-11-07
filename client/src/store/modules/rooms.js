export default {
  actions: {
    SOCKET_update_rooms(ctx, data) {
      ctx.commit("updateRooms", data);
    }
  },
  mutations: {
    updateRooms(state, data) {
      state.rooms = data;
    }
  },
  state: {
    rooms: []
  },
  getters: {
    publicRooms(state) {
      return state.rooms;
    }
  }
};
