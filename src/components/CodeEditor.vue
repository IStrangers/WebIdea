<template>
  <div class="Code-Editor">
    <div class="Code-Line-Number-Container">
      <div class="Code-Line-Number" v-for="(codeLine,index) in codeLines" :key="index">
        {{ index + 1 }}
      </div>
    </div>
    <div class="Code-Line-Container" @click="codeLineContainerClick" @keydown="codeLineContainerKeyDown">
      <div :class="['Code-Line',currentLine.key === codeLine.key ? 'selected' : '']" v-for="(codeLine,index) in codeLines" :key="index">
        <span v-for="(token,index) in codeLine.tokens" :key="index" :class="token.type">
          {{ token.value }}
        </span>
      </div>
      <div class="Cursor" :style="cursorStyle">
        <textarea ref="cursorInput" autofocus="true" @input="codeInput" @compositionend="inputHander"></textarea>
      </div>
      <canvas ref="measureCanvas" style="display: none;"></canvas>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'

const codeLineHeight = 20

const codeLines: any = reactive([])
let currentLine: any = ref()
let currentToken: any = ref()
let currentTokenIndex = 0

const cursorStyle: any = reactive({
  position: "absolute",
  left: "0px",
  top: "0px"
})
const cursorInput = ref<HTMLTextAreaElement>()

const measureCanvas = ref<HTMLCanvasElement>()
const getTextWidth = (text: string) => {
  const ctx: any = measureCanvas.value?.getContext('2d')
  ctx.font = '14px Microsoft YaHei'
  const textWidth = ctx.measureText(text).width
  return textWidth
}

const getCurrentLine = () => currentLine.value
const getCurrentToken = () => currentToken.value

const createToken = (index: number,type: string,value: string,width: number) => {
  currentToken.value = {
    index,
    type,
    value,
    width,
  }
  return currentToken
}

const createLineFeedToken = () => {
  const token = createToken(0,"","\n",0)
  currentTokenIndex = 1
  return token
}

const createNewCodeLine = () => {
  const index = codeLines.length
  const token = createLineFeedToken().value
  const tokens = [token]
  return createCodeLine(index,tokens)
}

const createCodeLine = (index: number,tokens: Array<any>,pushIndex?: number) => {
  return addCodeLine({
    key: new Date().getTime() + "-" + Math.random(),
    index,
    tokens,
  },pushIndex)
}

const addCodeLine = (codeLine: any,pushIndex?: number) => {
  currentLine.value = codeLine
  if(pushIndex) {
    codeLines.splice(pushIndex,0,codeLine)
  } else {
    codeLines.push(codeLine)
  }
  updateCursorPosition()
  return currentLine
}

const updateCursorPosition = () => {
  const offsetY = getCurrentLine().index * codeLineHeight
  const offsetX = currentToken.value ? getLineWidth(getCurrentLine().tokens.slice(0,getCurrentToken().index + 1)) : 0
  cursorStyle.left = offsetX + "px"
  cursorStyle.top = offsetY + "px"
}

const getLineWidth = (tokens: Array<any>) => {
  const lineWidth = tokens ? tokens.reduce((width: number,token2: any) => width + token2.width,0) : 0
  return lineWidth
}

const codeLineContainerClick = (event: any) => {
  const { clientX,clientY,offsetX,offsetY } = event

  let currentLineIndex = Math.floor(clientY / codeLineHeight)
  currentLineIndex = currentLineIndex >= codeLines.length ? codeLines.length - 1 : currentLineIndex
  currentLine.value = codeLines[currentLineIndex]
  
  const tokens = getCurrentLine().tokens
  let currentLineWidth = 0
  for(let i = 0; i < tokens.length; i++) {
    const token = tokens[i]
    currentLineWidth += token.width
    if(currentLineWidth >= offsetX) {
      currentToken.value = token
      break
    } else if(i === tokens.length - 1) {
      currentToken.value = tokens[tokens.length - 1]
      break
    }
  }

  updateCursorPosition()
  cursorInput.value?.focus()
}

const codeLineContainerKeyDown = (event: any) => {
  const currentTokens = getCurrentLine().tokens
  if(event.key === "Enter"){
    if(getCurrentToken().index === currentTokens.length - 1) {
      createNewCodeLine()
    } else {
      const newLineTokens = currentTokens.splice(getCurrentToken().index + 1,currentTokens.length)
      const lineFeedToken = createLineFeedToken()
      newLineTokens.splice(0,0,lineFeedToken.value)
      createCodeLine(0,newLineTokens,getCurrentLine().index + 1)
    }
    event.preventDefault()
  } else if(event.key === "Backspace") {
    if(currentTokens.length === 1 && codeLines.length > 1) {
      let length = codeLines.length - 2
      currentLine.value = codeLines[length]
      codeLines.splice(codeLines.length - 1,1)
    } else {
      currentTokens.splice(currentTokens.length - 1,1)
    }
    currentTokenIndex = currentTokens.length
    updateCursorPosition()
  } else if(event.key === "ArrowLeft") {
    let currentTokenIndex = getCurrentToken().index - 1
    if(currentTokenIndex >= 0) {
      currentToken.value = currentTokens[currentTokenIndex]
    }
    updateCursorPosition()
  } else if(event.key === "ArrowRight") {
    let currentTokenIndex = getCurrentToken().index + 1
    if(currentTokenIndex < currentTokens.length) {
      currentToken.value = currentTokens[currentTokenIndex]
    }
    updateCursorPosition()
  }
}

const inputHander = (event: any) => {
  const currentTokens = getCurrentLine().tokens
  const data = event.data
  const index = currentTokens.length
  const type = ""
  const value = data
  const width = data ? getTextWidth(data) : 0
  const token = createToken(index,type,value,width).value
  currentTokens.splice(currentTokenIndex,0,token)
  if(cursorInput.value) {
    cursorInput.value.value = ""
  }
  currentTokenIndex = currentTokens.length
  updateCursorPosition()
}
const codeInput = (event: any) => {
  if("insertCompositionText" === event.inputType) {
    return
  }
  inputHander(event)
}

onMounted(() => {
  createNewCodeLine()
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
    user-select: none;

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
      box-sizing: border-box;
      height: 20px;
      line-height: 20px;

      &.selected {
        border-top: 1px solid rgb(133, 133, 133,.2);
        border-bottom: 1px solid rgb(133, 133, 133,.2);
        line-height: 18px;
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