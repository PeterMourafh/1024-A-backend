import mysql, { type RowDataPacket, type ResultSetHeader } from 'mysql2/promise';
import express from 'express';
import connection from './mysql_connection.js'
import MysqlErrorHandler from './mysql_error_handler.js'
import cors from 'cors'
const app = express()
app.use(cors())
app.use(express.json())

interface IPessoa extends RowDataPacket {
    id: number,
    nome: string
}

interface IProduto extends RowDataPacket {
    id: number,
    nome: string,
    categoria: string,
    preco: number,
    data_criacao: Date,
    data_modificacao: Date,
}

app.post("/pessoas", async (req, res) => {
    const { id, nome, cidade, idade } = req.body

    if (id == '' || id == null || nome == null || nome == '') {
        return res.status(400).json({
            mensagem: "Dados enviados no formato errado. Confira o JSON!"
        })
    }

    try {
        const [result] =
            await connection.execute<ResultSetHeader>(
                'INSERT INTO clientes VALUES (?,?,?,?)',
                [id, nome, cidade, idade ]
            )

        if (result.affectedRows === 0)
            return res.status(500).json({
                mensagem: "Erro ao inserir!"
            })

        return res.status(201).json({
            mensagem: "Sucesso ao inserir!"
        })

    } catch (err) {
        new MysqlErrorHandler(err, res).validar()
    }
})

app.post("/cadastro_produto_v2", async (req, res) => {
    const { id, nome, categoria, preco} = req.body

    if (!id || !nome || !categoria || !preco) {
        return res.status(400).json({ mensagem: "JSON inválido!" })
    }

    try {
        const data_criacao = new Date()
        const data_modificacao = null
        const [result] =
            await connection.execute<ResultSetHeader>(
                'INSERT INTO produtos VALUES (?,?,?,?)',
                [id, nome, categoria, preco]
            )
            


        if (result.affectedRows === 0)
            return res.status(500).json({ mensagem: "Erro ao inserir!" })

        return res.status(201).json({ mensagem: "Sucesso ao inserir!" })

    } catch (err) {
        new MysqlErrorHandler(err, res).validar()
    }
})

app.get("/listar_produtos", async (req, res) => {
    try {
        const [dados] =
            await connection.execute<IProduto[]>('SELECT * FROM produto')
        res.status(200).json(dados)
    } catch (err) {
        new MysqlErrorHandler(err, res).validar()
    }
})

app.get("/listar_produtos_informatica", async (req, res) => {
    try {
        const [dados] =
            await connection.execute<IProduto[]>(
                'SELECT * FROM produto WHERE categoria = "informatica"'
            )
        res.status(200).json(dados)
    } catch (err) {
        new MysqlErrorHandler(err, res).validar()
    }
})

app.get("/listar_produtos_caros", async (req, res) => {
    try {
        const [dados] =
            await connection.execute<IProduto[]>(
                'SELECT * FROM produto WHERE preco > 100'
            )
        res.status(200).json(dados)
    } catch (err) {
        new MysqlErrorHandler(err, res).validar()
    }
})

app.get("/cliente_data_pedido", async (req, res) => {
    try {
        const [dados] = await connection.execute(`
            SELECT c.nome, p.datapedido
            FROM clientes c
            INNER JOIN pedidos p
            ON c.idclientes = p.clientes_idclientes
        `)

        res.json(dados)
    } catch (err) {
        new MysqlErrorHandler(err, res).validar()
    }
})

app.get("/pedidos_2026", async (req, res) => {
    try {
        const [dados] = await connection.execute(`
            SELECT 
                c.idclientes,
                c.nome,
                c.cidade,
                c.idade,
                p.idpedidos,
                p.datapedido
            FROM clientes c
            INNER JOIN pedidos p
            ON c.idclientes = p.clientes_idclientes
            WHERE YEAR(p.datapedido) = 2026
        `)

        res.json(dados)
    } catch (err) {
        new MysqlErrorHandler(err, res).validar()
    }
})

app.get("/quantidade_pedidos", async (req, res) => {
    try {
        const [dados]: any = await connection.execute(`
            SELECT COUNT(*) as quantidade_pedidos FROM pedidos
        `)

        res.json(dados[0])
    } catch (err) {
        new MysqlErrorHandler(err, res).validar()
    }
})

app.get("/quantidade_pedidos_clientes", async (req, res) => {
    try {
        const [dados] = await connection.execute(`
            SELECT 
                c.nome,
                COUNT(p.idpedidos) as quantidade_pedidos
            FROM clientes c
            LEFT JOIN pedidos p
            ON c.idclientes = p.clientes_idclientes
            GROUP BY c.idclientes, c.nome
        `)

        res.json(dados)
    } catch (err) {
        new MysqlErrorHandler(err, res).validar()
    }
})

app.listen(8000, () => {
    console.log("Servidor rodando na porta 8000 ")
})