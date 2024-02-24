import { Plugin } from '../../core/pluginify/core'

export class retryPlugin extends Plugin {
  constructor(retryConfig = { retryTimes: 3, retryDelay: 300}){
    super()
    this.pluginName = 'retryPlugin'
    this.retryConfig = retryConfig
    this.retryMap = new Map()
  }

  created(instance, config){
    instance.interceptors.request.use((fetchConfig) => {
      // debugger
      const url = fetchConfig.url
      if(this.retryMap.has(url)) return this.retryMap.get(url)
      const finalConfig = { ...fetchConfig, ...this.retryConfig }
      this.retryMap.set(url, finalConfig)
      return Promise.resolve(finalConfig)
    }, null)

    instance.interceptors.response.use(null, (err) => {
      const url = err.url
      // debugger
      console.info('[retryPlugin]: 准备重新发起请求, 请求路径: ', url)
      let config = this.retryMap.get(url);
      if (!config || !config.retryTimes) return Promise.reject(err);
      const { __retryCount = 0, retryDelay = 300, retryTimes } = config;
      // 在请求对象上设置重试次数
      config.__retryCount = __retryCount;
      // 判断是否超过了重试次数
      if (__retryCount >= retryTimes) {
        return Promise.reject(err);
      }
      // 增加重试次数
      config.__retryCount++;
      // 延时处理
      const delay = new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, retryDelay);
      });

      return delay.then(function () {
        return instance.fetch(url, config);
      });
    });
    
  }
}