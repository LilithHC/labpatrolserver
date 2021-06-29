import BackendServer from "./BackendServer"
import {Context} from 'koa'
import  logger from './logger.js'
import {LabDataFetch} from "./LabDataFetch"
import {TableSchema} from "./DataStore"
import { DBType } from "./LabPatrolPub"

type FetchResponse = {
    code: number,
    message: {
        totalCount: number,
        resCount:number,
        res:TableSchema[]
    }
}
class LabPatrolServer extends BackendServer {
    labData:LabDataFetch|undefined;
    eachFetch:number = 100
    constructor(port:number) {
        super(port)
    }

    async loadTableInfo() {
        this.labData = new LabDataFetch()
        await this.labData.openDb('../labpatrol/labpatrol.db')


    }

    async queryData(dbType: number, filter: string):Promise<TableSchema[]> {
        let rows:TableSchema[] = []
        switch(dbType) {
            case DBType.DBType_AXOS_CARD:
                rows = await this.labData?.queryAxosCard() as TableSchema[]
                break;
            case DBType.DBType_EXA_CARD:
                rows = await this.labData?.queryExaCard() as TableSchema[]
                break;
            case DBType.DBType_AXOS_ONT:
                rows = await this.labData?.queryAxosOnt() as TableSchema []
                break;
            case DBType.DBType_EXA_ONT:
                rows = await this.labData?.queryExaOnt() as TableSchema[]
                break;
        }

        if (filter === '') {
            return rows
        }
        let filterRow:TableSchema[] = []
        for (let ii = 0; ii < rows.length; ii++) {
            for (let key in rows[ii]) {
                if (rows[ii][key].toLowerCase().indexOf(filter.toLowerCase()) != -1) {
                    filterRow.push(rows[ii])
                    break
                }
            }
        }
        return filterRow
    }

    async init() {
        let that = this;
        await this.loadTableInfo()
        // http://127.0.0.1:3721/exacard?pageNum=1&eachFetch=50
        let fetchExaCallBack = async function (ctx:Context, next:any) {
            ctx.status = 200;
            let ctxQuery = ctx.query;
            let startIdx = 0;
            let eachFetch = that.eachFetch;
            let filter = ''
            // console.log(ctx)
            if (ctxQuery.eachFetch) {
                eachFetch = +ctxQuery.eachFetch;
            }
            // start from 0
            if (ctxQuery.pageNum) {
                startIdx = (+ctxQuery.pageNum - 1) * eachFetch;
            }

            if (ctxQuery.filter) {
                filter = ctxQuery.filter as string
            }

            ctx.set('Content-Type', 'application/json')
            ctx.set("Access-Control-Allow-Origin", "*");
            try {
                // let result = await this.login.run(data) || {}

                let rows = await that.queryData(DBType.DBType_EXA_CARD, filter) as TableSchema[]
                let res:TableSchema[] =[]
                let resCount = 0;
                let totalCount = 0;
                if (rows && rows.length > 0 && startIdx < rows.length){
                    totalCount = rows.length
                    for (let jj = startIdx; jj < startIdx + eachFetch && jj < rows.length; jj++) {
                        res.push(rows[jj])
                        resCount++;
                    }
                }
                let result:FetchResponse = {
                    code:200, 
                    message: {
                        totalCount: totalCount,
                        resCount:resCount,
                        res:res
                    }
                }
                // ctx.set('set-cookie', _.get(result, 'cookies', []).map(cookie => typeof (cookie) === 'string' ? cookie : `${cookie.name}=${cookie.value}`).join('; '))
                ctx.response.body = result;
            } catch (e) {
                logger.error('error handle fetch get')
            }
        }
        this.registRouteCall({ type: 'get', route: '/exacard', callBack: fetchExaCallBack })

        let fetchAxosCallBack = async function (ctx:Context, next:any) {
            ctx.status = 200;
            let ctxQuery = ctx.query;
            let startIdx = 0;
            let eachFetch = that.eachFetch;
            let filter = ''
            // console.log(ctx)
            if (ctxQuery.eachFetch) {
                eachFetch = +ctxQuery.eachFetch;
            }
            // start from 0
            if (ctxQuery.pageNum) {
                startIdx = (+ctxQuery.pageNum - 1) * eachFetch;
            }

            if (ctxQuery.filter) {
                filter = ctxQuery.filter as string
            }
            ctx.set('Content-Type', 'application/json')
            ctx.set("Access-Control-Allow-Origin", "*");
            try {
                // let result = await this.login.run(data) || {}

                let rows = await that.queryData(DBType.DBType_AXOS_CARD, filter) as TableSchema[]
                let res:TableSchema[] =[]
                let resCount = 0;
                let totalCount = 0;
                if (rows && rows.length > 0 && startIdx < rows.length){
                    totalCount = rows.length
                    for (let jj = startIdx; jj < startIdx + eachFetch && jj < rows.length; jj++) {
                        res.push(rows[jj])
                        resCount++;
                    }
                }
                let result:FetchResponse = {
                    code:200, 
                    message: {
                        totalCount: totalCount,
                        resCount:resCount,
                        res:res
                    }
                }
                // ctx.set('set-cookie', _.get(result, 'cookies', []).map(cookie => typeof (cookie) === 'string' ? cookie : `${cookie.name}=${cookie.value}`).join('; '))
                ctx.response.body = result;
            } catch (e) {
                logger.error('error handle fetch get')
            }
        }
        this.registRouteCall({ type: 'get', route: '/axoscard', callBack: fetchAxosCallBack })  

        let fetchExaOntCallBack = async function (ctx:Context, next:any) {
            ctx.status = 200;
            let ctxQuery = ctx.query;
            let startIdx = 0;
            let eachFetch = that.eachFetch;
            let filter = ''
            // console.log(ctx)
            if (ctxQuery.eachFetch) {
                eachFetch = +ctxQuery.eachFetch;
            }
            // start from 0
            if (ctxQuery.pageNum) {
                startIdx = (+ctxQuery.pageNum - 1) * eachFetch;
            }

            if (ctxQuery.filter) {
                filter = ctxQuery.filter as string
            }
            
            ctx.set('Content-Type', 'application/json')
            ctx.set("Access-Control-Allow-Origin", "*");
            try {
                // let result = await this.login.run(data) || {}

                let rows = await that.queryData(DBType.DBType_EXA_ONT, filter) as TableSchema[]
 
                let res:TableSchema[] =[]
                let resCount = 0;
                let totalCount = 0;
                if (rows && rows.length > 0 && startIdx < rows.length){
                    totalCount = rows.length
                    for (let jj = startIdx; jj < startIdx + eachFetch && jj < rows.length; jj++) {
                        res.push(rows[jj])
                        resCount++;
                    }
                }
                let result:FetchResponse = {
                    code:200, 
                    message: {
                        totalCount: totalCount,
                        resCount:resCount,
                        res:res
                    }
                }
                // ctx.set('set-cookie', _.get(result, 'cookies', []).map(cookie => typeof (cookie) === 'string' ? cookie : `${cookie.name}=${cookie.value}`).join('; '))
                ctx.response.body = result;
            } catch (e) {
                logger.error('error handle fetch get')
            }
        }

        this.registRouteCall({ type: 'get', route: '/exaont', callBack: fetchExaOntCallBack }) 

        let fetchAxosOntCallBack = async function (ctx:Context, next:any) {
            ctx.status = 200;
            let ctxQuery = ctx.query;
            let startIdx = 0;
            let eachFetch = that.eachFetch;
            let filter = ''
            // console.log(ctx)
            if (ctxQuery.eachFetch) {
                eachFetch = +ctxQuery.eachFetch;
            }
            // start from 0
            if (ctxQuery.pageNum) {
                startIdx = (+ctxQuery.pageNum - 1) * eachFetch;
            }

            if (ctxQuery.filter) {
                filter = ctxQuery.filter as string
            }
            ctx.set('Content-Type', 'application/json')
            ctx.set("Access-Control-Allow-Origin", "*");
            try {
                // let result = await this.login.run(data) || {}
                let rows = await that.queryData(DBType.DBType_AXOS_ONT, filter) as TableSchema[]
 
                let res:TableSchema[] =[]
                let resCount = 0;
                let totalCount = 0;
                if (rows && rows.length > 0 && startIdx < rows.length){
                    totalCount = rows.length
                    for (let jj = startIdx; jj < startIdx + eachFetch && jj < rows.length; jj++) {
                        res.push(rows[jj])
                        resCount++;
                    }
                }
                let result:FetchResponse = {
                    code:200, 
                    message: {
                        totalCount: totalCount,
                        resCount:resCount,
                        res:res
                    }
                }
                // ctx.set('set-cookie', _.get(result, 'cookies', []).map(cookie => typeof (cookie) === 'string' ? cookie : `${cookie.name}=${cookie.value}`).join('; '))
                ctx.response.body = result;
            } catch (e) {
                logger.error('error handle fetch get')
            }
        }

        this.registRouteCall({ type: 'get', route: '/axosont', callBack: fetchAxosOntCallBack }) 

        let updateCheckCallBack = async function (ctx:Context, next:any) {
            ctx.status = 200;
            let response = {}

            let data = ctx.request.body

            ctx.set('Content-Type', 'application/json')
            ctx.set("Access-Control-Allow-Origin", "*");
            try {

                ctx.response.body = response;
            } catch (e) {
                logger.error('error handle record update')
            }
        }

        this.registRouteCall({ type: 'post', route: '/update', callBack: updateCheckCallBack })

    }

}
if (__filename === require.main?.filename) {
    (async () => {
        let bkend = new LabPatrolServer(3721)
        await bkend.init();

        await bkend.run();

    })()
}


