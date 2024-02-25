<script setup>
import { pluginify } from '@req-plugin/core'
import { retryPlugin } from '@req-plugin/fetch-retry'
import { cachePlugin } from '@req-plugin/fetch-cache'
import axios from 'axios'

const axiosInstance = pluginify(axios)
                        .use()
                        .generate()

axiosInstance.get('http://localhost:3000/posts')
  .then(res => console.log('axios res', res))

const fetchInstance = pluginify(fetch)
                        .use(new retryPlugin(), new cachePlugin())
                        .generate()

fetchInstance.fetch('http://localhost:3000/fsadf', { retryTimes: 3, retryDelay: 300})
  .then(res => console.log(res))
  .catch(err => console.error('Request Failed', err));

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
