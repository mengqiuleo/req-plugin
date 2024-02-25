import { Core } from './core.js'

export class AxiosPluginify extends Core {
  constructor(axiosStatic, config = {}) {
    super()
    this.axiosStatic = axiosStatic
    this.config = config
  }

  generate() {
    const axiosInstance = this.axiosStatic.create(this.config)

    for (const plugin of this.created) {
      const { created: createdEffect, pluginName } = plugin
      try {
        createdEffect(axiosInstance, this.config)
      } catch {
        console.error(`${pluginName}插件调用出错, 插件注册中断⚠`)
        return
      }
     
    }

    return axiosInstance
  }
}