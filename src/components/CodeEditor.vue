<template>
  <div class="Code-Editor">
    <div class="Code-Line-Number-Container">
      <div class="Code-Line-Number">

      </div>
    </div>
    <div class="Code-Line-Container">
      <div class="Code-Line">

      </div>
    </div>
    <textarea class="Code-Input"></textarea>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
  components: {
  },
})
export default class CodeEditor extends Vue {}
</script>

<style lang="scss" scoped>
.Code-Editor {
  width: 100%;
  height: 100%;
  border-radius: 4px;
  cursor: text;

  .Code-Line-Number-Container{
    height: 100%;
    width: 50px;
    min-width: 50px;
    border: 1px solid;

    .Code-Line-Number{

    }
  }


  .Code-Input::after {
    content:'';
    display: block;
    width:1px;
    height:16px;
    animation: blink 1s infinite steps(1, start)
  }

  @keyframes blink {
    0%{
      background-color: white;
    }
    50% {
      background-color: black;
    }
    100% {
      background-color: white;
    }
  }
}
</style>