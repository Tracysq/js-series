class Promise2 {
  callbacks = []
  state = 'pending'

  resolve = (result) => {
    setTimeout(() => {
      // console.log('-------')
      if(this.state !== 'pending') return
      this.state = 'fulfilled'
      this.callbacks.forEach(handle => {
        if(typeof handle[0] === 'function'){
          handle[0].call(undefined, result)
        }
      })
    }, 0)
  }
  reject = (reson) => {
    setTimeout(() => {
      if(this.state !== 'pending') return
      this.state = 'rejected'
      this.callbacks.forEach(handle => {
        if(typeof handle[1] === 'function'){
          handle[1].call(undefined, reson)
        }
      })
    }, 0);
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
    this.callbacks.push(handle)
  }
}

export default Promise2