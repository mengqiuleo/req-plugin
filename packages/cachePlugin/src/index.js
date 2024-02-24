import { Plugin } from '../../core/pluginify/core'
import { LRUCache } from 'lru-cache'

export class cachePlugin extends Plugin {
  constructor(cacheConfig = { threshold: 1000 * 60 * 5, max: 100}){
    super()
    this.pluginName = 'cachePlugin'
    this.cacheConfig = cacheConfig
    this.defaultCache = new LRUCache({ ttl: this.cacheConfig.threshold, max: this.cacheConfig.max })
    this.cacheMap = new Map()
  }

  created(instance, config){
    let oldFetch = instance.fetch.bind(instance)
    let that = this
    instance.interceptors.response.use((res) => {
      const { url, status } = res
      const key = this.cacheMap.get(url)

      if (status === 200 && key) {
        // fetch 的返回结果的 body（ReadableStream）数据只能读取一次（用 bodyUsed 标志是否使用），所以要复制
        const cloneRes = res.clone()
        
        this.defaultCache.set(key, cloneRes.json())
      }
      return res
    }, null)
  

    instance.fetch = function(url, fetchConfig = {}) {
      const { method = 'GET', useCache } = fetchConfig

      if(!useCache) return oldFetch(url, fetchConfig)

      const key = [method, url].join("&")

      if(useCache && method === 'GET') {
        const cache = that.defaultCache.get(key)
        if(cache) {
          console.info('[cachePlugin]: 命中缓存, 请求路径: ', url)
          
          return cache
        }

        that.cacheMap.set(url, key)
      }

      // 发起请求
      return oldFetch(url, fetchConfig)
    }
  }
}