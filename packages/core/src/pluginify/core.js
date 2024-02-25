export class Plugin {
  constructor(){
    this.pluginName = ''
  }
}

export class Core {
  constructor(){
    this.created = new Map()
  }

  use(...plugins){
    for (const plugin of plugins) {
      if (typeof plugin.created === 'function') {
        this.created.set(
          `${plugin.pluginName}`, 
          (instance, config) => plugin.created(instance, config))
      }
    }

    return this;
  }

   /**
   * 调用所有插件
   */
  generate() {}
}