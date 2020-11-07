<template>
  <div id="rules">
    <div id="rules-top">
      <span>Правила</span>
      <svg
        class="hide-rules"
        @click="hideRules()"
        width="23"
        height="1"
        viewBox="0 0 23 1"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M0 0V1H23V0H0Z"
          fill="none"
          stroke-width="0.5px"
        />
      </svg>
    </div>
    <div id="scrollable">
      <h4>Художник</h4>
      <p>
        Постарайтесь за ограниченное время приложить все имеющиеся
        художественные навыки, чтобы объяснить зрителям одно из предложенных
        слов, используя лишь кисть и краси. Если никто не угадает слово, ход
        перейдет случайному игроку.
      </p>
      <br />
      <h4>Зритель</h4>
      <p>
        Ваша задача - как можно быстрее угадать слово, которое объясняет
        художник. Первый игрок, написавший верное слово в общий чат, становится
        новым художником.
      </p>
      <br />
      <h4>Ход игры</h4>
      <p>
        Когда в комнате соберется несколько игроков, хост (создатель комнаты)
        может начать игру. Во время игры участники могут присоединяться или
        ухойти из коматы. Если в комнате останется 1 игрок или когда комнату
        покинет художник, игра будет приостановлена.
      </p>
      <br />
      <h4>Частная комната</h4>
      <p>
        По умолчанию все комнаты открыты для всех и видны в общем списке.
        Однако, если вы хотите поиграть только с друзьями, сделайте комнату
        приватной, и сообщите им ключ для входа. Комната пропадет из общего
        списка и будет доступна только тем, кто знает ключ.
      </p>
      <br />
      <h4>
        Исключение игроков
      </h4>
      <p>
        Если кто-то из игроков мешает игровому процессу, хост может его
        исключить из комнаты, не прерывая игру.
      </p>
      <br />
      Приятной игры!
      <br /><br />
    </div>
  </div>
</template>

<script>
export default {
  name: "Rules",
  methods: {
    hideRules: function() {
      let rules = document.getElementById("rules");
      rules.style.top = "100vh";
      rules.style.height = "0vh";
      rules.style.opacity = 0;
    }
  }
};
</script>

<style lang="scss">
#rules {
  opacity: 1;
  position: absolute;
  overflow: hidden;
  width: 300px;
  height: 0;
  border-radius: 5px;
  top: 100vh;
  left: 50%;
  transform: translate(-50%, 0);
  background: var(--primary-color);
  color: var(--text-color);
  transition: all 0.3s ease;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

  #rules-top {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    line-height: 1.2em;
    font-size: 1.2em;

    .hide-rules {
      cursor: pointer;
      height:20px;
      width: 20px;

      path{
      transition: all 0.3s ease;
        fill: var(--secondary-color);
        stroke: var(--secondary-color);
      }

      &:hover path {
        fill: var(--red);
        stroke: var(--red);
      }
    }
  }

  #scrollable {
    // margin-top:5px;
    width: 100%;
    height: 90%;
    overflow: auto;
    padding: 10px;

    h4 {
      text-align: left;
      margin: 5px 0;
    }

    p {
      text-align: justify;
      font-size: 0.95em;
    }
  }
}
</style>
