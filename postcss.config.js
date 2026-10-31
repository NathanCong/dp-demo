export default {
  plugins: {
    'postcss-px-to-viewport-8-plugin': {
      // 设计稿的基准宽度
      viewportWidth: 1632,
      // 转换后保留的小数位数
      unitPrecision: 5,
      // 转换使用的单位
      viewportUnit: 'vw',
      // 小尺寸值的转换阈值
      minPixelValue: 1,
      // 是否转换媒体查询中的 px
      mediaQuery: false,
    },
  },
}
