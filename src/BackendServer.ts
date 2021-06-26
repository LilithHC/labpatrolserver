import * as Koa from 'koa'
import * as Router from 'koa-router'
import * as bodyParser from 'koa-bodyparser'
import logger from './logger'
import * as cors from 'koa2-cors';

export default class BackendServer  {
  private name:string;
  private port:number;
  private routeCallList:any[]
  constructor(port:number) {
    this.name = '服务'
    this.port = port
    this.routeCallList = []
  }

  registRouteCall(routeCall:any){
    this.routeCallList.push(routeCall)
  }

  async run() {
    const app = new Koa()
    app.use(bodyParser())
    let router = new Router()

    for (let ii = 0; ii < this.routeCallList.length; ii++) {
      if (this.routeCallList[ii].type == 'get') {
        router.get(this.routeCallList[ii].route, this.routeCallList[ii].callBack)

      }else if (this.routeCallList[ii].type == 'post') {
        router.post(this.routeCallList[ii].route, this.routeCallList[ii].callBack)

      }else {
        logger.error(`unsupported type ${this.routeCallList[ii].type}`)

      }

    }

    router.get('/', async (ctx, next) => {
      ctx.body = '<h1>^_^</h1>'
      

    })
    router.get('/sender', async (ctx, next) => {
      ctx.status = 200;
      let url = ctx.url;
      let ctx_query = ctx.query;
      let ctx_querystring = ctx.querystring;
      ctx.body = {
          url: url,
          query: ctx_query,
          queryString: ctx_querystring,
      }
        
      })

    router.get('/left', async(ctx, next)=> {

      

    })
    router.post('/login', async (ctx, next) => {
      ctx.set('Content-Type', 'application/json')
      try {
        let data = ctx.request.body
        // let result = await this.login.run(data) || {}
        let result = {result:'OK'}
        // ctx.set('set-cookie', _.get(result, 'cookies', []).map(cookie => typeof (cookie) === 'string' ? cookie : `${cookie.name}=${cookie.value}`).join('; '))
        ctx.response.body = result;
      } catch(e) {
        console.log('error handle post')
      }
    })
    app.use(router.routes())
    app.use(cors())
    app.listen(this.port, () => {
      console.log(`服务已运行：http://127.0.0.1:${this.port}`)
    })
  }
}





