<template>
  <div class="Code-Editor">
    <div class="Code-Line-Number-Container">
      <div class="Code-Line-Number" v-for="(codeLine,index) in codeLines" :key="index">
        {{index + 1}}
      </div>
    </div>
    <div class="Code-Line-Container" @click="codeLineContainerClick" @keydown="codeLineContainerKeyDown">
      <div class="Code-Line" v-for="(codeLine,index) in codeLines" :key="index">
        <span v-for="(token,index) in codeLine.tokens" :key="index" :class="token.type">
          {{token.value}}
        </span>
      </div>
      <textarea class="Code-Input" :style="codeInputStyle" @input="codeInput"></textarea>
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

  codeLines: any = []

  created(){
    this.codeLines.push({type:"error",value:""})
  }

  codeLineContainerClick(event:PointerEvent){
    const offsetX = event.offsetX
    const offsetY = event.offsetY
    this.codeInputStyle.left = offsetX + "px"
    this.codeInputStyle.top = offsetY + "px"
  }

  codeLineContainerKeyDown(event:KeyboardEvent){
    if(event.key == "Enter"){
      this.codeLines.push({type:"error",value:""})
    }
  }

  codeInput(event:Event){
    console.log(event)
  }

}
</script>

<style lang="scss" scoped>
.Code-Editor {
  width: 100%;
  height: 100%;
  border-radius: 4px;
  background-color: rgb(30,30,30);
  font-size: 14px;
  display: flex;
  overflow: auto;

  .Code-Line-Number-Container{
    height: 100%;
    width: 50px;
    min-width: 50px;

    .Code-Line-Number{
      color: rgb(133,133,133);
      text-align: center;
    }
  }

  .Code-Line-Container{
    cursor: text;
    height: 100%;
    width: calc(100% - 55px);
    position: relative;
  }

  .Code-Input{
    position: absolute;
    height: 20px;
    width: 1px;
    border: none;
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