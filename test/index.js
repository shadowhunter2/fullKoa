const Koa = require('../src/application');
const Router = require('../middleware/router')
const bodyParser = require('../middleware/bodyparser')

// const Koa = require('koa');
// const Router = require('koa-router');
const fs = require('fs');
const path = require('path');

const app = new Koa();
const router = new Router();

function logger() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('logger')
    }, 1800);
  })
}

app.use( async (ctx, next) => {
  ctx.a =10
  await next();
})

app.use(bodyParser())

app.use(router.routes());

router.get('/server',async (ctx, next) => {
  
  let num = await logger();
  console.log(num)
  ctx.body = num + ctx.a
})

router.get('/add', async (ctx, next) => {
  ctx.body = 'add'
})

router.post('/add', async (ctx, next) => {
  console.log(ctx.request.body)
  ctx.body = 'add'
})

app.use( () => {
  console.log('路由后面的中间件');
})

app.on('error', (err) => {
  console.log('err', err)
})

app.listen(3000, () => {
  console.log('server on', 3000)
})


