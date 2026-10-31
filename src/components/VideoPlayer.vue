<template>
  <div class="video-wrapper">
    <video
      ref="videoElement"
      class="video-js vjs-big-play-centered"
      controls
      playsinline
    ></video>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import { TEST_VIDEO_LIST } from '../consts/index'

const videoElement = ref(null)
let player = null
const currentIndex = ref(0)

const props = defineProps({
  isPlaying: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:isPlaying', 'sourcechange', 'error'])

async function play() {
  try {
    await player?.play()
  } catch (error) {
    console.error(error)
    emit('error', error)
  }
}

async function stop() {
  try {
    await player?.pause()
  } catch (error) {
    console.error(error)
    emit('error', error)
  }
}

onMounted(() => {
  player = videojs(videoElement.value, {
    controls: true,
    responsive: true,
    fluid: false,
    fill: true,
    autoplay: false,
    preload: 'none',
    sources: TEST_VIDEO_LIST.map((item) => ({
      src: item.videoUrl,
      type: 'video/mp4',
    })),
  })

  player.on('play', () => emit('update:isPlaying', true))

  player.on('pause', () => emit('update:isPlaying', false))

  player.on('ended', () => {
    const nextIndex = currentIndex.value + 1

    if (nextIndex < TEST_VIDEO_LIST.length) {
      const { videoUrl } = TEST_VIDEO_LIST[nextIndex]
      player.src({ src: videoUrl, type: 'video/mp4' })
      play()
    } else {
      console.log('全部视频播放完毕')
      emit('update:isPlaying', false)
    }
  })

  player.on('error', () => emit('update:isPlaying', false))

  player.on('loadstart', () => {
    const source = player.currentSource()
    const targetVideo = TEST_VIDEO_LIST.find((item) => item.videoUrl === source.src)
    emit('sourcechange', targetVideo)
  })
})

onBeforeUnmount(() => {
  if (player) {
    player.dispose()
    player = null
  }
})

defineExpose({ play, stop })
</script>

<style scoped>
.video-wrapper {
  position: relative;
  width: 100%;
  max-width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  box-sizing: border-box;
}

.video-wrapper :deep(.video-js) {
  width: 100%;
  height: 100%;
  max-width: 100%;
}

.video-wrapper :deep(.vjs-tech) {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
