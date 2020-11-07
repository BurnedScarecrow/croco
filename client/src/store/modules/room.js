export default {
  actions: {
    SOCKET_new_player(ctx, player) {
      ctx.commit("addPlayer", player);
    },
    SOCKET_change_status(ctx, status) {
      ctx.commit("updateStatus", status);
    },
    SOCKET_update_players(ctx, players) {
      ctx.commit("updatePlayers", players);
    },
    SOCKET_update_timer(ctx, timer) {
      ctx.commit("updateTimer", timer);
    }
  },
  mutations: {
    updateWaiting(state, data) {
      state.wait = data;
    },
    disableWord(state) {
      state.word = null;
    },
    disablePainter(state) {
      state.painter = "disabled";
    },
    updateImage(state, image) {
      state.image = image;
    },
    updateTimer(state, timer) {
      state.restTime = timer;
    },
    updateStatus(state, status) {
      state.status = status;
    },
    updatePlayers(state, players) {
      state.players = players;
    },
    addPlayer(state, player) {
      state.players.push(player);
    },
    updateRoom(state, room) {
      state.key = room.key;
      state.name = room.name;
      state.status = room.status;
      state.size = room.size;
      state.time = room.time;
      state.restTime = room.restTime;
      state.minutes = room.minutes;
      state.seconds = room.seconds;
      state.image = room.image;
      state.players = room.players;
      state.painter = room.painter;
      state.word = room.word;
      state.old_word = room.old_word;
      state.vocab = room.vocab;
    },
    resetRoom(state) {
      state.painter = null;
      state.word = null;
      state.image = new Image();
    },
    setVocab(state, data) {
      state.vocab = data;
    }
  },
  state: {
    wait: true,
    key: "",
    name: "",
    status: "public",
    size: 0,
    time: 0,
    minutes: 0,
    seconds: 0,
    restTime: 0,
    image: new Image(),
    players: [],
    painter: null,
    word: null,
    old_word: null,
    vocab: 0
  },
  getters: {
    getVocab(state) {
      return state.vocab;
    },
    getHost(state) {
      return state.players.length > 0 ? state.players[0].id : null;
    },
    getStatus(state) {
      return state.status;
    },
    getKey(state) {
      return state.key;
    },
    getRoomName(state) {
      return state.name;
    },
    getRoomSize(state) {
      return state.size;
    },
    getRoomTime(state) {
      return state.time;
    },
    getRoomRestTime(state) {
      return state.restTime;
    },
    getRoomMinutes(state) {
      return state.minutes;
    },
    getRoomSeconds(state) {
      return state.seconds;
    },
    getRoomImage(state) {
      return state.image;
    },
    getRoomPlayers(state) {
      return state.players;
    },
    getPainter(state) {
      return state.painter;
    },
    getPainterName(state) {
      for (let i = 0; i < state.players.length; i++) {
        const element = state.players[i];
        if (element.id == state.painter) {
          return element.name;
        }
      }
      return null;
    },
    getWord(state) {
      return state.word;
    },
    getOldWord(state) {
      return state.old_word;
    },
    waiting(state) {
      return state.wait;
    }
  }
};
