import {TableSchema, DataStore} from "./DataStore"
import {DBType, LabPatroAny} from "./LabPatrolPub"

export interface MonthDict {
    [attr: string]: number
}

export interface rMonthDict {
    [attr: number]: string
}

let mond:MonthDict = {
    'Jan':0,
    'Feb':1,
    'Mar':2,
    'Apr':3,
    'May':4,
    'Jun':5,
    'Jul':6,
    'Aug':7,
    'Sep':8,
    'Oct':9,
    'Nov':10,
    'Dec':11
}

let rmond:rMonthDict = {
    0:'Jan',
    1:'Feb',
    2:'Mar',
    3:'Apr',
    4:'May',
    5:'Jun',
    6:'Jul',
    7:'Aug',
    8:'Sep',
    9:'Oct',
    10:'Nov',
    11:'Dec'
}

let offaxoscardSchema: TableSchema = {
    'address': '',
    'platform': '',
    'cardPosition': '',
    'PROVISION TYPE':'',
    'CARD STATE': '',
    'CARD TYPE': '',
    'MODEL': '',
    'SERIAL NO': '',
    'SOFTWARE VERSION':'',
    'image-partition':'',
    'full-release-version':'',
    'live-release-version':'',
    'image-type':'',
    'patches':'',
    'features':'',
    'distro':'',
    'schema':'',
    'timestamp':'',
    'details': '',
    'recentUser': '',
    'offline': ''
}

// let offexacardSchema: TableSchema = {
//     'address': '',
//     'platform': '',
//     'cardPosition': '',
//     'Provisioned Type':'',
//     'Actual Type': '',
//     'Status': '',
//     'Alarms (Cr Mj Mn Wn In)': '',
//     'Present':'',
//     'Running Vers.':'',
//     'Committed Vers.':'',
//     'Alt. Vers.':'',
//     'recentUser': '',
//     'offline': ''
// }

export class LabDataFetch {
    dbName:string='labpatrol.db'
    dbStore:DataStore|undefined
    currAxosCardTbName = ''
    currAxosOntTbName =''
    currExaCardTbName =''
    currExaOntTbName =''
    OffAxosCardTbName = ''
    OffExaCardTbName =''
    availableDescTableName = 'tbAvailableDesc'
    constructor() {
        this.dbStore = new DataStore()

    }

    async openDb(dbName:string) {
        this.dbName = dbName
        await this.dbStore?.createDb(dbName)

    }

    async getCurrentDbName(dbType:number):Promise<string>{
        let tableItem:TableSchema = {'id':"1",
                                        'axosCard':"",
                                         'axosOnt':"", 
                                         'exaCard':"",
                                        'exaOnt':"",
                                        'axosmodule':"",
                                        'examodule':"",
                                        "axoslldp":"",
                                        "exalldp":""}
        let rows = await this.dbStore?.queryAll(this.availableDescTableName)      
        if (!rows || (rows as []).length == 0) {
            return ''
        }

        let rowString = rows as TableSchema[]
        
        switch (dbType) {
            case DBType.DBType_AXOS_CARD:
                return rowString[0]['axosCard']
                break;
            case DBType.DBType_AXOS_ONT:
                return rowString[0]['axosOnt']
                break;
            case DBType.DBType_EXA_CARD:
                return rowString[0]['exaCard']
                break;
            case DBType.DBType_EXA_ONT:
                return rowString[0]['exaOnt']
                break;
            case DBType.DBType_AXOS_MODULE:
                return rowString[0]['axosModule']
                break;
            case DBType.DBType_EXA_MODULE:
                return rowString[0]['exaModule']
               break;                
            case DBType.DBType_AXOS_LLDP:
                return rowString[0]['axosLldp']
                break;
            case DBType.DBType_EXA_LLDP:
                return rowString[0]['exaLldp']
                 break;     
            case DBType.DBType_OFF_AXOS_CARD:
                return rowString[0]['offaxoscard']
                 break;           
            default:
                break;
        }
        return ''

    }

    async queryExaCard() {
        let exaCard:TableSchema[] =[]
        let tableName = await this.getCurrentDbName(DBType.DBType_EXA_CARD)
        if (tableName === '') {
            return exaCard
        }

        exaCard = await this.dbStore?.queryAll(tableName) as TableSchema[]
        return exaCard;
    }

    async queryAxosCard() {
        let axosCard:TableSchema[] =[]
        let tableName = await this.getCurrentDbName(DBType.DBType_AXOS_CARD)
        if (tableName === '') {
            return axosCard
        }
        axosCard = await this.dbStore?.queryAll(tableName) as TableSchema[]
        return axosCard;
    }    

    async queryOffAxosCard() {
        let offaxosCard:TableSchema[] =[]
        let tableName = await this.getCurrentDbName(DBType.DBType_OFF_AXOS_CARD)
        if (tableName === '') {
            return offaxosCard
        }
        offaxosCard = await this.dbStore?.queryAll(tableName) as TableSchema[]
        return offaxosCard;
    } 

    async queryAxosOnt() {
        let axosOnt:TableSchema[] =[]
        let tableName = await this.getCurrentDbName(DBType.DBType_AXOS_ONT)
        if (tableName === '') {
            return axosOnt
        }
        axosOnt = await this.dbStore?.queryAll(tableName) as TableSchema[]
        return axosOnt;
    }      
    
    async queryExaOnt() {
        let exaOnt:TableSchema[] =[]
        let tableName = await this.getCurrentDbName(DBType.DBType_EXA_ONT)
        if (tableName === '') {
            return exaOnt
        }
        exaOnt = await this.dbStore?.queryAll(tableName) as TableSchema[]
        return exaOnt;
    }       
    
    async queryExaModule() {
        let exaOnt:TableSchema[] =[]
        let tableName = await this.getCurrentDbName(DBType.DBType_EXA_MODULE)
        if (tableName === '') {
            return exaOnt
        }
        exaOnt = await this.dbStore?.queryAll(tableName) as TableSchema[]
        return exaOnt;
    }    
    
    async queryAxosModule() {
        let exaOnt:TableSchema[] =[]
        let tableName = await this.getCurrentDbName(DBType.DBType_AXOS_MODULE)
        if (tableName === '') {
            return exaOnt
        }
        exaOnt = await this.dbStore?.queryAll(tableName) as TableSchema[]
        return exaOnt;
    }     
    
    async queryAxosLldp() {
        let exaOnt:TableSchema[] =[]
        let tableName = await this.getCurrentDbName(DBType.DBType_AXOS_LLDP)
        if (tableName === '') {
            return exaOnt
        }
        exaOnt = await this.dbStore?.queryAll(tableName) as TableSchema[]
        return exaOnt;
    }   
    
    async queryExaLldp() {
        let exaOnt:TableSchema[] =[]
        let tableName = await this.getCurrentDbName(DBType.DBType_EXA_LLDP)
        if (tableName === '') {
            return exaOnt
        }
        exaOnt = await this.dbStore?.queryAll(tableName) as TableSchema[]
        return exaOnt;
    }       

    async queryLatestAxosCard(period:number) {
        let rows = await this.dbStore?.queryLatestTbs() as TableSchema[]
        let axoscardtbs:string[] =[]
        let curdate = new Date()
        let curtime = curdate.getTime()
        this.OffAxosCardTbName = "offaxoscard" +curdate.getFullYear().toString()+rmond[curdate.getMonth()]+curdate.getDate().toString().padStart(2,'0')+curdate.getHours().toString().padStart(2,'0')+curdate.getMinutes().toString().padStart(2,'0')
        for(let i in rows){
            let tbName = rows[i]['name']
            if(tbName.indexOf('axoscard')==-1) continue
            let timestr = tbName.slice(8)
            let yy = +timestr.slice(0,4)
            let month = mond[timestr.slice(4,7)]
            let day = +timestr.slice(7,9)
            let hh = +timestr.slice(9,11)
            let mm = +timestr.slice(11,13)
            if(new Date().getFullYear()!=yy || new Date().getMonth()!=month) continue
            let tbtime = new Date(yy,month,day,hh,mm,0).getTime()
            if(curtime-tbtime>0 && period*3600*1000>=curtime-tbtime){
                axoscardtbs.push(tbName)
            }
        }
        axoscardtbs.sort(
            (tb1:string,tb2:string)=>{
                let timestr = tb1.slice(8)
                let yy = +timestr.slice(0,4)
                let month = mond[timestr.slice(4,7)]
                let day = +timestr.slice(7,9)
                let hh = +timestr.slice(9,11)
                let mm = +timestr.slice(11,13)
                let tbtime1 = new Date(yy,month,day,hh,mm,0).getTime()
                timestr = tb2.slice(8)
                yy = +timestr.slice(0,4)
                month = mond[timestr.slice(4,7)]
                day = +timestr.slice(7,9)
                hh = +timestr.slice(9,11)
                mm = +timestr.slice(11,13)
                let tbtime2 = new Date(yy,month,day,hh,mm,0).getTime()
                return tbtime1 - tbtime2
            }    
        );
        return axoscardtbs;
    }

    async queryLatestExaCard(period:number) {
        let rows = await this.dbStore?.queryLatestTbs() as TableSchema[]
        let exacardtbs:string[] =[]
        let curdate = new Date()
        let curtime = curdate.getTime()
        this.OffAxosCardTbName = "offexacard" +curdate.getFullYear().toString()+rmond[curdate.getMonth()]+curdate.getDate().toString().padStart(2,'0')+curdate.getHours().toString().padStart(2,'0')+curdate.getMinutes().toString().padStart(2,'0')
        for(let i in rows){
            let tbName = rows[i]['name']
            if(tbName.indexOf('exacard')==-1) continue
            let timestr = tbName.slice(7)
            let yy = +timestr.slice(0,4)
            let month = mond[timestr.slice(4,7)]
            let day = +timestr.slice(7,9)
            let hh = +timestr.slice(9,11)
            let mm = +timestr.slice(11,13)
            if(new Date().getFullYear()!=yy || new Date().getMonth()!=month) continue
            let tbtime = new Date(yy,month,day,hh,mm,0).getTime()
            if(curtime-tbtime>0 && period*3600*1000>=curtime-tbtime){
                exacardtbs.push(tbName)
            }
        }
        exacardtbs.sort(
            (tb1:string,tb2:string)=>{
                let timestr = tb1.slice(7)
                let yy = +timestr.slice(0,4)
                let month = mond[timestr.slice(4,7)]
                let day = +timestr.slice(7,9)
                let hh = +timestr.slice(9,11)
                let mm = +timestr.slice(11,13)
                let tbtime1 = new Date(yy,month,day,hh,mm,0).getTime()
                timestr = tb2.slice(7)
                yy = +timestr.slice(0,4)
                month = mond[timestr.slice(4,7)]
                day = +timestr.slice(7,9)
                hh = +timestr.slice(9,11)
                mm = +timestr.slice(11,13)
                let tbtime2 = new Date(yy,month,day,hh,mm,0).getTime()
                return tbtime1 - tbtime2
            }    
        );
        return exacardtbs;
    }

    async getOfflineAxosCard(period:number) {
        let axoscardtbs = await this?.queryLatestAxosCard(period) as string []
        if(!axoscardtbs || axoscardtbs.length==0) return []
        let res:TableSchema[] = await this.dbStore?.queryAll(axoscardtbs[0]) as TableSchema[]
        let rows:TableSchema[][] = []
        for(let i=1;i<axoscardtbs.length;i++){
            let t = await this.dbStore?.queryAll(axoscardtbs[i]) as TableSchema[]
            t = t.filter(
                (row:TableSchema)=>{
                    return row['SERIAL NO'] != 'N/A'
                }
            );
            rows.push(t)
        }

        for(let i in res){
            let flag = true
            for(let j in rows){
                if(rows[j].length==0) continue
                if(rows[j].some((item:TableSchema)=>item['SERIAL NO']==res[i]['SERIAL NO'])){
                    flag = false
                    break
                }
            }
            if(flag) res[i]['offline'] = '1'
            else res[i]['offline'] = '0'
        }
        return res
    }

    // async getOfflineExaCard(period:number) {
    //     let exacardtbs = await this?.queryLatestExaCard(period) as string []
    //     if(!exacardtbs || exacardtbs.length==0) return []
    //     let res:TableSchema[] = await this.dbStore?.queryAll(exacardtbs[0]) as TableSchema[]
    //     let rows:TableSchema[][] = []
    //     for(let i=1;i<exacardtbs.length;i++){
    //         let t = await this.dbStore?.queryAll(exacardtbs[i]) as TableSchema[]
    //         rows.push(t)
    //     }

    //     for(let i in res){
    //         let flag = true
    //         for(let j in rows){
    //             if(rows[j].length==0) continue
    //             if(rows[j].some((item:TableSchema)=>item['address']==res[i]['address']&&item['cardPosition']==res[i]['cardPosition'])){
    //                 flag = false
    //                 break
    //             }
    //         }
    //         if(flag) res[i]['offline'] = '1'
    //         else res[i]['offline'] = '0'
    //     }
    //     return res
    // }
    
    async writeOfflineAxosCard(cardinfos:TableSchema[]) {
        await this.dbStore?.createDbTable(this.OffAxosCardTbName, offaxoscardSchema);
        cardinfos.forEach(async (cardinfo:TableSchema)=>{
            console.log(cardinfo)
            await this.dbStore?.insertData(this.OffAxosCardTbName, cardinfo)
        })
        let rows = await this.dbStore?.queryField(this.availableDescTableName,'offaxoscard')
        if(!rows || (rows as []).length==0){
            await this.dbStore?.addTableColumn(this.availableDescTableName,'offaxoscard');
        }
        let tbdata:TableSchema = {
            "id":"1",
            "offaxoscard":this.OffAxosCardTbName
        }
        let tbcond:TableSchema = {
            "id":"1"
        }
        await this.dbStore?.updateData(this.availableDescTableName,tbdata,tbcond)
    }


}


if (__filename === require.main?.filename) {
    (async () => {

        let labData = new LabDataFetch()
        await labData.openDb('./labpatrol.db')
        // let res = await labData?.getOfflineAxosCard(72) as TableSchema[]
        // await labData?.writeOfflineAxosCard(res)
        // console.log(res)
        // console.log(res.length)
        // for(let i in res){
        //     console.log(res[i])
        // }

        // let res = await labData?.queryLatestExaCard(24) 
        // console.log(res.length)
        // for(let i in res){
        //     console.log(res[i])
        // }

        // let rows = await labData.dbStore?.queryLatestTbs() as TableSchema[]
        // let tbTime = rows[10000]['name'].slice(7)
        // let year = +tbTime.slice(0,4)
        // let month = mond[tbTime.slice(4,7)]
        // let day = +tbTime.slice(7,9)
        // let hour = +tbTime.slice(9,11)
        // let mm = +tbTime.slice(11,13)
        // let tbDate = new Date(year,month,day,hour,mm,0).getTime()
        // console.log(tbTime,year,month,day,hour,mm)
        // console.log(tbDate)
        // if(24*3600*1000>=new Date(2022,9,24,12,49,0).getTime()-tbDate) console.log(new Date(2022,9,24,12,49,0).getTime()-tbDate)

        
        // let d1 = new Date().getTime()
        // let d2 = new Date(2023,8,9,0,30,20).getTime()
        // if(d1-d2<=24*3600*1000) console.log("777777")

        // let curtime = new Date().getUTCMonth()
        // console.log(curtime)

    })()    
}
