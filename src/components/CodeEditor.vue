<template>
  <div class="Code-Editor">
    <div class="Code-Line-Number-Container">
      <div class="Code-Line-Number" v-for="(codeLine,index) in codeLines" :key="index">
        {{ index + 1 }}
      </div>
    </div>
    <div class="Code-Line-Container" @click="codeLineContainerClick" @keydown="codeLineContainerKeyDown">
      <div :class="['Code-Line',getCurrentLine().key === codeLine.key ? 'selected' : '']" v-for="(codeLine,index) in codeLines" :key="codeLine.key">
        <span v-for="(token,index) in codeLine.tokens" :key="index" :class="token.type">
          {{ token.value }}
        </span>
      </div>
      <div class="Cursor" :style="cursorStyle">
        <textarea ref="cursorInput" autofocus="true" @input="codeInput" @compositionend="inputHander"></textarea>
        <canvas ref="measureCanvas" style="display: none;"></canvas>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
const codeLineHeight = 20

const cursorInput = ref<HTMLTextAreaElement>()
const cursorStyle: any = reactive({
  position: "absolute",
  left: "0px",
  top: "0px"
})

const measureCache = new Map<string,number>()
const measureCanvas = ref<HTMLCanvasElement>()
const getTextWidth = (text: string) => {
  let textWidth = measureCache.get(text)
  if(textWidth) return textWidth
  const ctx: any = measureCanvas.value?.getContext('2d')
  ctx.font = '14px Microsoft YaHei'
  textWidth = ctx.measureText(text).width
  textWidth = textWidth ? textWidth : 0
  measureCache.set(text,textWidth)
  return textWidth
}

const codeLines: any = reactive([])
let currentLineIndex = -1
let currentTokenIndex = 0
const getCurrentLine = () => codeLines[currentLineIndex]
const getCurrentToken = () => getCurrentLine().tokens[currentTokenIndex]

const createToken = (type: string,value: string,width: number) => {
  return {
    type,
    value,
    width,
  }
}
const createLineFeedToken = () => {
  const token = createToken("","\n",0)
  currentTokenIndex = 0
  return token
}

const createNewCodeLine = () => {
  const token = createLineFeedToken()
  const tokens = [token]
  createCodeLine(tokens)
}
const createCodeLine = (tokens: Array<any>,pushIndex?: number) => {
  addCodeLine({
    key: new Date().getTime() + "-" + Math.random(),
    tokens,
  },pushIndex)
}
const addCodeLine = (codeLine: any,pushIndex?: number) => {
  if(pushIndex) {
    codeLines.splice(pushIndex,0,codeLine)
  } else {
    codeLines.push(codeLine)
  }
  currentLineIndex++
  updateCursorPosition()
}
const getLineWidth = (tokens: Array<any>) => {
  const lineWidth = tokens ? tokens.reduce((width: number,token2: any) => width + token2.width,0) : 0
  return lineWidth
}

const updateCursorPosition = () => {
  const offsetY = currentLineIndex * codeLineHeight
  const offsetX = getCurrentToken() ? getLineWidth(getCurrentLine().tokens.slice(0,currentTokenIndex + 1)) : 0
  cursorStyle.left = offsetX + "px"
  cursorStyle.top = offsetY + "px"
}

const codeLineContainerClick = (event: any) => {
  const { clientY,offsetX } = event

  currentLineIndex = Math.floor(clientY / codeLineHeight)
  currentLineIndex = currentLineIndex >= codeLines.length ? codeLines.length - 1 : currentLineIndex
  
  const tokens = getCurrentLine().tokens
  let currentLineWidth = 0
  for(let i = 0; i < tokens.length; i++) {
    const token = tokens[i]
    currentLineWidth += token.width
    if(currentLineWidth >= offsetX) {
      currentTokenIndex = i
      break
    } else if(i === tokens.length - 1) {
      currentTokenIndex = i
      break
    }
  }

  updateCursorPosition()
  cursorInput.value?.focus()
}

const codeLineContainerKeyDown = (event: any) => {
  if(event.key === "Enter"){
    const currentTokens = getCurrentLine().tokens
    if(currentTokenIndex === currentTokens.length - 1) {
      createNewCodeLine()
    } else {
      const newLineTokens = currentTokens.splice(currentTokenIndex + 1,currentTokens.length)
      const lineFeedToken = createLineFeedToken()
      newLineTokens.splice(0,0,lineFeedToken)
      createCodeLine(newLineTokens,currentLineIndex + 1)
    }
    event.preventDefault()
  } else if(event.key === "Backspace") {
    if(currentTokenIndex === 0 && currentLineIndex > 0 && codeLines.length > 1) {
      let oldTokens = getCurrentLine().tokens
      codeLines.splice(currentLineIndex,1)
      currentLineIndex--
      const currentTokens = getCurrentLine().tokens
      currentTokenIndex = currentTokens.length - 1
      if(oldTokens.length > 1) {
        currentTokens.push(...oldTokens.slice(1))
      }
      updateCursorPosition()
    } else if(currentTokenIndex > 0) {
      const currentTokens = getCurrentLine().tokens
      currentTokens.splice(currentTokenIndex,1)
      currentTokenIndex--
      updateCursorPosition()
    }
  } else if(event.key === "ArrowLeft") {
    if(currentTokenIndex - 1 >= 0) {
      currentTokenIndex--
      updateCursorPosition()
    } else if(currentLineIndex - 1 >= 0) {
      currentLineIndex--
      const currentTokens = getCurrentLine().tokens
      currentTokenIndex = currentTokens.length - 1
      updateCursorPosition()
    }
  } else if(event.key === "ArrowRight") {
    const currentTokens = getCurrentLine().tokens
    if(currentTokenIndex + 1 < currentTokens.length) {
      currentTokenIndex++
      updateCursorPosition()
    } else if(currentLineIndex + 1 < codeLines.length) {
      currentLineIndex++
      currentTokenIndex = 0
      updateCursorPosition()
    }
    
  } else if(event.key === "ArrowUp") {
    if(currentLineIndex > 0) {
      currentLineIndex--
      const currentTokens = getCurrentLine().tokens
      if(currentTokens.length <= currentTokenIndex) {
        currentTokenIndex = currentTokens.length - 1
      }
      updateCursorPosition()
    }
  } else if(event.key === "ArrowDown") {
    if(currentLineIndex < codeLines.length - 1) {
      currentLineIndex++
      const currentTokens = getCurrentLine().tokens
      if(currentTokens.length <= currentTokenIndex) {
        currentTokenIndex = currentTokens.length - 1
      }
      updateCursorPosition()
    }
  }
}

const inputHander = (event: any) => {
  const data = event.data
  let token
  if(data === " ") {
    token = createToken("BlankSpace"," ",5)
  } else {
    const type = ""
    const value = data
    const width = data ? getTextWidth(data) : 0
    token = createToken(type,value,width)
  }
  currentTokenIndex++
  const currentTokens = getCurrentLine().tokens
  currentTokens.splice(currentTokenIndex,0,token)
  if(cursorInput.value) {
    cursorInput.value.value = ""
  }
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
  // border-radius: 4px;
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
        display: inline-block;
        color: rgb(133, 133, 133);
        &.Error {
          color: red;
        }
        &.BlankSpace {
          width: 5px;
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