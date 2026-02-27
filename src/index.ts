// import express from 'express'

// const app = express();
// app.use(express.json())

// app.get("/", (req, res) => {
//    res.send("Olá, Mundo!")
// });

// app.listen(8000, () => {
//     console.log("Meu servidor está rodando na porta 8000");
// });


///////////////////////

let numero:number = 10 
let palavra:string = "Algum texto";
let bol:boolean = true

let x: number | string = 10
x = "Guilherme"

let vetor:number[] = [1,2,4,5]
vetor[2] = 10
vetor.push(6)
console.log(vetor)
//vetor = [5,6,7,8,9]


//Vetor de string

let vetorString:string[] = ["a","b","ab"]

type Pessoa = {id?:number; nome:string; idade:number}

const pessoa:Pessoa={
    id:1,
    nome:"Guilherme",
    idade:18,
}
const pessoa2:Pessoa={
    id:1,
    nome:"Guilherme",
    idade:18,
}
pessoa.nome = "Terezinho"

const cloudVoadora = [1,2,3,4 ]
const batataVoadora:undefined = undefined

