import { AxiosPluginify } from './pluginify/axios.js'
import { FetchPluginify } from './pluginify/fetch.js'

export function pluginify(instance, config) {
  return instance === 'axios' ? new AxiosPluginify(config) : new FetchPluginify(config)
}
