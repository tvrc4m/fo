var FIBOS = require("fibos.js");
var config= require("./config");

var fibos = FIBOS({
    chainId: config.chainId,
    keyProvider: config.priKey,
    httpEndpoint: config.httpEndpoint,
    verbose: false,
    logger: {
        log: null,
        error: null
    }
})

var args=["default"];

if(process.argv.length>2){
    args=process.argv.splice(2)
}

function check_args(num,errmsg){
    if(args.length!=num){
        console.log(errmsg)
        process.exit()
    }
}

const eosaccount="eostonystark"
const foaccount="eostonystark"

switch(args[0]){
    case 'buyram':
        check_args(2,"需要输入购买内存的FO数量")
        fibos.buyram(foaccount,foaccount,args[1]+".0000 FO").then(data=>{
            console.log(data)
        })
        break;
    case 'sellram':
        check_args(2,"需要输入卖出的内存(单位为M)")
        fibos.sellram(foaccount,1024*1024*args[1]).then(data=>{
            console.log(data)
        })
    case 'fo2eos':
        check_args(2,"需要输入兑换成EOS的FO数量")
        fibos.contract("eosio.token").then(ctx=>{
            var result = ctx.exchange(foaccount, args[1]+".0000 FO@eosio", `0.0000 EOS@eosio`, `exchange FO to EOS`, {
                authorization: foaccount
            }).then(data=>{
                console.log(data)
            });
        })
        break;
    case 'eos2fo':
        check_args(2,"需要输入兑换成FO的EOS数量")
        fibos.contract("eosio.token").then(ctx=>{
            var result = ctx.exchange(foaccount, args[1]+".0000 EOS@eosio", `0.0000 FO@eosio`, `exchange EOS to FO`, {
              authorization: foaccount
          }).then(data=>{
              console.log(data)
          })
            console.log(result);
        })
        break;
    case 'transfer':
        check_args(2,"需要输入转账的EOS数量")
        fibos.transfer(foaccount,"fiboscouncil",args[1]+".0000 EOS",eosaccount).then(data=>{
            console.log(data)
        })
        break;
    case 'delegate':
        check_args(3,"需要输入抵押的NET和CPU的FO数量")
        fibos.delegatebw(foaccount,"eostonystark",args[1]+".0000 FO",args[2]+".0000 FO",0).then(data=>{
            console.log(data)
        })
        break;
    default:
        fibos.getTableRows(true, "eosio.token", foaccount, "accounts").then(res=>{
            for(index in res){
              console.log(res[index])
            }
        })
        break;
}
