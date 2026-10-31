import express from 'express'
import { handle, robotRequest } from './utils.mjs'

/**
 * 创建服务
 */
const app = express()

/**
 * 加载插件
 */
app.use(express.json())

/**
 * 创建路由
 */

// 获取当前位置、附近点位
app.get('/robot/location', handle(async () => {
  const data = await robotRequest('/api/get_current_location', {
    distance_threshold: 2,
  })

  return data.results
}))

// 获取当前地图全部点位
app.get('/robot/markers', handle(async () => {
  const data = await robotRequest('/api/markers/query_list')

  return Object.values(data.results ?? {})
}))

// 从当前位置移动到指定点位
app.post('/robot/move', handle(async (req) => {
  const { marker } = req.body

  if (typeof marker !== 'string' || !marker.trim()) {
    throw new Error('请提供目标点位名称')
  }

  return robotRequest('/api/move', { marker })
}))

// 获取移动任务状态
app.get('/robot/status', handle(async () => {
  const data = await robotRequest('/api/robot_status')

  return data.results
}))

/**
 * 启动服务
 */
app.listen(4000, '127.0.0.1', () => {
  console.log('服务已启动：http://127.0.0.1:4000')
})
