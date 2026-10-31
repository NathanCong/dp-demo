<template>
  <div class="log-wrapper" ref="logElement">{{ logs }}</div>
</template>

<script setup>
import { ref, nextTick } from 'vue'

let logs = ref('')
const logElement = ref(null)

async function print(content) {
  logs.value += content

  await nextTick()

  const element = logElement.value
  if (element) {
    element.scrollTop = element.scrollHeight
  }
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
  overflow-y: auto;
}
</style>
