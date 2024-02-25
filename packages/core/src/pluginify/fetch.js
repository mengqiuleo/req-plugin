import { Core } from './core.js'

var controller = null

export async function dispatchRequest(config) {
  const url = config.url
  const timeout = config.timeout

  // 中止
  if(!controller && timeout) {
    controller = new AbortController();
    setTimeout(() => controller.abort(), timeout);
    config.signal = controller.signal
  }

  try {
      const response = await fetch(url, config)

      // 处理成功响应
      if (response.ok) return response

      return Promise.reject(response)
  } catch (error) {
      return Promise.reject(error)
  }
}

export class InterceptorManager {

  constructor() {
      // 拦截器数组栈
      this.stack = [];
  }

  /**
   * @description 收集拦截器
   * @return { number } 用栈最后一个 index 表示当前执行的拦截器的 ID
   */
  use(resolved, rejected) {
      this.stack.push({
          resolved,
          rejected,
      });

      // 返回一个 ID，可用于删除拦截器
      return this.stack.length - 1;
  }

  /** @desctiption 遍历拦截器（可以跳过已被 eject 删除的拦截器） */
  forEach(fn) {
      this.stack.forEach(interceptor => {
          if (interceptor !== null) {
              fn(interceptor);
          }
      });
  }

  /**
   * @description 删除拦截器
   * @param { number } id use 返回的 id
   */
  eject(id) {
      if (this.stack[id]) {
          // 置为null，不能直接删除
          this.stack[id] = null;
      }
  }
}

export class FetchHTTP {
  constructor(config = {}){
    this.interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager(),
    }
    this.config = config
    this.controller = null
  }

  fetch(url, fetchConfig = {}) {
    const finalConfig = {...this.config, ...fetchConfig}
    if(!finalConfig.method) {
      finalConfig.method = 'GET'
    }
    const chain = [
      {
        resolved: (httpConfig) => dispatchRequest(httpConfig),
        rejected: undefined
      }
    ]

    // 先执行请求拦截器，主要是处理config
    this.interceptors.request.stack.forEach(interceptor => {
      chain.unshift(interceptor);
    })

    // 将响应拦截塞进 chain 后面
    this.interceptors.response.stack.forEach(interceptor => {
      chain.push(interceptor);
    })

    // 将 json数据转换的 响应拦截器放在最后
    chain.push({
      resolved: (response) => {
        if (response.ok) return response.json()
        return response
      },
      rejected: null
    }); 
    
    // 利用 config 初始化一个 promise
    let promise = Promise.resolve({
      url,
      ...finalConfig,
    });

    // 执行任务
    while (chain.length) {
      const { resolved, rejected } = chain.shift();
      promise = promise.then(resolved, rejected);
    }

    return promise;

  }
}

export class FetchPluginify extends Core {
  constructor(config = {}) {
    super()
    this.config = config
  }

  generate() {
    const fetchHttp = new FetchHTTP(this.config)

    for (const [pluginName, pluginHook] of this.created.entries()) {
      try {
        pluginHook(fetchHttp, this.config);
      } catch {
        console.error(`${pluginName}插件调用出错, 插件注册中断⚠`)
        return
      }
     
    }

    fetchHttp.controller = controller

    return fetchHttp
  }
}