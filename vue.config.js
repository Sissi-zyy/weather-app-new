
module.exports = {
  publicPath: './', // 关键：设置为相对路径
  outputDir: 'dist', // 确保打包输出到dist文件夹
  transpileDependencies: {},
  configureWebpack: {
    performance: {
      hints: false
    }
  }
}

