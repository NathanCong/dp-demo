<template>
  <div class="app">
    <section class="header">机器人测试程序</section>
    <section class="center">
        <!-- 视频播放测试 -->
        <section class="area">
          <header class="area-header">视频播放测试</header>
          <div class="area-video">
            <VideoPlayer
              v-model:is-playing="isPlaying"
              @sourcechange="videoSourceChange"
              @error="videoError"
              ref="playerRef"
            />
          </div>
          <div class="area-log">
            <LogPrinter ref="playerLogRef" />
          </div>
          <div class="area-action">
            <template v-if="isPlaying">
              <button @click="stop">点击暂停播放</button>
            </template>
            <template v-else>
              <button @click="play">点击播放视频</button>
            </template>
          </div>
        </section>
        <!-- 点位移动测试 -->
        <section class="area">
          <header class="area-header">点位移动测试</header>
          <div class="area-log">
            <LogPrinter />
          </div>
          <div class="area-action">
            <button>点击开始移动</button>
          </div>
        </section>
    </section>
    <section class="footer">版本号：v1.0.0</section>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import VideoPlayer from './components/VideoPlayer.vue'
import LogPrinter from './components/LogPrinter.vue'

const isPlaying = ref(false)
const playerRef = ref(null)
const playerLogRef = ref(null)

watch(isPlaying, (newStatus) => {
  if (newStatus) {
    playerLogRef?.value?.print('开始播放视频\n')
  } else {
    playerLogRef?.value?.print('暂停播放视频\n')
  }
}, { immediate: true })

function play() {
  playerRef?.value?.play()
}

function stop() {
  playerRef?.value?.stop()
}

function videoSourceChange(currentVideo) {
  playerLogRef?.value?.print(`准备播放的视频：${currentVideo.videoName}\n`)
}

function videoError(error) {
  playerLogRef?.value?.print(`错误：${error}\n`)
}
</script>

<style>
html,
body,
#root {
  width: 100%;
  height: 100vh;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

.app {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.header {
  width: 100%;
  height: 180px;
  background-color: #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 60px;
  font-weight: bold;
}

.center {
  flex: 1;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 48px;
}

.area {
  margin-bottom: 80px;
}

.area-header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 50px;
  font-weight: bold;
}

.area-video {
  margin-top: 40px;
  width: 100%;
  box-sizing: border-box;
}

.area-log {
  margin-top: 40px;
  width: 100%;
  height: 800px;
  background-color: #eee;
  position: relative;
}

.area-action {
  margin-top: 40px;
}

.area-action button {
  width: 100%;
  height: 100px;
  font-size: 40px;
  font-weight: bold;
  border-radius: 50px;
  border: none;
}

.area-action button:active {
  background-color: #ccc;
}

.footer {
  width: 100%;
  height: 90px;
  background-color: #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  font-weight: normal;
}
</style>
