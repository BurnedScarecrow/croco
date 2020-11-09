<template>
  <div id="preparation">
    <div id="prevStep" @click="prevStep()">Создать комнату</div>
    <div id="prep-window">
      <div class="pre-block" :class="visibility[0]" id="user-info">
        <span class="block-title">
          Персонаж
        </span>
        <div id="avatar-slider">
          <div id="prev-ava" @click="prevAva()">
            <svg
              class="arrow-left"
              width="358"
              height="612"
              viewBox="0 0 358 612"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M349.972 604.501C360.022 594.502 360.022 578.279 349.972 568.28L62.1957 306.014L349.972 43.7213C360.022 33.7223 360.022 17.4983 349.972 7.49928C339.922 -2.49972 323.622 -2.49972 313.573 7.49928L7.33171 286.602C1.97471 291.933 -0.320277 299.024 0.0357227 305.988C-0.320278 312.976 1.97471 320.043 7.33171 325.374L313.6 604.502C323.648 614.5 339.922 614.5 349.972 604.501Z"
              />
            </svg>
          </div>
          <div id="avatar">
            <img :src="user.avatar" id="ava-img" alt="Avatar" />
          </div>
          <div id="next-ava" @click="nextAva()">
            <svg
              class="arrow-right"
              width="358"
              height="612"
              viewBox="0 0 358 612"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.53751 7.49937C-2.51249 17.4984 -2.51249 33.7213 7.53751 43.7203L295.314 305.986L7.5375 568.279C-2.5125 578.278 -2.5125 594.502 7.5375 604.501C17.5875 614.5 33.8875 614.5 43.9365 604.501L350.177 325.398C355.534 320.067 357.829 312.976 357.473 306.012C357.829 299.024 355.534 291.957 350.177 286.626L43.9095 7.49834C33.8615 -2.49965 17.5875 -2.49965 7.53751 7.49937Z"
              />
            </svg>
          </div>
        </div>
        <input
          type="text"
          id="username"
          max="20"
          placeholder="Имя"
          v-model="user.name"
          spellcheck="false"
          autocomplete="off"
        />
      </div>
      <form
        autocomplete="off"
        class="pre-block"
        :class="visibility[1]"
        id="create-room"
      >
        <div class="block-title">Новая комната</div>
        <input
          type="text"
          id="new-room-name"
          maxlength="15"
          v-model="user.new_room.name"
          spellcheck="false"
          placeholder="Название"
          autocomplete="off"
          autofocus
        />
        <div id="roommates">
          <div id="decrease-number" @click="decSize()">
            <svg
              class="arrow-left small"
              width="358"
              height="612"
              viewBox="0 0 358 612"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M349.972 604.501C360.022 594.502 360.022 578.279 349.972 568.28L62.1957 306.014L349.972 43.7213C360.022 33.7223 360.022 17.4983 349.972 7.49928C339.922 -2.49972 323.622 -2.49972 313.573 7.49928L7.33171 286.602C1.97471 291.933 -0.320277 299.024 0.0357227 305.988C-0.320278 312.976 1.97471 320.043 7.33171 325.374L313.6 604.502C323.648 614.5 339.922 614.5 349.972 604.501Z"
              />
            </svg>
          </div>
          <div id="roommates-number">{{ getSize }}</div>
          <div id="increase-number" @click="incSize()">
            <svg
              class="arrow-right small"
              width="358"
              height="612"
              viewBox="0 0 358 612"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.53751 7.49937C-2.51249 17.4984 -2.51249 33.7213 7.53751 43.7203L295.314 305.986L7.5375 568.279C-2.5125 578.278 -2.5125 594.502 7.5375 604.501C17.5875 614.5 33.8875 614.5 43.9365 604.501L350.177 325.398C355.534 320.067 357.829 312.976 357.473 306.012C357.829 299.024 355.534 291.957 350.177 286.626L43.9095 7.49834C33.8615 -2.49965 17.5875 -2.49965 7.53751 7.49937Z"
              />
            </svg>
          </div>
          <div id="rt">игроки</div>

          <div id="decrease-complexity" @click="decComplexity()">
            <svg
              class="arrow-left small"
              width="358"
              height="612"
              viewBox="0 0 358 612"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M349.972 604.501C360.022 594.502 360.022 578.279 349.972 568.28L62.1957 306.014L349.972 43.7213C360.022 33.7223 360.022 17.4983 349.972 7.49928C339.922 -2.49972 323.622 -2.49972 313.573 7.49928L7.33171 286.602C1.97471 291.933 -0.320277 299.024 0.0357227 305.988C-0.320278 312.976 1.97471 320.043 7.33171 325.374L313.6 604.502C323.648 614.5 339.922 614.5 349.972 604.501Z"
              />
            </svg>
          </div>
          <div id="complexity-number">{{ getComplexity + 1 }}</div>
          <div id="increase-complexity" @click="incComplexity()">
            <svg
              class="arrow-right small"
              width="358"
              height="612"
              viewBox="0 0 358 612"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.53751 7.49937C-2.51249 17.4984 -2.51249 33.7213 7.53751 43.7203L295.314 305.986L7.5375 568.279C-2.5125 578.278 -2.5125 594.502 7.5375 604.501C17.5875 614.5 33.8875 614.5 43.9365 604.501L350.177 325.398C355.534 320.067 357.829 312.976 357.473 306.012C357.829 299.024 355.534 291.957 350.177 286.626L43.9095 7.49834C33.8615 -2.49965 17.5875 -2.49965 7.53751 7.49937Z"
              />
            </svg>
          </div>
          <div id="ct">уровень</div>
          <!-- </div>
        <div id="room-time"> -->
          <div id="decMins" @click="decMins()">
            <svg
              class="arrow-left small"
              width="358"
              height="612"
              viewBox="0 0 358 612"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M349.972 604.501C360.022 594.502 360.022 578.279 349.972 568.28L62.1957 306.014L349.972 43.7213C360.022 33.7223 360.022 17.4983 349.972 7.49928C339.922 -2.49972 323.622 -2.49972 313.573 7.49928L7.33171 286.602C1.97471 291.933 -0.320277 299.024 0.0357227 305.988C-0.320278 312.976 1.97471 320.043 7.33171 325.374L313.6 604.502C323.648 614.5 339.922 614.5 349.972 604.501Z"
              />
            </svg>
          </div>
          <div id="mins">{{ getMinutes }}</div>
          <div id="incMins" @click="incMins()">
            <svg
              class="arrow-right small"
              width="358"
              height="612"
              viewBox="0 0 358 612"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.53751 7.49937C-2.51249 17.4984 -2.51249 33.7213 7.53751 43.7203L295.314 305.986L7.5375 568.279C-2.5125 578.278 -2.5125 594.502 7.5375 604.501C17.5875 614.5 33.8875 614.5 43.9365 604.501L350.177 325.398C355.534 320.067 357.829 312.976 357.473 306.012C357.829 299.024 355.534 291.957 350.177 286.626L43.9095 7.49834C33.8615 -2.49965 17.5875 -2.49965 7.53751 7.49937Z"
              />
            </svg>
          </div>
          <div id="decSecs" @click="decSecs()">
            <svg
              class="arrow-left small"
              width="358"
              height="612"
              viewBox="0 0 358 612"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M349.972 604.501C360.022 594.502 360.022 578.279 349.972 568.28L62.1957 306.014L349.972 43.7213C360.022 33.7223 360.022 17.4983 349.972 7.49928C339.922 -2.49972 323.622 -2.49972 313.573 7.49928L7.33171 286.602C1.97471 291.933 -0.320277 299.024 0.0357227 305.988C-0.320278 312.976 1.97471 320.043 7.33171 325.374L313.6 604.502C323.648 614.5 339.922 614.5 349.972 604.501Z"
              />
            </svg>
          </div>
          <div id="secs">{{ getSeconds }}</div>
          <div id="incSecs" @click="incSecs()">
            <svg
              class="arrow-right small"
              width="358"
              height="612"
              viewBox="0 0 358 612"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.53751 7.49937C-2.51249 17.4984 -2.51249 33.7213 7.53751 43.7203L295.314 305.986L7.5375 568.279C-2.5125 578.278 -2.5125 594.502 7.5375 604.501C17.5875 614.5 33.8875 614.5 43.9365 604.501L350.177 325.398C355.534 320.067 357.829 312.976 357.473 306.012C357.829 299.024 355.534 291.957 350.177 286.626L43.9095 7.49834C33.8615 -2.49965 17.5875 -2.49965 7.53751 7.49937Z"
              />
            </svg>
          </div>
          <div id="mt">минуты</div>
          <div id="st">секунды</div>
        </div>
        <button id="create" @click="createRoom($event)">
          Создать
        </button>
      </form>
      <div class="pre-block" :class="visibility[2]" id="choose-room">
        <form id="private-game">
          <input
            type="text"
            id="room-key"
            v-model="user.secret"
            maxlength="6"
            placeholder="Ключ"
            autocomplete="off"
            spellcheck="off"
          />
          <button
            id="private-play"
            @submit.prevent
            @click="joinRoom(null, $event)"
          >
            <svg
              class="arrow-right small"
              width="358"
              height="612"
              viewBox="0 0 358 612"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.53751 7.49937C-2.51249 17.4984 -2.51249 33.7213 7.53751 43.7203L295.314 305.986L7.5375 568.279C-2.5125 578.278 -2.5125 594.502 7.5375 604.501C17.5875 614.5 33.8875 614.5 43.9365 604.501L350.177 325.398C355.534 320.067 357.829 312.976 357.473 306.012C357.829 299.024 355.534 291.957 350.177 286.626L43.9095 7.49834C33.8615 -2.49965 17.5875 -2.49965 7.53751 7.49937Z"
              />
            </svg>
          </button>
        </form>

        <div id="rooms-list">
          <div id="rooms-list-head">
            <span title="Название комнаты">Комнаты</span>

            <!-- size -->
            <svg
              width="512"
              height="512"
              viewBox="0 0 512 512"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M256 60C272.569 60 286 46.5685 286 30C286 13.4315 272.569 0 256 0C239.431 0 226 13.4315 226 30C226 46.5685 239.431 60 256 60Z"
                fill="black"
              />
              <path
                d="M255 275C266.046 275 275 266.046 275 255C275 249.477 272.762 244.477 269.143 240.858L91.643 63.358L63.357 91.642L240.857 269.142C244.477 272.761 249.477 275 255 275Z"
                fill="black"
              />
              <path
                d="M453.344 92.921C419.49 51.998 373.56 22.55 322.716 8.82001C324.844 15.505 326 22.619 326 30C326 37.156 324.916 44.063 322.911 50.57C410.603 79.116 472 161.905 472 256C472 375.103 375.103 472 256 472C136.897 472 40 375.103 40 256C40 218.893 49.305 183.228 66.787 151.64L37.537 122.39C13.085 162.203 0 208.089 0 256C0 324.38 26.629 388.667 74.98 437.02C123.333 485.371 187.62 512 256 512C324.38 512 388.667 485.371 437.02 437.02C485.371 388.667 512 324.38 512 256C512 196.562 491.169 138.646 453.344 92.921Z"
                fill="black"
              />
            </svg>

            <!-- time -->
            <svg
              width="512"
              height="512"
              viewBox="0 0 512 512"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M495.372 333.944L449.56 308.665L495.376 283.376C505.496 277.789 511.536 267.552 511.533 255.993C511.531 244.439 505.489 234.21 495.374 228.631L449.551 203.344L495.373 178.054C505.49 172.47 511.531 162.238 511.531 150.682C511.531 139.127 505.49 128.895 495.373 123.311L460.268 103.935C456.645 101.934 452.081 103.251 450.079 106.876C448.078 110.502 449.395 115.063 453.021 117.065L488.126 136.442C493.391 139.347 496.534 144.671 496.534 150.683C496.534 156.695 493.391 162.02 488.126 164.925L278.862 280.424C264.547 288.324 247.453 288.324 233.138 280.424L23.8743 164.924C18.6092 162.019 15.4672 156.694 15.4672 150.682C15.4672 144.67 18.6092 139.346 23.8743 136.441L233.141 20.9393C247.455 13.0312 264.545 13.0312 278.862 20.9403L426.767 102.576C430.391 104.577 434.955 103.26 436.956 99.6336C438.957 96.0075 437.64 91.4464 434.014 89.4444L286.112 7.81213C267.257 -2.60404 244.744 -2.60404 225.891 7.81113L16.6282 123.311C6.51004 128.895 0.469944 139.127 0.469944 150.682C0.469944 162.238 6.51004 172.47 16.6282 178.054L62.4489 203.344L16.6262 228.63C6.51004 234.21 0.467944 244.439 0.465943 255.993C0.462943 267.552 6.50304 277.789 16.6242 283.376L62.4399 308.665L16.6252 333.945C6.50904 339.535 0.469944 349.77 0.469944 361.325C0.469944 372.88 6.50904 383.116 16.6282 388.707L97.7445 433.479C98.8935 434.113 100.136 434.414 101.362 434.414C104.005 434.414 106.567 433.014 107.934 430.537C109.935 426.912 108.618 422.35 104.992 420.348L23.8783 375.578C18.6122 372.668 15.4672 367.34 15.4682 361.325C15.4682 355.31 18.6122 349.981 23.8753 347.073L77.9602 317.23L225.885 398.878C235.316 404.084 245.657 406.686 256.001 406.686C266.343 406.686 276.689 404.083 286.115 398.879L434.043 317.23L488.125 347.072C493.392 349.981 496.536 355.31 496.536 361.325C496.536 367.34 493.392 372.668 488.128 375.576L278.864 491.066C264.551 498.964 247.453 498.965 233.131 491.066L131.257 434.837C127.631 432.837 123.069 434.154 121.068 437.778C119.066 441.404 120.384 445.965 124.009 447.967L225.883 504.198C235.314 509.399 245.657 511.999 255.999 511.999C266.341 511.999 276.684 509.398 286.109 504.197L495.376 388.706C505.492 383.117 511.531 372.881 511.531 361.326C511.532 349.77 505.492 339.535 495.372 333.944V333.944ZM278.866 385.749C264.549 393.654 247.452 393.654 233.132 385.749L23.8723 270.247C18.6052 267.339 15.4622 262.012 15.4632 255.997C15.4642 249.986 18.6062 244.665 23.8703 241.762L77.9672 211.91L225.891 293.555C235.318 298.757 245.659 301.358 256 301.358C266.341 301.358 276.682 298.757 286.109 293.555L434.033 211.91L488.131 241.763C493.394 244.665 496.536 249.986 496.537 255.997C496.539 262.012 493.395 267.34 488.129 270.247L278.866 385.749Z"
                fill="black"
              />
            </svg>

            <!-- complexity -->
            <svg
              width="512"
              height="512"
              viewBox="0 0 512 512"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="[title + description]"
            >
              <path
                d="M180 472H40V332C40 320.954 31.046 312 20 312C8.954 312 0 320.954 0 332V492C0 503.046 8.954 512 20 512H180C191.046 512 200 503.046 200 492C200 480.954 191.046 472 180 472Z"
                fill="black"
              />
              <path
                d="M180 0H20C8.954 0 0 8.954 0 20V180C0 191.046 8.954 200 20 200C31.046 200 40 191.046 40 180V40H180C191.046 40 200 31.046 200 20C200 8.954 191.046 0 180 0Z"
                fill="black"
              />
              <path
                d="M492 312C480.954 312 472 320.954 472 332V472H332C320.954 472 312 480.954 312 492C312 503.046 320.954 512 332 512H492C503.046 512 512 503.046 512 492V332C512 320.954 503.046 312 492 312Z"
                fill="black"
              />
              <path
                d="M492 0H332C320.954 0 312 8.954 312 20C312 31.046 320.954 40 332 40H472V180C472 191.046 480.954 200 492 200C503.046 200 512 191.046 512 180V20C512 8.954 503.046 0 492 0Z"
                fill="black"
              />
            </svg>
          </div>
          <span id="empty-list" v-if="publicRooms.length == 0"
            >Нет открытых комнат</span
          >
          <div
            class="room-item"
            @click="joinRoom(item.key, $event)"
            v-for="item in roomsArray"
            v-bind:key="item.key"
          >
            <div class="room-name">{{ item.name }}</div>

            <div class="room-size">
              {{ item.players.length || 0 }}/{{ item.size }}
            </div>

            <div class="room-time">
              {{ item.minutes }}:{{ item.seconds == 0 ? "00" : item.seconds }}
            </div>
            <div class="room-complexity">
              {{ item.vocab == "0" ? "1" : item.vocab == "1" ? "2" : "3" }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="nextStep" @click="nextStep()">Выбрать комнату</div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

var ava1 = require("@/assets/img/avatars/male/1.svg"), // m
  ava2 = require("@/assets/img/avatars/male/2.svg"), // m
  ava3 = require("@/assets/img/avatars/male/3.svg"), // m
  ava4 = require("@/assets/img/avatars/male/4.svg"), // m
  ava5 = require("@/assets/img/avatars/male/5.svg"), // m
  ava6 = require("@/assets/img/avatars/male/6.svg"), // m
  ava7 = require("@/assets/img/avatars/male/7.svg"), // m
  ava8 = require("@/assets/img/avatars/1.svg"), // w
  ava9 = require("@/assets/img/avatars/2.svg"), // w
  ava10 = require("@/assets/img/avatars/3.svg"), // w
  ava11 = require("@/assets/img/avatars/4.svg"), // w
  ava12 = require("@/assets/img/avatars/5.svg"), // w
  ava13 = require("@/assets/img/avatars/6.svg"), // w
  ava14 = require("@/assets/img/avatars/7.svg"), // w
  ava15 = require("@/assets/img/avatars/8.svg"), // w
  names = {
    men: [
      "Арчибальд",
      "Фердинанд",
      "Викентий",
      "Иннокентий",
      "Акакий",
      "Лаврентий",
      "Ираклий",
      "Герасим",
      "Корнелий",
      "Святополк"
    ],
    women: [
      "Флоренция",
      "Долорес",
      "Земфира",
      "Рикарда",
      "Тея",
      "Русалина",
      "Устинья",
      "Лукерья",
      "Фелиция",
      "Цецилия",
      "Фаэль",
      "Раяна",
      "Арабелла",
      "Лея"
    ]
  };
export default {
  name: "Preparation",
  data: function() {
    return {
      rooms: [],
      visibility: ["visible", "invisible", "invisible"],
      block: 0,
      ava: Math.floor(Math.random() * Math.floor(14)),
      avatars: [
        ava1,
        ava2,
        ava3,
        ava4,
        ava5,
        ava6,
        ava7,
        ava8,
        ava9,
        ava10,
        ava11,
        ava12,
        ava13,
        ava14,
        ava15
      ],
      secretKey: ""
    };
  },
  mounted: function() {
    this.$store.dispatch("leaveRoom");
    this.$socket.emit("erase_rooms");
    if (this.getName == "") {
      var name =
        this.ava < 7
          ? names.men[Math.floor(Math.random() * Math.floor(names.men.length))]
          : names.women[
              Math.floor(Math.random() * Math.floor(names.women.length))
            ];
      this.$store.dispatch("updateName", name);
    }
    if (this.$store.getters.getAvatar == "") {
      this.$store.dispatch("updateAvatar", this.avatars[this.ava]);
    }
  },
  computed: {
    ...mapGetters([
      "publicRooms",
      "getName",
      "getSize",
      "getMinutes",
      "getSeconds",
      "getSecret",
      "getComplexity"
    ]),
    ...mapState(["user"]),
    roomsArray() {
      let roomsArray = [];
      for (let i = 0; i < this.publicRooms.length; i++) {
        const room = this.publicRooms[i];
        if (room.kicked.indexOf(this.getId) == -1) {
          roomsArray.push(room);
        }
      }
      return roomsArray;
    }
  },
  methods: {
    toast: function(text, type = "default", time = 3000) {
      this.$toast(`${text}`, {
        timeout: time,
        type: type, // default info success warning error
        position: "bottom-right"
      });
    },

    // when user has chosen a room, check it for access
    joinRoom: function(roomKey = null, event) {
      event.preventDefault();
      if (!this.$store.getters.getName) {
        this.toast(`Для начала представьтесь..`, "error");
        return;
      }

      var key = "";
      if (roomKey) {
        key = roomKey;
      } else {
        key = this.$store.getters.getSecret;
      }

      var User = {
        name: this.$store.getters.getName,
        avatar: this.$store.getters.getAvatar
      };

      // check for curent number of players
      this.$socket.emit(
        "request_room",
        { key: key.toUpperCase(), user: User },
        data => {
          if (!data.key) {
            this.toast(`${data}`, "error");
          } else {
            // this.toast(`Подключение к "${data.name}"!`, "success");
            this.$store.dispatch("joinRoom", data);
            this.$router.push("play");
          }
        }
      );
    },

    createRoom: function(event) {
      event.preventDefault();
      const room = this.$store.getters.getAll;
      this.$socket.emit("create_room", room, room => {
        if (room) {
          this.$store.dispatch("joinRoom", room);
          this.$router.push("play");
        } else {
          this.toast(`Назовите комнату`, "error");
        }
      });
    },

    // Show next avatar
    nextAva: function() {
      var img = document.getElementById("ava-img");
      img.style.transform = "rotateY(90deg)";
      setTimeout(() => {
        this.ava = (this.ava + 1) % this.avatars.length;
        this.$store.dispatch("updateAvatar", this.avatars[this.ava]);
        img.style.transform = "rotateY(180deg)";
      }, 300);
    },

    // Show previous avatar
    prevAva: function() {
      var img = document.getElementById("ava-img");
      img.style.transform = "rotateY(90deg)";
      setTimeout(() => {
        let len = this.avatars.length;
        this.ava = (((this.ava - 1) % len) + len) % len;
        this.$store.dispatch("updateAvatar", this.avatars[this.ava]);
        img.style.transform = "rotateY(180deg)";
      }, 300);
    },

    // Increase room size
    incSize: function() {
      this.$store.commit("incSize");
    },

    // Decrease room size
    decSize: function() {
      this.$store.commit("decSize");
    },

    // Increase room size
    incComplexity: function() {
      this.$store.commit("incComplexity");
    },

    // Decrease room size
    decComplexity: function() {
      this.$store.commit("decComplexity");
    },

    // Increase room minutes
    incMins: function() {
      this.$store.commit("incMinutes");
    },

    // Decrease room seconds
    decMins: function() {
      this.$store.commit("decMinutes");
    },

    // Increase room minutes
    incSecs: function() {
      this.$store.commit("incSeconds");
    },

    // Decrease room seconds
    decSecs: function() {
      this.$store.commit("decSeconds");
    },

    nextStep: function() {
      switch (this.block) {
        case 0:
          this.block = 2;
          this.visibility = ["invisible", "invisible", "visible"];
          document.getElementById("prevStep").innerText = "Персонаж";
          document.getElementById("nextStep").innerText = "Создать комнату";
          break;
        case 1:
          this.block = 0;
          this.visibility = ["visible", "invisible", "invisible"];
          document.getElementById("prevStep").innerText = "Создать комнату";
          document.getElementById("nextStep").innerText = "Выбрать комнау";
          break;
        case 2:
          this.block = 1;
          this.visibility = ["invisible", "visible", "invisible"];
          document.getElementById("prevStep").innerText = "Выбрать комнату";
          document.getElementById("nextStep").innerText = "Персонаж";
          break;
        default:
          break;
      }
    },

    prevStep: function() {
      switch (this.block) {
        case 0:
          this.block = 1;
          this.visibility = ["invisible", "visible", "invisible"];
          document.getElementById("prevStep").innerText = "Выбрать комнату";
          document.getElementById("nextStep").innerText = "Персонаж";
          break;
        case 1:
          this.block = 2;
          this.visibility = ["invisible", "invisible", "visible"];
          document.getElementById("prevStep").innerText = "Персонаж";
          document.getElementById("nextStep").innerText = "Создать комнату";
          break;
        case 2:
          this.block = 0;
          this.visibility = ["visible", "invisible", "invisible"];
          document.getElementById("prevStep").innerText = "Создать комнату";
          document.getElementById("nextStep").innerText = "Выбрать комнату";
          break;
        default:
          break;
      }
    }

    // checkLength: function(n) {
    //   if (this.secretKey.length > n) {
    //     this.secretKey = this.secretKey.substr(0, n);
    //   }
    // }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.arrow-right,
.arrow-left {
  height: 21px;
  width: 14px;

  &.small {
    height: 12px;
    width: 8px;
  }

  path {
    fill: var(--secondary-color);
    transition: all 0.3s ease;
  }

  &:hover path {
    fill: var(--text-color);
  }
}

.visible {
  opacity: 1;
  z-index: 1;
}

.invisible {
  z-index: -10;
  opacity: 0;
  overflow: hidden;
}

#preparation {
  width: 355px;
  margin: 0 auto;
  display: grid;
  grid-template-areas: "prev mid next";
  grid-template-columns: 50px 250px 50px;
  justify-content: center;
  align-items: center;
  height: 0;
  overflow: hidden;
  animation: fade-in-prep 1s ease forwards 4.4s;
  opacity: 0;
  transition: all 0.3s ease-out;
  font-family: "Montserat-Light", "Poppins", sans-serif;
}

#prevStep {
  text-align: center;
  grid-area: prev;
  transform: rotate(-90deg);
  font-size: 0.9em;
  cursor: pointer;
  justify-self: center;
  width: 200px;
  height: 1em;
  margin-right: -5px;
  color: var(--text-color);
  transition: all ease 0.3s;

  &:hover {
    color: var(--secondary-color);
  }
}

#nextStep {
  text-align: center;
  grid-area: next;
  transform: rotate(90deg);
  font-size: 0.9em;
  cursor: pointer;
  color: var(--text-color);
  transition: all ease 0.3s;
  width: 200px;
  height: 1.1em;
  margin-left: -5px;
  justify-self: center;
  &:hover {
    color: var(--secondary-color);
  }
}

#prep-window {
  text-align: center;
  grid-area: mid;
  width: 250px;
  height: 250px;
  position: relative;
}

.pre-block {
  position: absolute;
  display: flex;
  width: 100%;
  height: 100%;
  padding: 10px;
  background: var(--primary-color);
  backdrop-filter: blur(2px);
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  transition: all ease 0.5s;

  input[type="text"] {
    margin: 10px auto;
    width: 95%;
    text-align: center;
    background: transparent !important;
    font-family: "Montserat-Light", sans-serif;
    font-size: 1.2em;
    outline: none;
    border: 0;
    color: var(--text-color);

    &::placeholder {
      color: var(--secondary-color);
    }
  }
}

.block-title {
  font-size: 1.2em;
  margin: 5px 0;
  color: var(--text-color);
}

#user-info {
  width: 250px;
  flex-direction: column;

  #avatar-slider {
    width: 100%;
    height: auto;
    display: grid;
    grid-template-areas: ". . pre pre ava ava ava next next . .";

    #prev-ava {
      grid-area: pre;
      align-self: center;
      transition: all ease 0.2s;
      cursor: pointer;
      font-size: 2em;
      color: var(--secondary-color);

      &:hover {
        color: var(--text-color);
      }
    }

    #avatar {
      grid-area: ava;
      align-self: center;

      img {
        width: 60%;
        margin: 10px;
        transition: all 0.3s ease-out;
      }
    }

    #next-ava {
      grid-area: next;
      align-self: center;
      transition: all ease 0.2s;
      cursor: pointer;
      font-size: 2em;
      color: var(--secondary-color);

      &:hover {
        color: var(--text-color);
      }
    }
  }
}

// Creation of a new room
#create-room {
  // display: none;
  width: 250px;
  flex-direction: column;

  input[type="text"] {
    margin-top: 0;
  }

  #roommates {
    width: 80%;
    margin: 0 auto;
    height: auto;
    display: grid;
    align-items: flex-end;
    grid-template-areas:
      "dp np ip . dc nc ic"
      "rt rt rt . ct ct ct"
      "dm m  im . ds s  is"
      "mt mt mt . st st st";

    #rt {
      grid-area: rt;
      align-self: center;
      font-size: 0.8em;
      color: var(--text-color);
      margin-bottom: 20px;
    }
    #decrease-number {
      grid-area: dp;
      align-self: center;
      transition: all ease 0.2s;
      cursor: pointer;

      svg {
        margin-top: 5px;
      }
    }
    #roommates-number {
      grid-area: np;
      align-self: center;
      font-size: 1em;
      margin: 0 auto;
      padding: 0;
      color: var(--text-color);
      // line-height: 1em;
    }
    #increase-number {
      grid-area: ip;
      align-self: center;
      transition: all ease 0.2s;
      cursor: pointer;

      svg {
        margin-top: 5px;
      }
    }

    #ct {
      grid-area: ct;
      align-self: center;
      font-size: 0.8em;
      margin-bottom: 20px;
      color: var(--text-color);
    }
    #decrease-complexity {
      grid-area: dc;
      align-self: center;
      transition: all ease 0.2s;
      cursor: pointer;

      svg {
        margin-top: 5px;
      }
    }
    #complexity-number {
      grid-area: nc;
      align-self: center;
      font-size: 1em;
      margin: 0 auto;
      padding: 0;
      color: var(--text-color);
      // line-height: 1em;
    }
    #increase-complexity {
      grid-area: ic;
      align-self: center;
      transition: all ease 0.2s;
      cursor: pointer;

      svg {
        margin-top: 5px;
      }
    }
  }

  // #room-time {
  // display: grid;
  // grid-template-areas:
  //   "dm m  im  . ds s  is"
  //   "mt mt mt  . st st st";
  // width: 90%;
  // margin: 15px auto;
  // align-content: center;
  // height: auto;
  // margin-top: 5px;

  #decMins {
    grid-area: dm;
    align-self: center;
    transition: all ease 0.2s;
    cursor: pointer;
  }

  #mins {
    grid-area: m;
    width: 20px;
    margin: 0 auto;
    align-self: center;
  }

  #incMins {
    grid-area: im;
    align-self: center;
    transition: all ease 0.2s;
    cursor: pointer;
  }

  #clock-img {
    line-height: 1em;
    grid-area: i;
    align-self: center;
  }

  #decSecs {
    grid-area: ds;
    align-self: center;
    transition: all ease 0.2s;
    cursor: pointer;
  }

  #secs {
    grid-area: s;
    align-self: center;
    margin: 0 auto;
    width: 20px;
    // font-size: 1.1em;
    // line-height: 1em;
  }

  #incSecs {
    grid-area: is;
    align-self: center;
    transition: all ease 0.2s;
    cursor: pointer;
  }

  #mt {
    grid-area: mt;
    align-self: center;
    font-size: 0.8em;
    margin-bottom: 20px;
    color: var(--text-color);
  }

  #st {
    grid-area: st;
    align-self: center;
    font-size: 0.8em;
    margin-bottom: 20px;
    color: var(--text-color);
  }
  // }

  #create {
    width: 70%;
    margin: 10px auto;
    font-size: 1em;
    color: var(--light);
    cursor: pointer;
    border: 0;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0);
    padding: 5px 0;
    background: var(--blue);
    border-radius: 5px;
    transition: all 0.3s ease;
    outline: none;
    font-family: "Montserat-Light", "Ralevay", "Poppins", sans-serif;

    &:hover {
      background: var(--green);
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
      color: var(--light);
    }
  }
}

// Choosing existing room
#choose-room {
  width: 250px;
  flex-direction: column;

  #private-game {
    align-items: center;
    width: 95%;
    display: flex;
    justify-content: center;
    position: relative;
    align-items: center;

    input#room-key {
      width: 100px;
      margin: 0 0 10px 0;
      text-transform: uppercase;
      font-size: 1.1em;
    }

    #private-play {
      cursor: pointer;
      background: transparent;
      outline: none;
      height: auto;
      padding: 0;
      margin: 0;
      transform: translate(0, -25%);
      border: 0;
      // display: flex;
      // justify-content: center;
      // align-items:center;

      svg {
        fill: var(--secondary-color);
        transition: all ease 0.3s;
      }

      &:hover {
        // animation: arrow-anim 0.7s ease;

        svg path {
          fill: var(--text-color);
        }
      }
    }
  }

  #rooms-list-head {
    width: 100%;
    display: grid;
    grid-template-areas: "name size time complexity";
    grid-template-columns: 135px 30px 30px 30px;
    position: sticky;
    // justify-content: center;
    top: 0;
    backdrop-filter: blur(1px);
    background: var(--background-color);
    padding: 5px;
    line-height: 14px;
    font-size: 14px;

    svg {
      height: 12px;
      width: 12px;
      align-self: center;
      justify-self: center;
      // margin: 0 5px;

      &:nth-child(1) {
        grid-area: size;
      }

      &:nth-child(2) {
        grid-area: time;
      }

      &:nth-child(3) {
        grid-area: complexity;
      }

      path {
        fill: var(--text-color);
      }
    }

    span {
      grid-area: name;
      width: 125px;
      text-align: left;
      // border: 1px solid white;
      // margin:0 5px;
    }
  }

  #empty-list {
    display: flex;
    color: var(--secondary-color);
    justify-content: center;
    height: 160px;
    align-items: center;
    font-size: 0.8em;
  }

  #rooms-list {
    position: relative;
    width: 100%;
    overflow: auto;
    height: 200px;
    font-size: 0.9em;
    background: var(--background-color);
    box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
    border-radius: 5px;

    .room-item {
      display: grid;
      grid-template-areas: "name size time complexity";
      grid-template-columns: 135px 30px 30px 30px;
      transition: all ease 0.3s;
      padding: 0 5px;
      cursor: pointer;
      font-size: 12px;
      line-height: 20px;
      height: 18px;

      &:hover {
        background: rgba(0, 0, 0, 0.01);
        background: var(--primary-color);
        box-shadow: 0 0 5px rgba(30, 30, 30, 0.1);
      }

      .room-size {
        grid-area: size;
      }

      .room-name {
        grid-area: name;
        text-align: left;
        overflow: hidden;
      }

      .room-time {
        grid-area: time;
      }
      .room-complexity {
        grid-area: complexity;
      }
    }
  }
}
</style>
