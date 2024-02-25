# @req-plugin/core
`@req-plugin/core`是`@req-plugin`的核心，它可以让 `axios`、`fetch` 成为基于插件的请求库，该 npm 包提供了一种维护请求、响应拦截器的方式。

## 特性
- 所有拦截器职责单一、方便维护
- 并统一维护和自动调度
- 可自定义插件、包装已有第三方插件


## 安装
```bash
npm install @req-plugin/core
```

## axios 使用

```javascript
import axios from 'axios'

//1. axiosStatic add config
const config = {
  baseURL: '/users',
  timeout: 5000
}
const axiosInstance1 = pluginify(axios, config).use(new Plugin(), new Plugin()).generate();
const axiosInstance2 = pluginify(axios).use(new Plugin()).use(new Plugin()).generate();

//2. AxiosInstance add config
axiosInstance2.defaults.baseURL = '/users'
axiosInstance2.defaults.timeout = 5000

const res1 = await axiosInstance1.get('/info')
const res2 = await axiosInstance2.get('/info')
```

## fetch 使用

`fetch` 这个 API 原生是不支持拦截器的，`@axios-plugin/core` 内部参考 `axios` 拦截器的实现，对 `fetch` 增加了拦截器功能，并将 response 做 json 格式化处理。

pluginify 在调用 generate API 之后会返回一个 fetch 请求的实例，发起请求时需要调用这个实例上的 fetch 方法，参数与原来的方法参数一致。


```javascript
const config = { 
  //... 
}
const fetchInstance1 = pluginify(fetch, config).use(new Plugin(), new Plugin()).generate()

fetchInstance1.fetch('/info', {
  method: 'GET'
})
```

## 插件
自定义插件通过自定义Class, 插件是一个类, 提供 `created` 生命周期钩子，在请求实例创建出来之后调用。

`@req-plugin` 提供了两个 fetch 插件：
1. `@req-plugin/fetch-cache` 将请求结果存储在可配置的存储中
2. `@req-plugin/fetch-retry` 拦截失败的请求并在可能的情况下进行重试

@req-plugin 并没有提供 axios 相关的扩展插件，因为 axios 相关生态中已经有了很多成熟的插件（拿来主义），可以直接在自定义插件中对第三方插件封装。


### 自定义插件
```javascript
import { Plugin } from '@req-plugin/core'

class XXXPlugin extends Plugin{
  constructor(pluginConfig) {
    this.pluginConfig = pluginConfig
    this.pluginName = 'plugin' //必选，插件名，用于记录插件调用出错的情况
  }

  // 可选 请求实例化后创建
  created(instance, config) {
    console.log(instance);
    console.log(config);
  }
}
```

### 包装已有类库
主要针对 axios 使用。

```javascript
import { Plugin } from '@req-plugin/core'
import MockAdapter from 'axios-mock-adapter'

class MockAdapterPlugin {

  constructor(pluginConfig) {
    this.pluginConfig = pluginConfig
    this.pluginName = 'MockAdapterPlugin'
  }

  created(axiosInstance) {
    const mock = new MockAdapter(axiosInstance) 

    mock.onGet('/uesrs').reply(200, {
      msg: 'hello world'
    })
  }
}
```

### 包装拦截器

fetch 的请求、响应拦截器使用方式与 axios 相同，pluginify 在调用 generate API 之后会返回一个 fetch 请求的实例，我们可以在这个实例上添加拦截器。


```javascript
import { Plugin } from '@req-plugin/core'

class XXXPlugin extends Plugin{

  constructor(pluginConfig) {
    this.pluginConfig = pluginConfig
    this.pluginName = 'XXXPlugin'
  }

  created(instance) { // 这里的 instance 就是 fetch 实例
    instance.interceptors.request.use((request) => {
      console.log(request)
    })
    instance.interceptors.response.use((response) => {
      if (response.status === 200) {
        return response.data
      }
    })
  }
}
```

## QA
-  插件注册的中断，插件在注册时调用 created 方法，对整个插件数组遍历，使用 try catch 包裹。