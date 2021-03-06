
const methods = require('methods')

class Router{
  constructor(){
    this._routes = [];
  }

  compose(routes, ctx){
    function dispatch(index){
      let route = routes[index];
      if(!route) return Promise.resolve()

       return Promise.resolve(route.cb(ctx, () => next(index + 1)))
    }

    return dispatch(0)
  }

  routes(){
    return async (ctx, next) => {
      let routes = this._routes.filter( route => 
        route.method === ctx.method && ctx.path === route.path
      )
      await this.compose(routes, ctx, next);
      await next()
    }
  }
}

[...methods].forEach( method => {
  Router.prototype[method] = function (path, cb) {
    this._routes.push({ method, path, cb })
  }
})

module.exports = Router;