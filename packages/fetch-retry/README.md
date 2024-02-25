# @req-plugin/fetch-retry

`@req-plugin/core` 的插件，在 fetch 请求中拦截失败的请求并在可能的情况下进行重试。

## DEMO
```js
import { retryPlugin } from '@req-plugin/fetch-retry'

const fetchInstance = pluginify(fetch)
                        .use(new retryPlugin())
                        .generate()

fetchInstance.fetch('http://localhost:3000/fsadf', { retryTimes: 3, retryDelay: 300})
  .then(res => console.log(res))
  .catch(err => console.error('Request Failed', err));
```

**参数**
retryPlugin 接收两个参数：
- retryTimes：重试次数
- retryDelay：重试时间间隔

可以给 插件 配置全局的重试，也可以针对某个接口配置重试机制。