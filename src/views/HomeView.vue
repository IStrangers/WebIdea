<template>
  <div class="home">
    <CodeEditor></CodeEditor>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import CodeEditor from '@/components/CodeEditor.vue'

@Options({
  components: {
    CodeEditor
  },
})
export default class HomeView extends Vue {}
</script>

<style lang="scss" scoped>
  .home{
    height: 95vh;
  }
</style>