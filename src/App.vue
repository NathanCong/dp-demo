<template>
  <div class="app">
    <section class="header">机器人测试程序</section>
    <section class="center">
        <!-- 视频播放测试 -->
        <section class="area">
          <header class="area-header">视频播放测试</header>
          <div class="area-video"></div>
          <div class="area-log"></div>
          <div class="area-action">
            <button>点击播放视频</button>
          </div>
        </section>
        <!-- 点位移动测试 -->
        <section class="area">
          <header class="area-header">点位移动测试</header>
          <div class="area-log"></div>
          <div class="area-action">
            <button>点击开始移动</button>
          </div>
        </section>
    </section>
    <section class="footer">版本号：v1.0.0</section>
  </div>
</template>

<script></script>

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
  height: 800px;
  background-color: black;
}

.area-log {
  margin-top: 40px;
  width: 100%;
  height: 800px;
  background-color: #eee;
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
