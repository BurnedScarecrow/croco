<template>
  <div id="play">
    <Topline />
    <main>
      <!-- <GameStage /> -->
      <Players />
      <Canvas
        v-if="getPainter == getId"
        :timer="timer"
        ref="canvasComponent"
        :words="words"
      />
      <Monitor v-else-if="getPainter != null" />
      <div class="waiter" v-else>
        <img src="@/assets/img/waiting.svg" alt="" />
        <div class="room-name">{{ getRoomName }} — {{ getJoined }}</div>
        <span :class="getStatus == 'public' ? 'green' : 'red'">{{
          getStatus == "public" ? "ОТКРЫТА" : "ЗАКРЫТА"
        }}</span>
        <span
          >Игроков: <span class="poppins">{{ getRoomPlayers.length }}</span> /
          <span class="poppins">{{ getRoomSize }}</span></span
        >

        <span v-if="getRoomPlayers.length == 1" class="ready-block"
          >Ждем игроков</span
        >
        <span v-else-if="getHost != getId" class="ready-block"
          >Ждем команды от хоста</span
        >
        <div v-else class="ready-block">
          <span id="play-button" @click="start()">Старт</span>
        </div>
      </div>

      <Chat />
    </main>
    <div class="complexity">
      <span>
        Сложность
      </span>

      <input
        type="range"
        max="2"
        min="0"
        step="1"
        value="0"
        v-model="complexity"
        @change="changeVocab()"
        v-if="getId == getHost"
      />

      <span>
        {{ getVocab == 0 ? "Низкая" : getVocab == 1 ? "Средняя" : "Высокая" }}
      </span>
    </div>
    <ResultCard
      v-show="congrats"
      :winner="winner"
      :winner_name="this.winner_name"
      :winner_avatar="this.winner_avatar"
      :word="getOldWord"
      :painter="getPainter"
      :uid="getId"
    />
  </div>
</template>

<script>
// @ is an alias to /src
import Players from "@/components/Players.vue";
import Chat from "@/components/Chat.vue";
import Canvas from "@/components/Canvas.vue";
import Monitor from "@/components/Monitor.vue";
import Topline from "@/components/Topline.vue";
import ResultCard from "@/components/ResultCard.vue";
// import footer from "@/components/Footer.vue";
// import GameStage from "@/components/GameStage.vue"

import { mapGetters, mapState } from "vuex";

export default {
  name: "Play",
  data() {
    return {
      complexity: 0,
      words: [],
      toggleSwitch: null,
      sun: require("@/assets/img/sun.svg"),
      moon: require("@/assets/img/moon.svg"),
      hostId: null,
      winner: null,
      word: null,
      winner_name: null,
      winner_avatar: null,
      congrats: false,
      timer: 15,
      timer_id: null
    };
  },
  components: {
    Players,
    Chat,
    Canvas,
    Monitor,
    Topline,
    // Footer,
    ResultCard
  },
  computed: {
    ...mapGetters([
      "getVocab",
      "getJoined",
      "getRoomPlayers",
      "getId",
      "getRoomSize",
      "getHost",
      "getWord",
      "getOldWord",
      "getStatus",
      "getKey",
      "getRoomName",
      "getRoomMinutes",
      "getRoomSeconds",
      "getPainter",
      "getRoomName",
      "getStatus"
    ]),
    ...mapState(["room"])
  },
  watch: {
    getPainter: function() {
      if (this.getPainter == this.getId) {
        this.timer_id = setInterval(() => {
          if (this.timer > 0) {
            this.timer -= 1;
          } else {
            this.clearTimer();
            this.timer = 15;
            this.$socket.emit("choose_word", this.words[0], this.getJoined);
            return;
          }
        }, 1000);
      }
    }
  },
  mounted() {
    if (!this.getJoined) {
      this.$router.push("/").catch(() => {});
    }

    this.$socket.emit("get_room_info", this.getJoined, room => {
      if (room) {
        this.$store.commit("updateRoom", room);
        this.complexity = this.getVocab;
      } else {
        this.$router.push("/").catch(() => {});
      }
    });

    this.detectColorScheme();

    //identify the toggle switch HTML element
    this.toggleSwitch = document.querySelector(' input[type="checkbox"]');

    if (this.toggleSwitch) {
      //listener for changing themes
      this.toggleSwitch.addEventListener("change", this.switchTheme, false);

      if (document.documentElement.getAttribute("data-theme") == "dark") {
        this.toggleSwitch.checked = true;
        document.getElementById("moon").style.opacity = 0;
        document.getElementById("sun").style.opacity = 1;
      } else {
        this.toggleSwitch.checked = false;
        document.getElementById("sun").style.opacity = 0;
        document.getElementById("moon").style.opacity = 1;
      }
    }
  },
  sockets: {
    ping: function() {
      console.log("ping form server");
      this.$socket.emit("ping-pong", this.getId);
    },
    init_game: function(data) {
      this.$store.commit("updateRoom", data.room);

      if (data.room.painter == this.getId) {
        this.words = data.words;
      }
    },
    word_chosen: function(room) {
      this.clearTimer();
      this.$store.commit("updateRoom", room);
    },
    end_round: function(data) {
      if (this.$refs.canvasComponent) {
        this.$refs.canvasComponent.clearImage();
      }
      if (data.winner) {
        if (data.winner == this.getId) {
          this.winner = this.getId;
          this.congrats = true;
          setTimeout(() => {
            this.winner = null;
            this.congrats = false;
          }, 5000);
          // alert(`Вы отгадали слово!`);
        } else {
          for (let i = 0; i < this.getRoomPlayers.length; i++) {
            const element = this.getRoomPlayers[i];
            if (element.id == data.winner) {
              this.winner = element.id;
              this.winner_name = element.name;
              this.winner_avatar = element.avatar;
              this.congrats = true;
              setTimeout(() => {
                this.winner = null;
                this.winner_name = null;
                this.winner_avatar = null;
                this.congrats = false;
              }, 5000);
              // alert(`${element.name} отгадал слово`)

              break;
            }
          }
        }
      } else {
        this.congrats = true;
        setTimeout(() => {
          this.congrats = false;
        }, 5000);
        // alert('Время вышло.');
      }
      this.$store.commit("updateRoom", data.room);
      if (data.winner) {
        if (data.winner == this.getId) {
          this.start(this.getId);
        }
      } else {
        this.$store.commit("disablePainter");
        this.start(null);
      }
    },

    reset_game({ room, text }) {
      this.$toast.error(text, {
        timeout: 2000,
        position: "bottom-right"
      });
      this.$store.commit("updateRoom", room);
      this.$store.commit("resetRoom");
      this.clearTimer();
    },

    change_complexity(data) {
      this.complexity = data;
      this.$store.commit("setVocab", data);
    }
  },
  methods: {
    detectColorScheme: function() {
      var theme = "dark"; //default to light

      //local storage is used to override OS theme settings
      if (localStorage.getItem("theme")) {
        if (localStorage.getItem("theme") == "dark") {
          theme = "dark";
        }
      } else if (!window.matchMedia) {
        //matchMedia method not supported
        return false;
      } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        //OS theme setting detected as dark
        theme = "dark";
      }

      //dark theme preferred, set document with a `data-theme` attribute
      if (theme == "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
      }
    },

    switchTheme: function(e) {
      if (e.target.checked) {
        localStorage.setItem("theme", "dark");
        document.documentElement.setAttribute("data-theme", "dark");
        this.toggleSwitch.checked = true;
        document.getElementById("sun").style.opacity = 1;
        document.getElementById("moon").style.opacity = 0;
      } else {
        localStorage.setItem("theme", "light");
        document.documentElement.setAttribute("data-theme", "light");
        document.getElementById("sun").style.opacity = 0;
        document.getElementById("moon").style.opacity = 1;
      }
    },

    clearTimer: function() {
      clearInterval(this.timer_id);
      for (let i = 0; i < 100; i++) {
        clearInterval(i);
      }
      this.timer_id = null;
      this.timer = 15;
    },

    start: function(painter = null) {
      this.$socket.emit("start_game", this.getJoined, painter, data => {
        if (data != 0) {
          this.$toast.error(data, {
            timeout: 2000,
            position: "bottom-right"
          });
          this.clearTimer();
          this.$store.commit("resetRoom");
        }
      });
    },

    changeVocab: function() {
      if (this.getId == this.getHost) {
        this.$socket.emit("change_vocab", this.getJoined, this.complexity);
      }
    }
  }
};
</script>

<style lang="scss">
.poppins {
  font-family: "Poppins-Light", sans-serif;
}

.green {
  font-family: "Montserat-Regular", "Raleway-Medium", sans-serif;
  color: var(--green);
}

.red {
  font-family: "Montserat-Regular", "Raleway-Medium", sans-serif;
  color: var(--red);
}

#play {
  padding-top: 60px;
  user-select: none !important;
}

#play-button {
  display: flex;
  width: 100px;
  align-items: center;
  justify-content: center;
  height: 40px;
  border-radius: 4px;
  color: var(--light);
  background: var(--green);
  transition: all 0.3s ease;
  font: 1.3em "Montserat-Light", "Raleway", "Poppins", sans-serif;

  &:hover {
    background: var(--blue);
    cursor: pointer;
  }
}

main {
  display: grid;
  justify-items: center;
  width: 95%;
  margin: 0 auto;
  align-items: flex-start;
  grid-gap: 20px;
}

.waiter {
  user-select: text !important;
  // padding-top:10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  grid-area: canvas;
  width: 320px;
  height: auto;
  padding: 20px;
  margin: 0 auto;
  background: var(--primary-color);
  border-radius: 4px;
  font-family: "Montserat-Light", "Raleway-Light", "Poppins", sans-serif;

  img {
    height: 90px;
    align-self: center;
  }

  .room-name {
    align-self: center;
    font-size: 1.15em;
    margin-bottom: 10px;
  }

  .ready-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    margin-top: 10px;
  }
}

.complexity {
  z-index: 3;
  display: grid;
  grid-template-areas: "t1 ranger t2";
  grid-template-columns: 100px auto 100px;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  position: fixed;
  bottom: 0px;
  margin: 0 auto;
  padding: 5px 10px;
  background: var(--primary-color);
  border-radius: 4px;
  font-family: "Montserat-Light", "Raleway-Light", "Poppins", sans-serif;

  span:first-child {
    grid-area: t1;
  }

  span:last-child {
    grid-area: t2;
    text-align-last: right;
  }

  input {
    grid-area: ranger;
  }
}

@media screen and (min-width: 1024px) {
  main {
    grid-template-areas: "players canvas chat";
    grid-template-columns: auto 320px auto;
  }
}

@media screen and (min-width: 600px) and (max-width: 1024px) {
  // players  chat
  //     canvas
  main {
    grid-template-areas:
      "players chat"
      "canvas canvas";
    grid-template-columns: 1fr 1fr;
    align-items: stretch;
  }
}

//Tablet
@media screen and (min-width: 425px) and (max-width: 600px) {
  main {
    grid-template-areas:
      "players"
      "chat"
      "canvas";
    grid-template-columns: 1fr;
    grid-row-gap: 2vh;
  }
}

// Mobile
@media screen and (max-width: 425px) {
  main {
    grid-template-areas:
      "players"
      "chat"
      "canvas";
    grid-template-columns: 1fr;
    grid-row-gap: 2vh;
  }
}
</style>
