import axios from 'axios'
import { Core } from './core.js'

export class AxiosPluginify extends Core {
  constructor(config) {
    super()
    this.config = config
  }

  generate() {
    const axiosInstance = axios.create(this.config)

    for (const plugin of this.created) {
      const { created: createdEffect, pluginName } = plugin
      try {
        createdEffect(axiosInstance, this.config)
      } catch {
        console.error(`${pluginName}插件调用出错, 插件注册中断⚠`)
        return
      }
     
    }

    return axios
  }
}