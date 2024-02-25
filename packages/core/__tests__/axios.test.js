import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { pluginify, Plugin } from '../src/index.js'

const mock = new MockAdapter(axios)

mock.onGet('/users/info').reply(200, {
  users: [{ id: 1, name: "John Smith" }]
})

describe('axios pluginify test', () => {
  test('axios basic function test', async () => {
    const axiosStatic = axios.create({
      baseURL: ''
    })
  
    const res = await axiosStatic.get('/users/info')
    expect(res.data.users).toEqual([{ id: 1, name: "John Smith" }])
  })

  test('pluginify basic test', async () => {
    const axiosInstance = pluginify(axios).generate();
  
    const res = await axiosInstance.get('/users/info')
    expect(res.data.users).toEqual([{ id: 1, name: "John Smith" }])
  })

  test('a pluginClass function test', async () => {

    class TestPlugin extends Plugin{
      constructor(pluginConfig) {
        this.pluginConfig = pluginConfig
        this.pluginName = 'plugin'
      }
    
      // 可选 axios 实例化后创建
      created( axiosInstance, axiosConfig) {
        console.log(axiosInstance);
        console.log(axiosConfig);
      }
    }

    //axiosStatic add config
    const config = {
      baseURL: '/users',
      timeout: 5000
    }
    const axiosInstance = pluginify(axios, config).use(new TestPlugin()).generate();
  
    const res = await axiosInstance.get('/info')
    expect(res.data.users).toEqual([{ id: 1, name: "John Smith" }])
  })

  test('error use', () => {
    class ErrorPlugin extends Plugin{
      constructor(pluginConfig = {}) {
        this.pluginConfig = pluginConfig
        this.pluginName = 'MessagePlugin'
      }
    
      // 可选 axios 实例化后创建
      created(axiosInstance, axiosConfig) {
        throw new Error("Message")
      }
    }
    const axiosInstance = pluginify(axios).use(new ErrorPlugin()).generate();
    console.log(axiosInstance)
  })
})
