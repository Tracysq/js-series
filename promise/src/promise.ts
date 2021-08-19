class Promise2 {
  callbacks = []
  state = 'pending'

  private resolveOrReject(state, data, i){
    nextTick(() => {
      // console.log('-------')
      if(this.state !== 'pending') return
      this.state = state
      this.callbacks.forEach(handle => {
        if(typeof handle[i] === 'function'){
          let x
          try {
            x = handle[i].call(undefined, data)  
          } catch (e) {
            return handle[2].reject(e)
          }
          handle[2].resolveWith(x)
        }
      })
    }) 
  }

  resolve = (result) => {
    this.resolveOrReject('fulfilled', result, 0)
  }
  reject = (reson) => {
    this.resolveOrReject('rejected', reson, 1)
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
  resolveWithSelf(){
    return this.reject(new TypeError())
  }
  resolveWithPromise(x){
    x.then(result  => {
      this.resolve(result)
    }, reson => {
      this.reject(reson)
    })
  }
  private getThen(x){
    let then 
    try{
      then = x.then 
    }catch(e){
      return this.reject(e)
    }
    return then
  }
  resolveWidthThenable(x){
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
  }
  resolveWithObject(x){
    let then = this.getThen(x)
      if(then instanceof Function){
        this.resolveWidthThenable(x)
      }else {
        this.resolve(x)
      }
  }
  resolveWith(x){
    if(this === x){// x 和 promise2 如果是同一个引用
      this.resolveWithSelf()
    }else if(x instanceof Promise2){// x 如果是个 Promise 类型实例
      this.resolveWithPromise(x)
    }else if(x instanceof Object){// x 如果是个 对象 或 函数
      this.resolveWithObject(x)
    }else {
      // x 不是对象
      this.resolve(x)
    }
  }
}

export default Promise2

function nextTick(fn) {
  if(process !== undefined && typeof process.nextTick === 'function'){
    return process.nextTick(fn)
  }
  let count = 1
  const observer = new MutationObserver(fn)
  const textNode = document.createTextNode(String(count))

  observer.observe(textNode, {
    characterData: true
  })
  count += 1
  textNode.data = String(count)
}