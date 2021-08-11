import EventHub from '../src/index'

type TestCase = (message: string) => void

const test1: TestCase = (message) => {
  const eventHub = new EventHub()
  console.assert(eventHub instanceof Object === true, 'eventhub 是个对象')
  console.log(message)
}

const test2: TestCase = (message) => {
  const eventHub = new EventHub()
  // on emit
  let called = false
  eventHub.on('xxx', (data) => {
    called = true
    console.assert(data === '订阅数据')
  })
  eventHub.emit('xxx', '订阅数据')
  setTimeout(() => {
    console.assert(called === true)
    console.log(message)
  }, 1000);
}


const test3: TestCase = (message) => {
  const eventHub = new EventHub()
  let called = false
  const fn = () => {
    called = true
  }
  eventHub.on('yyy', fn)
  eventHub.off('yyy', fn)
  eventHub.emit('yyy')
  setTimeout(() => {
    console.assert(called === false)
    console.log(message)
  }, 1000);
}

test1('EventHub 可以创建对象')
test2('.on 之后 .emit，会触发 .on 的函数')
test3('.off 有用')