import net from 'node:net'
import { randomUUID } from 'node:crypto'
import JSONParser from 'jsonparse'

const ROBOT_HOST = '192.168.10.10'
const ROBOT_PORT = 31001

/**
 * 统一处理接口异常
 */
export function handle(fn) {
  return async (req, res) => {
    try {
      res.json(await fn(req))
    } catch (error) {
      res.status(502).json({ message: error.message })
    }
  }
}

/**
 * TCP 请求（与机器人通讯）
 */
export function robotRequest(command, params = {}) {
  return new Promise((resolve, reject) => {
    const uuid = randomUUID()
    const parser = new JSONParser()
    const socket = new net.Socket()
    let finished = false

    function finish(error, data) {
      if (finished) {
        return
      }

      finished = true

      clearTimeout(timer)

      socket.destroy()

      if (error) {
        reject(error)
        return
      }

      resolve(data)
    }

    const timer = setTimeout(() => {
      finish(new Error('机器人响应超时；移动指令可能已经执行，请勿直接重试'))
    }, 5000)

    parser.onValue = function (data) {
      // 只处理完整的顶层 JSON 对象
      if (this.stack.length !== 0) {
        return
      }

      // 排除主动通知，并匹配本次请求
      if (data.type !== 'response' || data.uuid !== uuid) {
        return
      }

      if (data.status === 'OK') {
        finish(null, data)
      } else {
        finish(new Error(data.error_message || data.status))
      }
    }

    socket.on('data', (chunk) => {
      try {
        parser.write(chunk)
      } catch (error) {
        finish(error)
      }
    })

    socket.on('error', (error) => finish(error))

    socket.on('close', () => {
      finish(new Error('机器人连接已关闭'))
    })

    socket.connect(ROBOT_PORT, ROBOT_HOST, () => {
      const query = Object.entries({ ...params, uuid })
        .map(([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
        )
        .join('&')

      socket.write(`${command}?${query}`)
    })
  })
}
