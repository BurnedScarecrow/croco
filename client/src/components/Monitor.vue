<template>
  <div class="draw-place">
    <div id="game-info">
      <span id="state"
        >{{ getPainterName }} {{ getWord ? "рисует" : "выбирает слово" }}</span
      >
      <span id="time">
        <span id="minutes">{{ Math.floor(getRoomRestTime / 60) }}</span>
        :
        <span id="seconds">{{
          getRoomRestTime % 60 > 9
            ? getRoomRestTime % 60
            : "0" + (getRoomRestTime % 60)
        }}</span>
      </span>
    </div>
    <canvas id="monitor"> </canvas>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Monitor",
  props: ["id"],
  data() {
    return {
      monitor: null,
      mon_ctx: null,
      image_data: new Image()
    };
  },
  computed: {
    ...mapGetters([
      "getRoomRestTime",
      "getRoomImage",
      "getWord",
      "getPainterName",
      "getPainter"
    ])
  },
  watch: {
    getPainter() {
      this.image_data = new Image();
    }
  },
  mounted: function() {
    this.image_data = new Image();
    window.requestAnimFrame = (function() {
      return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(/* function */ callback) {
          window.setTimeout(callback, 1000 / 60);
        }
      );
    })();
    this.monitor = document.getElementById("monitor");
    this.mon_ctx = this.monitor.getContext("2d");

    this.monitor.width = 320;
    this.monitor.height = 320;

    this.monitorLoop();
  },
  sockets: {
    update_room(room) {
      this.$store.commit("updateRoom", room);
      this.image_data.src = this.getRoomImage.src;
    }
  },
  methods: {
    monitorLoop: function() {
      this.mon_ctx.drawImage(this.image_data, 0, 0);
      window.requestAnimFrame(this.monitorLoop);
    }
  }
};
</script>

<style lang="scss">
#monitor {
  display: block;
  margin: 0 auto;
  background: #fff;
}
#game-info {
  width: 320px;
  padding: 2px 7px;
  border-radius: 4px 4px 0 0;
  background: var(--primary-color);
  display: flex;
  justify-content: space-between;
  align-self: center;
  align-items: center;
  user-select: none;
  font-family: "Poppins-Light", "Raleway", sans-serif;
  font-size: 1.1em;

  #state {
    font-size: 0.8em;
  }
}
</style>
