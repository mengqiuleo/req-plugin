<script setup>
import { pluginify } from '../../packages/core/index'
import { retryPlugin } from '../../packages/core/plugin.js'
import { cachePlugin } from '../../packages/cachePlugin/src/index.js'


const fetchInstance = pluginify('fetch')
                        .use(new retryPlugin(), new cachePlugin())
                        .generate()

// fetchInstance.fetch('http://localhost:3000/fsadf', { retryTimes: 3, retryDelay: 300})
//   .then(res => console.log(res))
//   .catch(err => console.error('Request Failed', err));

fetchInstance.fetch('http://localhost:3000/posts', {
  useCache: true
})
  .then(res => console.log(res))
  .catch(err => console.error('Request Failed', err))


setTimeout(() => {
  fetchInstance.fetch('http://localhost:3000/posts', {
    useCache: true
  })
    .then(res => console.log(res))
    .catch(err => console.error('Request Failed', err))
}, 5000);
</script>

<template>
  <div>
    123
  </div>
</template>

<style scoped>
</style>
