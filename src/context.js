const context = {};

function defineGet(obj, key){
  context.__defineGetter__(key, function(){
    return this[obj][key]
  })
}

function defineSet(obj, key){
  context.__defineSetter__(key, function(val){
    this[obj][key] = val
  })
}

defineGet('request', 'query')
defineGet('request', 'path')
defineGet('request', 'url')
defineGet('request', 'method')

defineGet('response', 'body')

defineSet('response', 'body')


module.exports = context;