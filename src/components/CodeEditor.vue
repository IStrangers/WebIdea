<template>
  <div class="Code-Editor">
    <div class="Code-Line-Number-Container">
      <div class="Code-Line-Number">

      </div>
    </div>
    <div class="Code-Line-Container" @click="codeLineContainerClick">
      <div class="Code-Line">

      </div>
      <textarea ref="codeInput" class="Code-Input" :style="codeInputStyle" @input="codeInput"></textarea>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
  components: {
  },
})
export default class CodeEditor extends Vue {

  codeInputStyle = {
    left:"0px",
    top:"0px"
  }

  declare $refs : {
    codeInput: HTMLInputElement
  }

  codeLineContainerClick(event:PointerEvent){
    const offsetX = event.offsetX
    const offsetY = event.offsetY
    this.codeInputStyle.left = offsetX + "px"
    this.codeInputStyle.top = offsetY + "px"
    this.$refs.codeInput.focus()
  }

  codeInput(event:Event){
    debugger
  }

}
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
    display: inline-block;

    .Code-Line-Number{
      
    }
  }

  .Code-Line-Container{
    height: 100%;
    width: calc(100% - 55px);
    border: 1px solid;
    display: inline-block;
    position: relative;
  }

  .Code-Input{
    position: absolute;
    //border: none;
    outline: none;
    resize: none;
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