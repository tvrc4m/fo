var FIBOS = require("fibos.js");
var config= require("./config");
var opt=require("optimist")

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
        buyram_usage()
        help()
        if(check_num(opt.argv.fo)){
            usage()
        }
        fibos.buyram(foaccount,foaccount,opt.argv.fo+".0000 FO").then(data=>{
            console.log(data)
        })
        break;
    case 'sellram':
        sellram_usage()
        help()
        if(check_num(opt.argv.b) || check_num(opt.argv.k) || check_num(opt.argv.m)){
            usage()
        }
        var total=0
        if(opt.argv.k!==true && opt.argv.k>0){
            total*=1024*opt.argv.k
        }else if(opt.argv.m!==true && opt.argv.m>0){
            total=1024*1024*opt.argv.m
        }else{
            total=opt.argv.b
        }
        fibos.sellram(foaccount,total).then(data=>{
            console.log(data)
        })
    case 'fo2eos':
        fo2eos_usage()
        help()
        if(check_num(opt.argv.fo)){
            usage()
        }
        fibos.contract("eosio.token").then(ctx=>{
            var result = ctx.exchange(foaccount, opt.argv.fo+".0000 FO@eosio", `0.0000 EOS@eosio`, `exchange FO to EOS`, {
                authorization: foaccount
            }).then(data=>{
                console.log(data)
            });
        })
        break;
    case 'eos2fo':
        eos2fo_usage()
        help()
        if(check_num(opt.argv.eos)){
            usage()
        }
        fibos.contract("eosio.token").then(ctx=>{
            var result = ctx.exchange(foaccount, opt.argv.eos+".0000 EOS@eosio", `0.0000 FO@eosio`, `exchange EOS to FO`, {
              authorization: foaccount
          }).then(data=>{
              console.log(data)
          })
            console.log(result);
        })
        break;
    case 'transfer':
        transfer_usage()
        help()
        if(check_num(opt.argv.eos)){
            usage()
        }
        fibos.transfer(foaccount,"fiboscouncil",opt.argv.eos+".0000 EOS",eosaccount).then(data=>{
            console.log(data)
        })
        break;
    case 'delegate':
        delegate_usage()
        help()
        if((opt.argv.net==true || opt.argv.net<=0) && (opt.argv.cpu==true || opt.argv.cpu<=0)){
            usage()
        }
        fibos.delegatebw(foaccount,"eostonystark",opt.argv.net+".0000 FO",opt.argv.cpu+".0000 FO",0).then(data=>{
            console.log(data)
        })
        break;
    case 'info':
        fibos.getTableRows(true, "eosio.token", foaccount, "accounts").then(res=>{
            for(index in res){
              console.log(res[index])
            }
        })
        break;
    default:
        global_usage()
        usage()
        break;
}

function global_usage(){
    opt.usage("Usage:$0 buyram|sellram|fo2eos|eos2fo|transfer|delegate")
}

function buyram_usage(){
    opt.usage("Usage:$0 buyram -fo fo count").demand(['fo']).describe("fo","fo数量")
}

function sellram_usage(){
    opt.usage("Usage:$0 sellram -b|k|m|").describe('b',"单位Byte").describe('k',"单位KB").describe('m',"单位M")
}

function fo2eos_usage(){
    opt.usage("Usage:$0 fo2eos --fo fo count").demand("fo").describe("fo","fo数量")
}

function eos2fo_usage(){
    opt.usage("Usage:$0 eos2fo --eos eos count").demand("eos").describe("eos","eos数量")   
}

function transfer_usage(){
    opt.usage("Usage:$0 transfer --eos eos count").demand("eos").describe("eos","eos数量")   
}

function delegate_usage(){
    opt.usage("Usage:$0 delegate --net fo count --cpu fo count").demand(["net","cpu"]).describe("net","抵押NET数量").describe("cpu","抵押CPU数量")   
}

function check_num(num){
    if(num===true || num<=0){
        usage()
    }
}

function help(){
    if(opt.argv.h || opt.argv.help){
        usage()
    }
}

function usage(){
    console.log(opt.help())
    process.exit()
}