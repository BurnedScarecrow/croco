export default {
  actions: {
    SOCKET_connect() {
      // console.log(`Socket connected`)
    },
    SOCKET_user_data(ctx, id) {
      ctx.commit("updateId", id);
    },
    updateSecret: (ctx, secret) => {
      if (secret.length < 6) {
        ctx.commit("updateSecret", secret);
      }
    },
    updateName: (ctx, name) => {
      ctx.commit("updateName", name);
    },
    updateAvatar: (ctx, avatar) => {
      ctx.commit("updateAvatar", avatar);
    },
    updateRoomName: (ctx, name) => {
      ctx.commit("updateRoomName", name);
    },
    joinRoom: (ctx, room) => {
      ctx.commit("updateJoined", room.key);
    },
    leaveRoom: ctx => {
      ctx.commit("updateJoined", false);
    }
  },
  mutations: {
    updateId(state, id) {
      state.id = id;
    },
    updateSecret: (state, secret) => {
      state.secret = secret;
    },
    updateName: (state, name) => {
      state.name = name;
    },
    updateAvatar: (state, avatar) => {
      state.avatar = avatar;
    },
    updateMinutes: (state, minutes) => {
      state.new_room.minutes = minutes;
    },
    updateSeconds: (state, seconds) => {
      state.new_room.seconds = seconds;
    },
    updateRoomName: (state, name) => {
      state.new_room.name = name;
    },
    incSize: state => {
      if (state.new_room.size < 10) {
        state.new_room.size += 1;
      }
    },
    decSize: state => {
      if (state.new_room.size > 2) {
        state.new_room.size -= 1;
      }
    },
    incComplexity: state => {
      if (state.new_room.vocab < 2) {
        state.new_room.vocab += 1;
      }
    },
    decComplexity: state => {
      if (state.new_room.vocab > 0) {
        state.new_room.vocab -= 1;
      }
    },
    incMinutes: state => {
      if (state.new_room.minutes < 4) {
        state.new_room.minutes += 1;
      }
    },
    decMinutes: state => {
      if (state.new_room.minutes > 1) {
        state.new_room.minutes -= 1;
      }
    },
    incSeconds: state => {
      if (state.new_room.seconds < 50) {
        state.new_room.seconds += 10;
      }
    },
    decSeconds: state => {
      if (state.new_room.seconds > 0) {
        state.new_room.seconds -= 10;
      }
    },
    updateJoined: (state, val) => {
      state.joined = val;
    }
  },
  state: {
    id: "",
    name: "",
    avatar: "",
    joined: false,
    new_room: {
      name: "",
      size: 2,
      minutes: 1,
      seconds: 30,
      vocab: 0
    },
    secret: ""
  },
  getters: {
    getComplexity(state) {
      return state.new_room.vocab;
    },
    getId(state) {
      return state.id;
    },
    getSecret(state) {
      return state.secret;
    },
    getName(state) {
      return state.name;
    },
    getAvatar(state) {
      return state.avatar;
    },
    getNewRoomName(state) {
      return state.new_room.name;
    },
    getSize(state) {
      return state.new_room.size;
    },
    getMinutes(state) {
      return state.new_room.minutes;
    },
    getSeconds(state) {
      return state.new_room.seconds;
    },
    getJoined(state) {
      return state.joined;
    },
    getImage(state) {
      return state.image;
    },
    getAll(state) {
      let data = {
        name: state.new_room.name,
        size: state.new_room.size,
        time: state.new_room.minutes * 60 + state.new_room.seconds,
        minutes: state.new_room.minutes,
        seconds: state.new_room.seconds,
        vocab: state.new_room.vocab,

        status: "public",
        players: [
          {
            name: state.name,
            avatar: state.avatar
          }
        ],
        image: new Image()
      };
      return data;
    }
  }
};
