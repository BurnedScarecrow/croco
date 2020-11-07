<template>
  <div id="result-container">
    <div class="card" v-if="uid == winner">
      <img src="@/assets/img/congrats.svg" alt="" />
      <div class="card-text">
        <div>Поздравляем!</div>
        <div>Вы отгадали слово</div>
      </div>
    </div>
    <div class="card" v-else-if="!winner">
      <img src="@/assets/img/time-out.svg" alt="" />
      <div class="card-text">
        <div>Время кончилось</div>
        <div>Никто не отгадал слово "{{ word }}"</div>
      </div>
    </div>
    <div class="card" v-else>
      <img :src="winner_avatar" style="width:100px;" :alt="winner_name" />
      <div class="card-text">
        <div>{{ winner_name }}</div>
        <div>отгадал(а) слово "{{ word }}"</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "ResultCard",
  data() {
    return {
      // won:false,
      // lost:true,
    };
  },
  calculated: {
    ...mapGetters(["getId", "getPainter"])
  },
  props: ["uid", "word", "winner", "painter", "winner_name", "winner_avatar"]
};
</script>

<style lang="scss">
#result-container {
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  width: 100%;
  height: 100vh;
  z-index: 99;
  background: rgba(0, 0, 0, 0.4);

  .card {
    display: flex;
    margin: 0 auto;
    width: 300px;
    // height: 300px;
    background: var(--background-color);
    border-radius: 4px;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    padding: 20px 20px;

    img {
      margin-bottom: 20px;
    }

    .card-text {
      text-align: center;
      color: var(--secondary-color);

      div:first-child {
        color: var(--text-color);
        font-size: 1.5em;
      }
    }
  }
}
</style>
