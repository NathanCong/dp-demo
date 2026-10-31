<template>
  <div class="log-wrapper">{{ logs }}</div>
</template>

<script setup>
import { ref } from 'vue'

let logs = ref('')

function print(content) {
  logs.value += content
}

defineExpose({ print })
</script>

<style scoped>
.log-wrapper {
  position: absolute;
  top: 32px;
  right: 32px;
  bottom: 32px;
  left: 32px;
  font-size: 30px;
  white-space: pre-line;
}
</style>
