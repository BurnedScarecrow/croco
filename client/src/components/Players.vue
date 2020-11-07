<template>
  <div id="players">
    <span>Игроки</span>
    <div id="players-toggle" class="less" @click="togglePlayers()">
      <svg
        width="23"
        height="1"
        viewBox="0 0 23 1"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          id="minus1"
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M0 0V1H23V0H0Z"
          fill="none"
        />
        <path
          id="minus2"
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M0 0V1H23V0H0Z"
          fill="none"
        />
      </svg>
    </div>

    <div id="players-list">
      <div
        class="player"
        :class="player.id == getId ? 'me' : ''"
        v-for="player in getRoomPlayers"
        :key="player.id"
      >
        <img :src="player.avatar" alt="" />
        <span>{{ player.name }}</span>
        <span v-if="player.id == getRoomPlayers[0].id">
          <img src="@/assets/img/star.svg" alt="(Хост)" title="Хост" />
        </span>

        <svg
          v-if="player.id != getId && getId == getRoomPlayers[0].id"
          title="Исключить"
          @click="kick(player.name, player.id)"
          class="remove"
          width="512"
          height="512"
          viewBox="0 0 512 512"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-width="0"
            d="M256 0C114.842 0 0 114.842 0 256C0 397.158 114.842 512 256 512C397.158 512 512 397.158 512 256C512 114.842 397.158 0 256 0ZM256 462.452C142.163 462.452 49.548 369.838 49.548 256C49.548 142.162 142.163 49.548 256 49.548C369.837 49.548 462.452 142.163 462.452 256C462.452 369.837 369.837 462.452 256 462.452Z"
            fill="black"
          />
          <path
            stroke-width="0"
            d="M371.613 231.226H140.387V280.774H371.613V231.226Z"
            fill="black"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import KickPromptVue from "./KickPrompt.vue";

export default {
  computed: {
    ...mapGetters([
      "getJoined",
      "getRoomPlayers",
      "getId",
      "getStatus",
      "getKey",
      "getRoomName",
      "getRoomMinutes",
      "getRoomSeconds"
    ]),
    ...mapState(["room"])
  },
  watch: {
    getId: function() {
      this.$toast.error(
        "Вы были отключены сервером, попробуйте переподключиться.",
        {
          timeout: 2000,
          position: "bottom-right"
        }
      );
      this.$router.push("/");
    }
  },
  methods: {
    togglePlayers: function() {
      const el = document.getElementById("players-toggle");
      const players = document.getElementById("players");
      if (el.classList.contains("less")) {
        el.classList.remove("less");
        el.classList.add("more");
        players.style.maxHeight = "30px";
      } else {
        el.classList.remove("more");
        el.classList.add("less");
        players.style.maxHeight = "60vh";
      }
    },
    kick(name, id) {
      const content = {
        component: KickPromptVue,
        // Any prop can be passed, but don't expect them to be reactive
        props: {
          name: name
        },
        // Listen and react to events using callbacks. In this case we listen for
        // the "click" event emitted when clicking the toast button
        listeners: {
          click: () => {
            this.$toast.clear();
            this.$socket.emit("kick", id, name, this.getJoined, data => {
              if (data) {
                setTimeout(() => {
                  this.$toast.success(`${name} исключен(а)`, {
                    timeout: 2000,
                    position: "bottom-right"
                  });
                }, 500);
              } else {
                setTimeout(() => {
                  this.$toast.error(`Не удалось исключить игрока ${name}`, {
                    timeout: 1000,
                    position: "bottom-right"
                  });
                }, 500);
              }
            });
          }
        }
      };

      // Render the toast and its contents
      this.$toast(content, { timeout: 3000, position: "bottom-right" });
    }
  }
};
</script>

<style lang="scss">
#players {
  position: relative;
  overflow: hidden;
  max-height: 60vh;
  grid-area: players;
  display: flex;
  flex-direction: column;
  padding: 5px 5px;
  background: var(--primary-color);
  transition: all 0.5s ease;
  border-radius: 4px;
  // box-shadow: 0 0 5px rgba(0,0,0,.2);
  font-family: "Raleway", sans-serif;

  #players-toggle {
    width: 16px;
    height: 16px;
    cursor: pointer;
    position: absolute;
    top: 8px;
    right: 20px;

    svg {
      width: 16px;
      height: 16px;
    }

    &.less {
      svg path {
        transition: all 0.3s ease;
        fill: var(--text-color);

        &#minus2 {
          transform: rotate(0deg);
          transform-origin: center;
        }
      }
    }

    &.more {
      svg path {
        fill: var(--text-color);
        transition: all 0.3s ease;

        &#minus2 {
          transform: rotate(-90deg);
          transform-origin: center;
        }
      }
    }
  }

  span:nth-child(1) {
    font-size: 1.2em;
    text-align: center;
    margin-bottom: 5px;
  }

  #players-list {
    width: 100%;
    max-height: 40vh;
    overflow: auto;
  }

  .player {
    display: flex;
    align-items: center;
    width: 100%;
    height: 50px;
    margin: 2px 0;
    overflow: hidden;
    padding: 5px 5px;
    font-weight: 200;
    color: var(--text-color);
    border-radius: 50px 8px 8px 50px;
    transition: all 0.3s ease;
    position: relative;

    .remove {
      width: 16px;
      height: 16px;
      position: absolute;
      transform: translate(0, -50%);
      top: 50%;
      right: 10px;
      cursor: pointer;

      path {
        transition: fill 0.3s ease;
        fill: var(--secondary-color);
      }

      &:hover path {
        fill: var(--red);
      }
    }

    &.me {
      background: var(--background-color);
      &:hover {
        cursor: default;
      }
    }

    img {
      height: 100%;
      margin-right: 10px;
      border-radius: 50%;
    }

    span > img {
      width: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-left: 7px;
    }
  }
}

@media screen and (min-width: 1024px) {
  #players {
    width: 270px;
  }
}

@media screen and (min-width: 600px) and (max-width: 1024px) {
  // players  chat
  //     canvas
  #players {
    width: 90% !important;
    margin: 0 auto;
  }
}

//Tablet
@media screen and (min-width: 425px) and (max-width: 600px) {
  #players {
    margin: 0 auto;
    width: 90%;
  }
}

// Mobile
@media screen and (max-width: 425px) {
  #players {
    width: 100%;
  }
}
</style>
