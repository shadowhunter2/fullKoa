const querystring = require('querystring')

module.exports =  function parser(){
  return async function (ctx, next){
    await new Promise((resolve, reject) => {
      let arr = [];
      let req = ctx.req;
      req.on('data', function (chunk) {
        arr.push(chunk)
      })

      req.on('end', function () {
        let type = req.headers['content-type'];
        let res = Buffer.concat(arr).toString();
        if (type === 'application/x-www-form-urlencoded') {
          res = querystring.parse(res)
        }
        else if (type === 'application/json') {
          res = JSON.parse(res)
        }
        else {
          res = res;
        }
        ctx.request.body = res;
        resolve()
      })

      req.on('error', reject)
    })

    await next();
  }
}