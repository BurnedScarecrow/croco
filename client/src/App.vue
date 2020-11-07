<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  data() {
    return {
      toggleSwitch: null
    };
  },
};
</script>

<style lang="scss">
@import url(assets/animations.css);
@import url(assets/fonts.css);

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --background-color: #ecf0f1; // #ededed;
  --primary-color: #fafafa; // #dbdbdb;
  --secondary-color: #7f8c8d;
  --text-color: #2c3e50; //#444;
  --light: #fafafa;
  --green: #27ae60; //#4a4;
  --blue: #2980b9; //#77f;
  --red: #e74c3c; //#e33;
  --purple: #9b59b6; //#e0e;
  --light-blue: #3498db; //#0bb;
  --yellow: #f1c40f; //#bb0;
  --orange: #e67e22; //#f63;
  --pink: #F48FB1;
  --warn: #e74c3c;
}

[data-theme="dark"] {
  --background-color: #2c3e50; //333
  --primary-color: #34495e; //555
  --secondary-color: #95a5a6; //ccc
  --text-color: #ecf0f1;
  --warn: #e67e22;
}

body {
  // background: linear-gradient(135deg, #86fde8, #acb6e5);
  // background-image: linear-gradient(155deg,  #434343 0%, #212121 100%);
  // background-image: linear-gradient(135deg, #92fe9d 0%, #00c9ff 100%);
  // background-image: linear-gradient(135deg, #29323c 0%, #485563 100%);
  background-size: cover;
  background-repeat: no-repeat;
}

#app {
  min-height: 100vh;
  transition: all 1s ease;
  background: var(--background-color);
  font-family: "Montserat-Light", "Poppins", "Raleway", sans-serif;
  color: var(--text-color);
  transition: all 0.5s ease;
  padding-bottom: 30px;
}

::-webkit-scrollbar {
  width: 3px;
}

::-webkit-scrollbar-track {
  background: var(--background-color);
}

::-webkit-scrollbar-thumb {
  background-color: var(--secondary-color);
  outline: none;
}
</style>
