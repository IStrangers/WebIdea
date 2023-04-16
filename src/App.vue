<template>
  <div class="container">
    <CodeEditor></CodeEditor>
  </div>
</template>

<script lang="ts" setup>
import CodeEditor from '@/components/CodeEditor.vue'
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}
.container {
  height: 100vh;
}
</style>