<template>
  <div id="chat">
    <div id="chat-toggle" class="less" @click="toggleChat()">
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

    <span>Чат</span>
    <div id="chat-list">
      <div
        v-for="(message, c) in messages"
        :key="c"
        :class="message.id == getId ? 'message mine' : 'message'"
      >
        <img :src="'.' + message.avatar" alt="avatar" />
        <div class="content">
          <div class="author">{{ message.author }}</div>
          <div class="text" v-if="message.html" v-html="message.text"></div>
          <div class="text" v-else>{{ message.text }}</div>
        </div>
      </div>
    </div>
    <form id="sender" autocomplete="off" v-if="getId != getPainter">
      <input
        type="text"
        id="new-message"
        v-model="new_message"
        placeholder="Сообщение"
        autocomplete="off"
        autofocus
        spellcheck="false"
      />
      <button id="send-message" @submit.prevent @click="sendMessage($event)">
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.4921 0.0196896L0.266484 3.68778C-0.0505423 3.79137 -0.0963882 4.22259 0.192138 4.39034L4.43439 6.85714C4.56823 6.93497 4.7355 6.92559 4.85976 6.83329L6.05228 5.94768L5.16667 7.1402C5.0744 7.26448 5.06501 7.43178 5.14282 7.56559L7.60961 11.8079C7.77756 12.0966 8.20868 12.0503 8.3122 11.7335L11.9803 0.507906C12.0787 0.206485 11.792 -0.0783892 11.4921 0.0196896ZM7.84458 10.6718L5.94029 7.39694L8.23653 4.30494C8.35094 4.15083 8.33519 3.93617 8.19946 3.80044C8.06377 3.66472 7.84905 3.64895 7.69497 3.76338L4.60297 6.05964L1.3281 4.15533L11.0074 0.992494L7.84458 10.6718ZM4.06422 8.48314L1.49399 11.0533C1.34283 11.2045 1.09773 11.2045 0.946575 11.0533C0.795393 10.9022 0.795393 10.6571 0.946575 10.5059L3.5168 7.93572C3.66801 7.78459 3.91311 7.78454 4.06422 7.93572C4.2154 8.08688 4.2154 8.33198 4.06422 8.48314ZM0.668742 8.58039C0.517559 8.42921 0.517559 8.18414 0.668742 8.03298L1.68292 7.01878C1.83407 6.8676 2.07917 6.8676 2.23033 7.01878C2.38151 7.16996 2.38151 7.41504 2.23033 7.5662L1.21616 8.58039C1.06502 8.73153 0.8199 8.73155 0.668742 8.58039ZM4.98116 9.76958C5.13234 9.92074 5.13234 10.1658 4.98116 10.317L3.96696 11.3312C3.89138 11.4068 3.79231 11.4446 3.69326 11.4446C3.35149 11.4446 3.17502 11.0283 3.41957 10.7838L4.43376 9.76958C4.5849 9.6184 4.83 9.6184 4.98116 9.76958Z"
            fill="none"
          />
        </svg>
      </button>
    </form>
    <!-- <span v-else style="text-align:center;">Ваше дело - рисовать</span> -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      new_message: "",
      messages: []
    };
  },
  computed: {
    ...mapGetters(["getJoined", "getId", "getRoomPlayers", "getPainter"])
  },
  mounted: function() {},
  sockets: {
    new_message: function(data) {
      var chat = document.querySelector("#chat-list");
      if (
        chat.offsetHeight + chat.scrollTop >=
        chat.scrollHeight - chat.offsetHeight / 2
      ) {
        this.messages.push({
          text: data.text,
          id: data.id,
          author: data.author,
          avatar: data.avatar
        });
        setTimeout(() => {
          chat.scrollTop = chat.scrollHeight;
        });
      } else {
        this.messages.push({
          text: data.text,
          id: data.id,
          author: data.author,
          avatar: data.avatar
        });
      }
    },
    kick: function(data) {
      console.log(this.getId, data.id, data.name, "kick");

      if (this.getId == data.id) {
        this.$toast.warning("Вы были исключены из комнаты");
        this.$router.push("/");
      } else {
        var chat = document.querySelector("#chat-list");
        if (
          chat.offsetHeight + chat.scrollTop >=
          chat.scrollHeight - chat.offsetHeight / 2
        ) {
          this.messages.push({
            html: true,
            text: `<span class="host-warn">${data.name} исключен(а)</span>`,
            id: this.getRoomPlayers[0].id,
            author: `${this.getRoomPlayers[0].name} (Хост)`,
            avatar: this.getRoomPlayers[0].avatar
          });
          setTimeout(() => {
            chat.scrollTop = chat.scrollHeight;
          });
        } else {
          this.messages.push({
            html: true,
            text: `<span class="host-warn";>${data.name} исключен(а)</span>`,
            id: this.getRoomPlayers[0].id,
            author: "Хост",
            avatar: this.getRoomPlayers[0].avatar
          });
        }
      }
    }
  },
  methods: {
    sendMessage: function(event) {
      event.preventDefault();
      if (this.new_message.trim()) {
        this.$socket.emit("new_message", this.new_message, this.getJoined);
        this.new_message = "";
        document.querySelector("#new-message").focus();
      }
    },
    toggleChat: function() {
      const el = document.getElementById("chat-toggle");
      const chat = document.getElementById("chat");
      if (el.classList.contains("less")) {
        el.classList.remove("less");
        el.classList.add("more");
        chat.style.maxHeight = "30px";
      } else {
        el.classList.remove("more");
        el.classList.add("less");
        chat.style.maxHeight = "60vh";
      }
    }
  }
};
</script>

<style lang="scss">
.host-warn {
  color: #e67e22;
  // color: var(--warn);
  font-family: "Raleway-Medium";
}

#chat {
  height: auto;
  max-height: 60vh;
  grid-area: chat;
  display: flex;
  flex-direction: column;
  padding: 5px 5px;
  background: var(--primary-color);
  border-radius: 4px;
  font-family: "Raleway", sans-serif;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease-in-out;

  span:nth-child(2) {
    // width:100%;
    font-size: 1.2em;
    text-align: center;
    margin-bottom: 5px;
  }

  #chat-toggle {
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

  #chat-list {
    // display: flex;
    // flex-direction: column;
    max-width: 100%;
    min-height: 20vh;
    // max-height: 50vh;
    overflow-y: auto;
    // margin-bottom: 30px;
    // overflow-x: hidden;

    .message {
      width: 100%;
      height: auto;
      padding: 5px;
      border-radius: 4px;
      display: grid;
      grid-template-areas: "avatar message self";
      grid-template-columns: 40px 1fr 40px;
      grid-gap: 5px;

      img {
        grid-area: avatar;
      }

      .content {
        grid-area: message;
        word-wrap: break-word;
        width: 100%;
        overflow-x: hidden;
        height: auto;
        align-self: flex-end;
        padding: 5px 8px;
        border-radius: 8px;
        font-size: 0.87em;
        background: var(--background-color);

        .text {
          width: auto;
          height: auto;
        }

        .author {
          font-size: 1.1em;
          font-family: "Raleway-Medium", "Poppins", sans-serif;
        }
      }

      &.mine {
        img {
          grid-area: self;
        }
        .content {
          width: auto;
          max-width: 100%;
          justify-self: flex-end;

          .text {
            max-width: 100%;
            align-self: flex-end;
            justify-self: flex-end;
            justify-content: flex-end;
            align-content: flex-end;
          }

          .author {
            display: none;
          }
        }
      }
    }
  }

  #sender {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 5px;
    // position: rela;
    // bottom: 0;
    // left:0;

    input {
      line-height: 24px;
      height: 24px;
      font-size: 0.9em;
      background: var(--background-color);
      color: var(--text-color);
      outline: none !important;
      border: 0;
      padding: 3px 5px;
      width: calc(100% - 45px);
      border-radius: 4px;
      font-family: "Raleway", "Poppins", sans-serif;

      &::placeholder {
        color: var(--secondary-color);
      }
    }

    #send-message {
      outline: none !important;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 40px;
      height: 24px;
      background: var(--green);
      border-radius: 4px;
      border: 0;
      transition: all 0.3s ease;
      cursor: pointer;

      &:hover {
        background: var(--blue);
      }

      svg {
        width: 16px;
        height: 16px;

        path {
          fill: var(--light);
        }
      }
    }
  }
}

@media screen and (min-width: 1024px) {
  #chat {
    width: 270px;
  }
}

@media screen and (min-width: 600px) and (max-width: 1024px) {
  // chat  chat
  //     canvas
  #chat {
    width: 90%;
  }
}

//Tablet
@media screen and (min-width: 425px) and (max-width: 600px) {
  #chat {
    width: 90% !important;
    margin: 0 auto;
  }
}

// Mobile
@media screen and (max-width: 425px) {
  #chat {
    width: 100%;
  }
}
</style>
