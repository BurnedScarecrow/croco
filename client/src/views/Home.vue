<template>
  <div class="home">
    <Logo />
    <div id="first-nav">
      <div class="first-nav-button" @click="showRules()" id="rules-button">
        Как играть
      </div>
      <!-- <div class="first-nav-button" @click="showRules()" id="donate-button">Поддержать</div> -->
    </div>
    <Preparation />
    <Footer />
    <Rules />

  </div>
</template>

<script>
// @ is an alias to /src
import Logo from "@/components/Logo.vue";
import Preparation from "@/components/Preparation.vue";
import Footer from "@/components/Footer.vue";
import Rules from "@/components/Rules.vue";

export default {
  name: "Home",
  data: function() {
    return {
      // show_class: "vis"
    };
  },
  components: {
    Logo,
    Preparation,
    Footer,
    Rules
  },
  mounted() {
    this.detectColorScheme();
  },
  methods: {
    showRules: function() {
      let rules = document.getElementById("rules");
      if (rules.style.opacity == 0) {
        rules.style.top = "25vh";
        rules.style.opacity = 1;
        rules.style.height = "50vh";
      } else {
        rules.style.top = "100vh";
        rules.style.height = "0vh";
        rules.style.opacity = 0;
      }
    },
    showSupport: function() {},
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
    }
  }
};
</script>

<style lang="scss">
#first-nav {
  display: flex;
  justify-content: center;
  width: 100%;
  overflow: hidden;
  height: 0;
  animation: fade-in-rules-button 1s ease-in-out forwards 4.8s;

  .first-nav-button {
    margin: 0 20px;
    font-size: 1.1em;
    padding: 2px 10px;
    background: rgba(255, 255, 255, 0.5);
    background: var(--primary-color);
    padding: 5px 10px;
    backdrop-filter: blur(2px);
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    font-family: "Raleway", sans-serif;
    transition: all 0.3s ease;
    color: var(--text-color);

    &#rules-button {
      &:hover {
        background: var(--blue);
        color: var(--light);
      }
    }

    &#donate-button {
      &:hover {
        color: var(--light);
        background: var(--green);
      }
    }
  }
}
</style>
