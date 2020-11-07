<template>
  <div class="t-container">
    <span>Исключить игрока {{ name }} из комнаты? </span>
    <button class="action" @click.stop="clicked">Да</button>
  </div>
</template>
<script>
export default {
  name: "KickPromptVue",
  props: ["name"],
  methods: {
    clicked() {
      // Emit a "click" event when clicked.
      // Can be any event though and even pass parameters back
      this.$emit("click");
    }
  }
};
</script>
<style lang="scss">
.t-container {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: "Raleway-Medium", "Poppins", sans-serif;
}
.action {
  height: 30px;
  padding: 0 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-left: 20px;
  border-radius: 5px;
  background: transparent;
  color: var(--light);
  cursor: pointer;
  border: 2px solid currentColor;
  font-family: "Raleway-Medium", "Poppins", sans-serif;
  transition: all 0.3s ease;

  &:hover {
    background: var(--light);
    color: #1976d2;
  }
}
</style>
