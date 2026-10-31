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
              <button @click="play">点击播放视频（循环播放）</button>
            </template>
          </div>
        </section>
        <!-- 点位移动测试 -->
        <section class="area">
          <header class="area-header">点位移动测试</header>
          <div class="area-log">
            <LogPrinter ref="moveLogRef" />
          </div>
          <div class="area-action">
            <template v-if="isMoving">
              <button @click="stopMove">点击停止任务（返回充电）</button>
            </template>
            <template v-else>
              <button @click="startMove">点击开始移动（循环点位）</button>
            </template>
          </div>
        </section>
    </section>
    <section class="footer">版本号：v1.0.0</section>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import VideoPlayer from './components/VideoPlayer.vue'
import LogPrinter from './components/LogPrinter.vue'
import axios from 'axios'
import { MARK_LIST } from './consts/index.js'

const isPlaying = ref(false)
const playerRef = ref(null)
const playerLogRef = ref(null)

const isMoving = ref(false)
const moveLogRef = ref(null)

watch(isPlaying, (newStatus) => {
  if (newStatus) {
    playerLogRef?.value?.print('\n开始播放视频\n')
  } else {
    playerLogRef?.value?.print('\n暂停播放视频\n')
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

async function getCurrentMarkName() {
  try {
    const { data } = await axios.get('http://127.0.0.1:4000/robot/location')
    const { near_markers } = data
    const { marker_name } = near_markers[0]
    return marker_name
  } catch (error) {
    moveLogRef?.value?.print(`错误：${error}\n`)
  }
}

async function getAllMarkNames() {
  try {
    const { data } = await axios.get('http://127.0.0.1:4000/robot/markers')
    const marker_names = (data || []).map((item) => item.marker_name)
    return marker_names
  } catch (error) {
    moveLogRef?.value?.print(`错误：${error}\n`)
  }
}

async function getMoveStatus() {
  try {
    const { data } = await axios.get('http://127.0.0.1:4000/robot/status')
    const { move_status } = data
    return move_status
  } catch (error) {
    moveLogRef?.value?.print(`错误：${error}\n`)
  }
}

function waitMoving() {
  return new Promise((resolve, reject) => {
    let timer = setInterval(() => {
      getMoveStatus()
        .then((status) => {
          if (status !== 'running') {
            clearInterval(timer)
            resolve()
          }
        })
        .catch((err) => {
          clearInterval(timer)
          reject(err)
        })
    }, 1000)
  })
}

async function moveToMark(marker) {
  try {
    const { data } = await axios.post('http://127.0.0.1:4000/robot/move', { marker })
  } catch (error) {
    moveLogRef?.value?.print(`错误：${error}\n`)
  }
}

async function startMove() {
  moveLogRef?.value?.print('\n开始循环点位\n')
  try {
    // 获取当前点位
    let currentMarkName = await getCurrentMarkName()
    const { markDesc } = MARK_LIST.find((item) => item.markName === currentMarkName) || {}
    moveLogRef?.value?.print(`当前点位：${currentMarkName}（${markDesc}）\n`)
    // 获取所有点位
    let allMarkNames = await getAllMarkNames()
    // 点位排序
    allMarkNames = allMarkNames.sort((a, b) => {
      const indexA = MARK_LIST.findIndex((item) => item.markName === a)
      const indexB = MARK_LIST.findIndex((item) => item.markName === b)

      return indexA - indexB
    })
    moveLogRef?.value?.print(`所有点位：${allMarkNames}\n`)
    // 设置移动状态
    isMoving.value = true
    // 遍历所有点位
    for (let markName of allMarkNames) {
      const { isAllow, markDesc } = MARK_LIST.find((item) => item.markName === markName) || {}
      // 跳过当前点位
      if (markName === currentMarkName) {
        continue
      }
      // 跳过不允许到达的点位
      if (isAllow === false) {
        continue
      }
      // 移动到点位
      moveToMark(markName)
      moveLogRef?.value?.print(`正在去往：${markName}（${markDesc}）...\n`)
      // 等待执行完成
      await waitMoving()
      moveLogRef?.value?.print(`已经到达：${markName}（${markDesc}）\n`)
    }
  } catch(error) {
    isMoving.value = false
    moveLogRef?.value?.print(`错误：${error}\n`)
  }
}

async function stopMove() {
  moveLogRef?.value?.print('\n停止循环点位\n')
  try {
    // 获取当前点位
    let currentMarkName = await getCurrentMarkName()
    const { markDesc } = MARK_LIST.find((item) => item.markName === currentMarkName) || {}
    moveLogRef?.value?.print(`当前点位：${currentMarkName}（${markDesc}）\n`)
    // 回到充电桩
    const markName = 'CDZ'
    const { markDesc: newMarkDesc } = MARK_LIST.find((item) => item.markName === markName) || {}
    moveToMark('CDZ')
    moveLogRef?.value?.print(`正在去往：${markName}（${newMarkDesc}）...\n`)
    // 等待执行完成
    await waitMoving()
    moveLogRef?.value?.print(`已经到达：${markName}（${newMarkDesc}）\n`)
    // 还原按钮状态
    isMoving.value = false
  } catch(error) {
    moveLogRef?.value?.print(`错误：${error}\n`)
  }
}

onMounted(() => {})
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
