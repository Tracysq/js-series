class Promise2 {
  callbacks = []
  state = 'pending'

  resolve = (result) => {
    process.nextTick(() => {
      // console.log('-------')
      if(this.state !== 'pending') return
      this.state = 'fulfilled'
      this.callbacks.forEach(handle => {
        if(typeof handle[0] === 'function'){
          let x
          try {
            x = handle[0].call(undefined, result)  
          } catch (e) {
            return handle[2].reject(e)
          }
          handle[2].resolveWith(x)
        }
      })
    })
  }
  reject = (reson) => {
    process.nextTick(() => {
      if(this.state !== 'pending') return
      this.state = 'rejected'
      this.callbacks.forEach(handle => {
        if(typeof handle[1] === 'function'){
          let x
          try {
            x = handle[1].call(undefined, reson)  
          } catch (e) {
            return handle[2].reject(e)
          }
          handle[2].resolveWith(x)
        }
      })
    })
  }
  constructor(fn){
    if(typeof fn !== 'function'){
      throw new Error("我只接受函数");
    }
    
    fn(this.resolve, this.reject)
  }
  then(success?, fail?){
    const handle = []
    if(typeof success === 'function'){
      handle[0] = success
    }
    if(typeof fail === 'function'){
      handle[1] = fail
    }
    // then 必须返回一个 promise
    handle[2] = new Promise2(() => {})
    this.callbacks.push(handle)
    return handle[2]
  }
  resolveWith(x){
    if(this === x){// x 和 promise2 如果是同一个引用
      return this.reject(new TypeError())
    }else if(x instanceof Promise2){// x 如果是个 Promise 类型实例
      x.then(result  => {
        this.resolve(result)
      }, reson => {
        this.reject(reson)
      })
    }else if(x instanceof Object){// x 如果是个 对象 或 函数
      let then
      try{
        then = x.then 
      }catch(e){
        this.reject(e)
      }
      if(then instanceof Function){
        try{
          x.then(
            y => {
              this.resolveWith(y)
            },
            r => {
              this.reject(r)
            }
          )
        }catch(e){
          this.reject(e)
        }   
      }else {
        this.resolve(x)
      }
    }else {
      // x 不是对象
      this.resolve(x)
    }
  }
}

export default Promise2