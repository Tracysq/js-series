let cache = []
function deepClone(source) {
  if(source instanceof Object){
    let cachedDist = findCache(source)
    if(cachedDist){
      console.log('有缓存')
      return cachedDist
    }else {
      console.log('没缓存')
      let dist
      if(source instanceof Array){
        dist = new Array()
      }else if(source instanceof Function){
        dist = function () {
          return source.apply(this, arguments)
        }
      }else if(source instanceof RegExp){
        dist = new RegExp(source.source, source.flags)
      }else if(source instanceof Date){
        dist = new Date(source)
      }else {
        dist = new Object()
      }
      cache.push([source, dist])
      for (let key in source) {
        if(source.hasOwnProperty(key)){
          dist[key] = deepClone(source[key])
        }
      }
      return dist
    }
  }
  return source
}

function findCache(source) {
  for(let i = 0; i < cache.length; i++){
    if(cache[i][0] === source){
      return cache[i][1]
    }
  }
  return undefined
}

module.exports = deepClone