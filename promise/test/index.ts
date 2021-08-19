import * as chai from 'chai'
import * as sinon from 'sinon'
import * as sinonChai from 'sinon-chai'
chai.use(sinonChai)
const assert = chai.assert

import Promise from '../src/promise'


// @ts-ignore
describe('Promise', () => {
  // @ts-ignore
  it('是一个类', () => {
    assert.isFunction(Promise)
    assert.isObject(Promise.prototype)
  })
  // @ts-ignore
  it('new Promise() 如果接受的不是一个函数就报错', () => {
    assert.throw(() => {
      // @ts-ignore
      new Promise()
    })
    assert.throw(() => {
      // @ts-ignore
      new Promise(1)
    })
    assert.throw(() => {
      // @ts-ignore
      new Promise(false)
    })
  })
  // @ts-ignore
  it('new Promise(fn) 生成一个对象，对象有 then 方法', () => {
    const promise = new Promise(() => {})
    assert.isFunction(promise.then)
  })
  // @ts-ignore
  it('new Promise(fn) 中的 fn 立即执行', () => {
    let fn = sinon.fake()
    new Promise(fn)
    assert(fn.called)
  })
  // @ts-ignore
  it('new Promise(fn) 中的 fn 执行的时候接受 reslove 和 reject 两个函数', (done) => {
    // @ts-ignore 
    const promise = new Promise((resolve, reject) => {
      assert.isFunction(resolve)
      assert.isFunction(reject)
      done()
    })
  })
  // @ts-ignore
  it('promise.then(success) 中的 success 会在 resolve 被调用的时候执行', (done) => {
    const success = sinon.fake()
    // @ts-ignore 
    const promise = new Promise((resolve, reject) => {
      // console.log('resolve')
      assert.isFalse(success.called)
      resolve()
      setTimeout(() => {
        assert.isTrue(success.called)
        done()
      });
      // console.log('代码执行了')
    })
    // @ts-ignore
    promise.then(success)
    // console.log('then')
  })
  // @ts-ignore
  it('promise.then(null, fail) 中的 fail 会在 reject 被调用的时候执行', (done) => {
    const fail = sinon.fake()
    // @ts-ignore 
    const promise = new Promise((resolve, reject) => {
      // console.log('resolve')
      assert.isFalse(fail.called)
      reject()
      setTimeout(() => {
        assert.isTrue(fail.called)
        done()
      });
      // console.log('代码执行了')
    })
    // @ts-ignore
    promise.then(null, fail)
    // console.log('then')
  })

  // @ts-ignore
  it('promise.then(success, fail) 中的 success 不是函数时被忽略不报错', () => {
    // @ts-ignore 
    const promise = new Promise((resolve, reject) => {
      resolve()
    })
    promise.then(false, null)
  })
  // @ts-ignore
  it('new Promise(fn) 中的 fn 中的 resolve 执行时状态由 pending 变为 fulfilled， 且 resolve 只能被调用一次', (done) => {
    const success = sinon.fake()
    // @ts-ignore 
    const promise = new Promise((resolve, reject) => {
      assert.isFalse(success.called)
      resolve(123)
      resolve(234)
      setTimeout(() => {
        assert(promise.state === 'fulfilled')
        assert.isTrue(success.calledOnce)
        assert(success.calledWith(123))
        done()
      }, 0);
    })
    // @ts-ignore
    promise.then(success)
  })
  // @ts-ignore
  it('new Promise(fn) 中的 fn 中的 reject 执行时状态由 pending 变为 rejected， 且 reject 只能被调用一次', (done) => {
    const fail = sinon.fake()
    // @ts-ignore 
    const promise = new Promise((resolve, reject) => {
      assert.isFalse(fail.called)
      reject(123)
      reject(234)
      setTimeout(() => {
        assert(promise.state === 'rejected')
        assert.isTrue(fail.calledOnce)
        assert(fail.calledWith(123))
        done()
      }, 0);
    })
    // @ts-ignore
    promise.then(null, fail)
  })
  // @ts-ignore
  it('在我的代码执行完之前不得执行 then 里面的 reslove 和 reject，成功回调', (done) => {
    const success = sinon.fake()
    // @ts-ignore 
    const promise = new Promise((resolve, reject) => {
      resolve()
    })
    // @ts-ignore
    promise.then(success)
    assert.isFalse(success.called)
    setTimeout(() => {
      assert.isTrue(success.called)
      done()
    }, 0);
  })
  // @ts-ignore
  it('在我的代码执行完之前不得执行 then 里面的 reslove 和 reject，失败回调', (done) => {
    const fn = sinon.fake()
    // @ts-ignore 
    const promise = new Promise((resolve, reject) => {
      reject()
    })
    // @ts-ignore
    promise.then(null, fn)
    assert.isFalse(fn.called)
    setTimeout(() => {
      assert.isTrue(fn.called)
      done()
    }, 0);
  })
  // @ts-ignore
  it('then 里面的 reslove 和 reject 被调用时没有 this 值', () => {
    // @ts-ignore 
    const promise = new Promise((resolve, reject) => {
      resolve()
    })
    // @ts-ignore
    promise.then(function(){
      "use strict"
      assert(this === undefined)
    })
  })
  // @ts-ignore
  it('then 可以在同一个 promise 里被多次调用, resolve', (done) => {
    // @ts-ignore 
    const promise = new Promise((resolve, reject) => {
      reject()
    })
    const callbacks = [sinon.fake(), sinon.fake(), sinon.fake()]
    // @ts-ignore
    promise.then(null, callbacks[0])
    promise.then(null, callbacks[1])
    promise.then(null, callbacks[2])
    setTimeout(() => {
      assert(callbacks[0].called)
      assert(callbacks[1].called)
      assert(callbacks[2].called)
      assert(callbacks[1].calledAfter(callbacks[0]))
      assert(callbacks[2].calledAfter(callbacks[1]))
      done()
    }, 0);
  })
  // @ts-ignore
  it('then 可以在同一个 promise 里被多次调用, reject', (done) => {
    // @ts-ignore 
    const promise = new Promise((resolve, reject) => {
      resolve()
    })
    const callbacks = [sinon.fake(), sinon.fake(), sinon.fake()]
    // @ts-ignore
    promise.then(callbacks[0])
    promise.then(callbacks[1])
    promise.then(callbacks[2])
    setTimeout(() => {
      assert(callbacks[0].called)
      assert(callbacks[1].called)
      assert(callbacks[2].called)
      assert(callbacks[1].calledAfter(callbacks[0]))
      assert(callbacks[2].calledAfter(callbacks[1]))
      done()
    }, 0);
  })
  
  // @ts-ignore
  it('then 必须返回一个 promise', () => {
    const promise = new Promise((resolve, reject) => {
      resolve()
    })
    const promise2 = promise.then(() => {}, () => {})
    // @ts-ignore
    assert(promise2 instanceof Promise)
  })
  // @ts-ignore
  it('如果 then(success, fail) 中的 success 返回一个值 x，运行 [[Resolve]](promise2, x)', (done) => {
    const promise = new Promise((resolve, reject) => {
      resolve()
    })
    promise
      .then(() => '成功', () => {})
      .then(result => {
        assert.equal(result, '成功')
        done()
      })
  })
  // @ts-ignore
  it('x 是一个 Promise 实例', (done) => {
    const promise = new Promise((resolve, reject) => {
      resolve()
    })
    const fn = sinon.fake()
    promise
      .then(() => new Promise(resolve => resolve()))
      .then(fn)
    setTimeout(() => {
      assert(fn.called)
      done()
    }, 6);
  })
})