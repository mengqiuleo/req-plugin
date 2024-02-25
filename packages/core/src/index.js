import { AxiosPluginify } from './pluginify/axios.js'
import { FetchPluginify } from './pluginify/fetch.js'
import { Plugin } from './pluginify/core.js'

export function pluginify(instance, config) {
  const funName = instance.toString().match(/function\s*([^(]*)\(/)[1]
  if(funName === 'fetch'){
    return new FetchPluginify(config)
  }
  return new AxiosPluginify(instance, config)
}

export { Plugin }