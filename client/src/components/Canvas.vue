<template>
  <div class="draw-place">
    <div id="game-info" v-show="getWord">
      <span id="time">
        <span id="minutes">{{ Math.floor(getRoomRestTime / 60) }}</span>
        :
        <span id="minutes">{{
          getRoomRestTime % 60 > 9
            ? getRoomRestTime % 60
            : "0" + (getRoomRestTime % 60)
        }}</span>
      </span>
      <span v-if="getPainter == getId">
        {{ getWord }}
      </span>
    </div>
    <canvas id="drawable" v-show="getWord"></canvas>
    <div id="pallete" v-show="getWord">
      <div id="color-picker-wrapper">
        <div class="col"></div>
        <input type="color" id="color-picker" class="color" />
      </div>
      <div id="size-picker-wrapper">
        <input
          type="range"
          id="size-picker"
          min="2"
          max="50"
          step="1"
          value="10"
        />
        <span style="font-size:.9em;">{{ size }} px</span>
        <!-- <div id="size-picker-sample"></div> -->
      </div>
      <div id="clear-button">
        <svg
          width="22"
          height="24"
          viewBox="0 0 22 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M8 3H14V1.25C14 1.184 13.974 1.12 13.927 1.073C13.88 1.026 13.816 1 13.75 1H8.25C8.184 1 8.12 1.026 8.073 1.073C8.026 1.12 8 1.184 8 1.25V3ZM19 4H3V22C3 22.552 3.448 23 4 23H18C18.552 23 19 22.552 19 22V4ZM9 7.5C9 7.224 8.776 7 8.5 7C8.224 7 8 7.224 8 7.5V19.5C8 19.776 8.224 20 8.5 20C8.776 20 9 19.776 9 19.5V7.5ZM14 7.5C14 7.224 13.776 7 13.5 7C13.224 7 13 7.224 13 7.5V19.5C13 19.776 13.224 20 13.5 20C13.776 20 14 19.776 14 19.5V7.5ZM22 3V4H20V22C20 23.105 19.105 24 18 24H4C2.895 24 2 23.105 2 22V4H0V3H7V1C7 0.448 7.448 0 8 0H14C14.552 0 15 0.448 15 1V3H22Z"
            fill="white"
          />
        </svg>
      </div>
    </div>
    <div class="words" v-if="!getWord">
      <h2>Вы - художник!</h2>
      <h4>Выберите слово ({{ timer }})</h4>
      <div id="w3" @click="chooseWord(words[2])">{{ words[2] }}</div>
      <div id="w2" @click="chooseWord(words[1])">{{ words[1] }}</div>
      <div id="w1" @click="chooseWord(words[0])">{{ words[0] }}</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Canvas",
  props: ["words", "timer", "timer_id"],
  data() {
    return {
      monitor: null,
      mon_ctx: null,
      canvas: null,
      ctx: null,
      color: "#000",
      size: 10,
      elem: null,
      drawing: false,
      mousePos: { x: 0, y: 0 },
      lastpos: { x: 0, y: 0 },
      initialHeight: 0,
      initialWidth: 0,
      size_picker: null,
      size_picker_sample: null,
      color_picker: null,
      brush: null,
      clear_button: null,
      image_data: new Image()
    };
  },
  computed: {
    ...mapGetters([
      "getRoomRestTime",
      "getPainter",
      "getId",
      "getWord",
      "getJoined"
    ])
  },
  watch: {
    getPainter() {
      this.image_data = new Image();
    }
  },
  mounted() {
    var CONTEXT = this;

    this.size_picker = document.getElementById("size-picker");
    this.size_picker_sample = document.getElementById("size-picker-sample");
    this.color_picker = document.getElementById("color-picker");
    this.brush = document.getElementsByClassName("col");
    this.clear_button = document.getElementById("clear-button");

    // Initialize canvas
    this.canvas = document.getElementById("drawable");
    this.elem =
      document.compatMode === "CSS1Compat"
        ? document.documentElement
        : document.body;

    this.canvas.width = 320;
    this.canvas.height = 320;

    this.ctx = this.canvas.getContext("2d");

    // Prevent scrolling when touching the canvas
    this.canvas.addEventListener(
      "mousedown",
      function(e) {
        CONTEXT.drawing = true;
        CONTEXT.lastPos = CONTEXT.getMousePos(CONTEXT.canvas, e);
      },
      false
    );
    this.canvas.addEventListener(
      "mouseup",
      function() {
        CONTEXT.drawing = false;
      },
      false
    );
    this.canvas.addEventListener(
      "mousemove",
      function(e) {
        CONTEXT.mousePos = CONTEXT.getMousePos(CONTEXT.canvas, e);
      },
      false
    );

    // Get a regular interval for drawing to the screen
    window.requestAnimFrame = (function() {
      if (CONTEXT.getPainter == CONTEXT.getId) {
        return (
          window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          window.oRequestAnimationFrame ||
          window.msRequestAnimaitonFrame ||
          function(callback) {
            window.setTimeout(callback, 1000 / 60);
          }
        );
      } else {
        return false;
      }
    })();

    // Set up touch events for mobile, etc
    this.canvas.addEventListener(
      "touchstart",
      function(e) {
        CONTEXT.mousePos = getTouchPos(CONTEXT.canvas, e);
        var touch = e.touches[0];
        var mouseEvent = new MouseEvent("mousedown", {
          clientX: touch.clientX,
          clientY: touch.clientY
        });
        CONTEXT.canvas.dispatchEvent(mouseEvent);
      },
      false
    );
    this.canvas.addEventListener(
      "touchend",
      function() {
        var mouseEvent = new MouseEvent("mouseup", {});
        CONTEXT.canvas.dispatchEvent(mouseEvent);
      },
      false
    );
    this.canvas.addEventListener(
      "touchmove",
      function(e) {
        var touch = e.touches[0];
        var mouseEvent = new MouseEvent("mousemove", {
          clientX: touch.clientX,
          clientY: touch.clientY
        });
        CONTEXT.canvas.dispatchEvent(mouseEvent);
      },
      false
    );

    // Get the position of a touch relative to the canvas
    function getTouchPos(canvasDom, touchEvent) {
      var rect = canvasDom.getBoundingClientRect();
      return {
        x: touchEvent.touches[0].clientX - rect.left,
        y: touchEvent.touches[0].clientY - rect.top
      };
    }

    this.drawLoop();

    this.size_picker.oninput = function() {
      CONTEXT.size = CONTEXT.size_picker.value;
    };

    this.brush.forEach(element => {
      element.style.background = this.color_picker.value;
    });

    this.color_picker.oninput = function() {
      CONTEXT.color = CONTEXT.color_picker.value;
      CONTEXT.brush.forEach(element => {
        element.style.background = CONTEXT.color_picker.value;
      });
    };

    this.clear_button.onclick = function() {
      CONTEXT.ctx.fillStyle = "white";
      CONTEXT.ctx.fillRect(0, 0, 320, 320);
    };
  },
  methods: {
    // Get the position of the mouse relative to the canvas
    getMousePos: function(canvasDom, mouseEvent) {
      var rect = canvasDom.getBoundingClientRect();
      return {
        x: mouseEvent.clientX - rect.left,
        y: mouseEvent.clientY - rect.top
      };
    },

    // Draw to the canvas
    renderCanvas: function() {
      if (this.drawing) {
        this.ctx.beginPath(); // begin
        this.ctx.lineWidth = this.size;
        this.ctx.lineCap = "round";
        this.ctx.strokeStyle = this.color;
        this.ctx.moveTo(this.lastPos.x, this.lastPos.y); // from
        this.ctx.lineTo(this.mousePos.x, this.mousePos.y); // to
        this.lastPos = this.mousePos;
        this.ctx.stroke();
      }
    },

    // Allow for animation
    drawLoop: function() {
      if (this.getPainter == this.getId) {
        // console.log(`draw ${this.getId}`)
        this.image_data = this.canvas.toDataURL();
        let res = window.requestAnimFrame(this.drawLoop);
        if (!res) {
          return;
        }
        this.renderCanvas();
        this.$socket.emit("draw", this.image_data, this.getJoined, data => {
          if (data == 1) {
            // console.log(`callback for ${this.getId} == 1`)
            this.ctx.fillStyle = "white";
            this.ctx.fillRect(0, 0, 320, 320);
            return;
          }
        });
      } else {
        this.clearImage();
        // console.log(`draw ${this.getId}`)
        return;
      }
    },

    clearImage: function() {
      this.ctx.fillStyle = "white";
      this.ctx.fillRect(0, 0, 320, 320);
      this.image_data = this.canvas.toDataURL();
      this.$socket.emit("draw", this.image_data, this.getJoined, data => {
        if (data == 1) {
          // console.log(`callback 2 for ${this.getId} == 1`)
          this.ctx.fillStyle = "white";
          this.ctx.fillRect(0, 0, 320, 320);
          return;
        }
      });
    },

    chooseWord: function(word) {
      this.$parent.clearTimer();
      this.$socket.emit("choose_word", word, this.getJoined);
    }
  }
};
</script>

<style lang="scss">
.words {
  width: 90%;
  margin: 0 auto;
  background: var(--primary-color);
  padding: 5px;
  font-family: "Poppins-Light", "Raleway-Light", sans-serif;
  text-align: center;

  div {
    display: inline-block;
    padding: 5px 10px;
    margin: 5px 10px;
    border-radius: 4px;
    color: var(--light);
    background: var(--light-blue);
    transition: all 0.3s ease;
    cursor: pointer;
    font: 1.1em "Raleway-Medium", "Poppins", sans-serif;

    &:hover {
      background: var(--blue);
    }
  }
}

.draw-place {
  grid-area: canvas;
  width: 100%;
  justify-content: center;
}

#game-info {
  width: 320px;
  margin: 0 auto;
  padding: 2px 5px;
  border-radius: 4px 4px 0 0;
  background: var(--primary-color);
  display: flex;
  justify-content: space-around;
  align-self: center;
  user-select: none;
  font-family: "Poppins-Light", "Raleway", sans-serif;
  font-size: 1.1em;
}

#drawable {
  display: block;
  width: 320px;
  border-radius: 4px 4px 0 0;
  background: #fff;
  cursor: crosshair;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin: 0px auto;
}

#pallete {
  display: flex;
  margin: 0 auto;
  border-radius: 0 0 4px 4px;
  width: 320px;
  height: 40px;
  padding: 0 7px;
  flex-direction: row;
  justify-content: space-between;
  background: var(--primary-color);
  align-items: center;
  text-align: center;
  background-size: cover;
  font-family: "Poppins", sans-serif;
  color: #fefefe;
}

/** COLOR PICKER **/
#pallete #color-picker-wrapper {
  display: block;
  width: 25px;
  position: relative;

  .col {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .color {
    opacity: 0;
    width: 25px;
    height: 25px;
    cursor: pointer;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
  }
}

/** SIZE PICKER **/
#pallete #size-picker-wrapper {
  display: grid;
  grid-template-columns: 110px 40px;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  width: 150px;
  // z-index: 2;
}

#pallete #size-picker {
  appearance: slider;
  width: 100px;
  height: 10px;
  cursor: pointer;
}

#pallete #clear-button svg {
  width: 25px;
  height: 25px;
  text-align: center;
  cursor: pointer;
  top: 3px;
  position: relative;

  &:hover {
    path {
      fill: var(--secondary-color);
    }
  }
}
#pallete #clear-button path {
  transition: all ease-out 0.3s;
  fill: var(--text-color);
}

@media screen and (min-width: 600px) and (max-width: 1024px) {
  .draw-place {
    grid-column: 1 / 3;
  }
}
</style>
