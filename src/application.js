const EventEmitter = require('events');
const http = require('http');
const Stream = require('stream');
const mime = require('mime')

const context = require('./context')
const request = require('./request')
const response = require('./response')

class Koa extends EventEmitter{
  constructor(){
    super();
    this.middlewares = [];

    this.context = Object.create(context);
    this.request = Object.create(request);
    this.response = Object.create(response);
  }

  createContext(req, res){
    let ctx = this.context;
    ctx.request = request;
    ctx.response = response;

    ctx.req = ctx.request.req = req;
    ctx.res = ctx.response.res = res;
    return ctx;
  }

  compose(ctx){
    const dispatch = (index) => {
      let middle = this.middlewares[index];
      if(!middle) return Promise.resolve();
      return Promise.resolve(middle(ctx, () => dispatch(index+1)))
    }

    return dispatch(0)
  }

  handleServer(req, res) {
    let ctx = this.createContext(req, res)
    res.statusCode = 404;
    let promise =this.compose(ctx)
    promise.then( () => {
      console.log('中间件全部走完');
      let body = ctx.body;
      if(typeof body === 'undefined'){
        res.end('not found')
      }
      else if(body instanceof Stream){
        res.setHeader('Content-Type', 'text/plain;charset=utf8')
        body.pipe(res)
      }
      else if(typeof body === 'object'){
        res.setHeader('Content-Type', 'application/json;charset=utf8');
        res.end(JSON.stringify(body))
      }
      else{
        res.end(''+ body)
      }
    }, (err) => {
      this.emit('error', err)
    })
  }

  use(fn){
    this.middlewares.push(fn)
  }

  listen(...args){
    let server = http.createServer(this.handleServer.bind(this));
    server.listen(...args)
  }
}

module.exports = Koa;
