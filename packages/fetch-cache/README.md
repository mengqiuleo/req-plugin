# @req-plugin/fetch-cache

`@req-plugin/core` 的插件，在 fetch 请求中将请求结果存储在可配置的存储中。

## DEMO
```js
import { cachePlugin } from '@req-plugin/fetch-cache'

const fetchInstance = pluginify(fetch)
                        .use(new cachePlugin({ threshold: 1000 * 60 * 5, max: 100}))
                        .generate()

// 给需要缓存的请求增加 useCache 字段
fetchInstance.fetch('http://localhost:3000/posts', {
  useCache: true
})
  .then(res => console.log(res))
  .catch(err => console.error('Request Failed', err))

setTimeout(() => {
  // 这个请求会用缓存
  fetchInstance.fetch('http://localhost:3000/posts', {
    useCache: true
  })
    .then(res => console.log(res))
    .catch(err => console.error('Request Failed', err))
}, 5000);
```

**参数**
cachePlugin 接收两个参数：
- threshold：缓存时间，默认是5分钟
- max：最多对多少个请求做缓存，默认是100