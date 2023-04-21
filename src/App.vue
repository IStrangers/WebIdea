<script setup lang="ts">
import CodeEditor from './components/CodeEditor.vue'
const language = "JavaScript"
</script>

<template>
  <div class="container">
    <CodeEditor :language="language"></CodeEditor>
  </div>
</template>

<style scoped>
.container {
  height: 100vh;
}
</style>
