<template>
  <div class="Code-Editor">
    <div class="Code-Line-Number-Container">
      <div class="Code-Line-Number" v-for="(codeLine,index) in codeLines" :key="index">
        {{index + 1}}
      </div>
    </div>
    <div class="Code-Line-Container" @click="codeLineContainerClick" @keydown="codeLineContainerKeyDown">
      <div :class="['Code-Line',currentLine.key === codeLine.key ? 'selected' : '']" v-for="(codeLine,index) in codeLines" :key="index">
        <span v-for="(token,index) in codeLine.tokens" :key="index" :class="token.type">
          {{token.value}}
        </span>
      </div>
      <div class="Cursor" :style="cursorStyle">
        <textarea ref="cursorInput" autofocus="true" @input="codeInput" @compositionend="inputHander"></textarea>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';

const codeLineHeight = 20
const fontSizeWidth = 8

const codeLines: any = reactive([])
let currentLine: any = ref()

const cursorOffsetX = ref<number>(0)
const cursorOffsetY = ref<number>(0)
const cursorIndex = ref<number>(0)
const cursorStyle: any = reactive({
  position: "absolute",
  left: "0px",
  top: "0px"
})
const cursorInput = ref<HTMLTextAreaElement>()

const createNewLine = () => {
  currentLine.value = reactive({
    key: codeLines.length + 1,
    tokens:[]
  })
  codeLines.push(currentLine.value)
  updateCursorOffset(null,codeLines.length * codeLineHeight)
  return currentLine
}

const updateCursorOffset = (offsetX: number | null,offsetY: number | null) => {
  if(offsetX) {
    cursorOffsetX.value = offsetX
  }
  if(offsetY) {
    cursorOffsetY.value = offsetY
  }
  updateCursorPosition()
}

const updateCursorPosition = () => {
  let offsetY = (codeLines.length - 1) * codeLineHeight
  offsetY = offsetY < 0 ? 0 : offsetY
  let offsetX = currentLine.value ? (currentLine.value.tokens.length - 1) * fontSizeWidth : 0
  offsetX = offsetX < 0 ? 0 : offsetX

  if(cursorOffsetY.value < offsetY) {
    offsetY = cursorOffsetY.value
    offsetX = cursorOffsetX.value > offsetX ? offsetX : cursorOffsetX.value
  }
  cursorStyle.left = offsetX + "px"
  cursorStyle.top = offsetY + "px"
}

const codeLineContainerClick = (event: any) => {
  updateCursorOffset(event.offsetX,event.offsetY)
  cursorInput.value?.focus()
}

const codeLineContainerKeyDown = (event: any) => {
  if(event.key === "Enter"){
    createNewLine()
  } else if(event.key === "Backspace") {
    if(currentLine.value.tokens.length === 1 && codeLines.length > 1) {
      let length = codeLines.length - 2
      currentLine.value = codeLines[length]
      codeLines.splice(codeLines.length - 1,1)
    } else {
      currentLine.value.tokens.splice(currentLine.value.tokens.length - 1,1)
    }
    cursorIndex.value = currentLine.value.tokens.length
    updateCursorOffset(cursorIndex.value * fontSizeWidth,codeLines.length * codeLineHeight)
    event.preventDefault()
  }
}

const inputHander = (event: any) => {
  const data = event.data
  currentLine.value.tokens.splice(cursorIndex.value,0,{
    type: "",
    value: data
  })
  if(cursorInput.value) {
    cursorInput.value.value = ""
  }
  cursorIndex.value = currentLine.value.tokens.length
  updateCursorOffset(cursorIndex.value * fontSizeWidth,null)
}
const codeInput = (event: any) => {
  if("insertCompositionText" === event.inputType) {
    return
  }
  inputHander(event)
}

onMounted(() => {
  createNewLine()
})
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
    width: 100%;
    position: relative;
    font-family: "Microsoft YaHei";

    .Code-Line {
      height: 20px;
      line-height: 20px;
      // padding: 0 5px;
      &.selected {
        border-top: 1px solid rgb(133, 133, 133,.2);
        border-bottom: 1px solid rgb(133, 133, 133,.2);
      }

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

      textarea {
        opacity: 0;
        width: 0;
        height: 0;
      }
    }
  }

}
</style>