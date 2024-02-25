import { AxiosPluginify } from './pluginify/axios.js'
import { FetchPluginify } from './pluginify/fetch.js'
import { Plugin } from './pluginify/core.js'

export function pluginify(instance) {
  return instance ? new AxiosPluginify(instance) : new FetchPluginify()
}

export { Plugin }