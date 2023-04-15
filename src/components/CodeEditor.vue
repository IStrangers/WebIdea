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
      <div class="Cursor" :style="cursorStyle"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { reactive } from 'vue';
import { Options, Vue } from 'vue-class-component';

@Options({
  components: {
  },
})
export default class CodeEditor extends Vue {

  cursorStyle: any = {
    position: "absolute",
    left: "0px",
    top: "0px"
  }

  codeLines: any = []
  currentLine: any

  created(){
    const currentLine = this.createNewLine()
    this.codeLines.push(currentLine)
  }

  createNewLine() {
    this.currentLine = reactive({
        tokens:[]
    })
    return this.currentLine
  }

  codeLineContainerClick(event: any){
    const offsetX = event.offsetX
    const offsetY = event.offsetY
    this.cursorStyle.left = offsetX + "px"
    this.cursorStyle.top = offsetY + "px"
  }

  codeLineContainerKeyDown(event: any){
    debugger
    if(event.key === "Enter"){
      const currentLine = this.createNewLine()
      this.codeLines.push(currentLine)
    } else if(event.key === "Backspace") {
      this.currentLine.tokens.splice(this.currentLine.tokens.length - 1,1)
    } else {
      const data = event.data
      this.currentLine.tokens.push({
        type: "error",
        value: data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@keyframes cursor {
  0% { opacity: 0; }
  50% { opacity: 0; }
  100% { opacity: 1; }
}

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
    width: 35px;
    min-width: 35px;
    border-right: 1px solid rgba(133, 133, 133,.3);

    .Code-Line-Number{
      color: rgb(133,133,133);
      text-align: center;
      height: 20px;
      line-height: 20px;
    }
  }

  .Code-Line-Container{
    cursor: text;
    height: 100%;
    width: calc(100% - 55px);
    position: relative;

    .Code-Line {
      height: 20px;
      line-height: 20px;
      padding: 0 5px;

      span {
        color: rgb(133, 133, 133);
        &.error {
          color: red;
        }
      }
    }

    .Cursor {
      width: 2px;
      height: 20px;
      background-color: rgb(133, 133, 133);
      display: inline-block;
      animation: cursor 1s ease infinite;
    }
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
}
</style>