<template>
  <div id="game-stage">
    <div id="stage-message">
      Игроки: {{ getRoomPlayers.length }} из {{ getRoomSize }}
    </div>
    <div id="stage">Ожидание</div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "GaneStage",
  computed: {
    ...mapGetters(["getRoomSize", "getRoomPlayers"])
  }
};
</script>

<style>
#game-stage {
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
  margin: 0 auto;
  width: 320px;
}
</style>
