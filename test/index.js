const Koa = require('../src/application');
const Router = require('../middleware/router')

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

router.get('/server',async (ctx, next) => {
  
  let num = await logger();
  console.log(num)
  ctx.body = num
})

// app.use( async (ctx, next) => {
//   // ctx.body = '2222'
//   console.log(222)
// })

app.use(router.routes());


app.listen(3000, () => {
  console.log('server on', 3000)
})


