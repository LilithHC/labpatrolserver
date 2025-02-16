export type IpPrefixInfo = {
    ipPrefix: string;
    subLenth:number;
    start: number;
    end: number;
};

export enum LabPatroType {
    LabPatrolType_AXOSCard = 0x1,
    LabPatrolType_E7Card = 0x2,
    LabPatrolType_ONT = 0x4,    
    LabPatrolType_Module = 0x8,
    LabPatrolType_Lldp = 0x10,
}

export enum DBType{
    DBType_AXOS_CARD = 1,
    DBType_EXA_CARD = 2,
    DBType_AXOS_ONT = 3,
    DBType_EXA_ONT = 4,
    DBType_AXOS_MODULE = 5,
    DBType_EXA_MODULE = 6,
    DBType_AXOS_LLDP = 7,
    DBType_OFF_AXOS_CARD = 8,
    DBType_EXA_LLDP
};

export interface LabPatroResult {
    cardInfo: LabPatroAny[]|undefined
    ontInfo:  LabPatroAny[]|undefined
    moduleInfo: LabPatroAny[]|undefined
}


export interface LabPatroAny {
    [attr: string]: string
}

export function getExaModuleHeader():string[] {
    return ["Connector type",
        "Vendor info",
       "Version info", 
        "Manufacturer",   
        "ManufacturerPartNo",
        "ManufacturerSerial",        
        "CLEI",                     
        "Link length"]
}
export function getAxosModuleHeader():string[] {
    return ["module-type", "identifier", "connector", "vendor-oui", 
    "vendor-part-number", "vendor-revision", "vendor-serial-number", "vendor-manufacture-date", "vendor-name",
    "wave-length", "bit-rate", "fiber-length-9-125-km"]
}

export function getExaOntHeader():string[] {
    return ['address',
          'platform',
          'Serial #', 'Vendor', 'Model', 
         'Product Code',   'CLEI',        "Registration ID",  "ONU MAC", "MTA MA C",
         "Current SW version",  "Alternate SW version",  "PON port"]
}

export function getAxosOntHeader():string[] {
    return ['address', 'platform' , 'VENDOR ID', 'SERIAL NUMBER',
     'REG ID' ,     'MODEL',      'CLEI' ,      'CURR VERSION',
       'ALT VERSION',   'ONU MAC ADDR',      'MTA MAC ADDR',       'PRODUCT CODE']
}

export function getAxosCard():string[] {
   // ['address', 'platform',  'cardPosition',  'PROVISION TYPE',  'CARD STATE',  'CARD TYPE'                                      'MODEL'       'SERIAL NO'     'SOFTWARE VERSION'  'image-partition'  'full-release-version'  'live-release-version'  'image-type'   'patches'     'features'                            distro                                  schema      timestamp              details           
    return []
}

export function sleepMs(timems:number) {
    return new Promise((resolve)=>{
        setTimeout(()=>{
            resolve(0)
        }, timems)
    })

}

export function sleepSecond(timems:number) {
    return new Promise((resolve)=>{
        setTimeout(()=>{
            resolve(0)
        }, timems*1000)
    })

}