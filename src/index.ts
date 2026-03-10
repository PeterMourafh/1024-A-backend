//conteúdo de hoje => Promisses


// Assincrona?
async function minhaPromessa():Promise<string>{
    const prom:Promise<string> = new Promise((resolve, reject)=>{
        setTimeout(()=>reject("Tere"),5000)
    })
    return prom
}

minhaPromessa().then((valor)=>console.log(valor)).catch((erro)=>console.log(erro))
console.log("Executei esse codigo")

try{
    const resultado = await minhaPromessa()
    console.log(resultado)
}
catch(erro){
    console.log(erro)
}


//Crie uma função que tenha 50% de chance de retornar tere após 5 segundos ou a função devolve o valor null function devolveTere()





