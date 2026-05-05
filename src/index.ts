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

app.get("/pessoas", async (req, res) => {
    try {
        const [dados] =
            await connection.execute<IPessoa[]>('SELECT * FROM pessoa')
        res.status(200).json(dados)
    } catch (err) {
        new MysqlErrorHandler(err, res).validar()
    }
})

app.post("/pessoas", async (req, res) => {
    const { id, nome } = req.body
    try {
        const [result] =
            await connection.execute<ResultSetHeader>(
                'INSERT INTO pessoa VALUES (?,?)',
                [id, nome]
            )

        if (result.affectedRows === 0)
            return res.status(500).json({ mensagem: "Erro ao inserir!" })

        return res.status(201).json({ mensagem: "Sucesso ao inserir!" })

    } catch (err) {
        new MysqlErrorHandler(err, res).validar()
    }
})

app.post("/cadastro_produto", async (req, res) => {
    const { id, nome, categoria, preco, data_criacao, data_modificacao } = req.body

    if (!id || !nome || !categoria || !preco || !data_criacao || !data_modificacao) {
        return res.status(400).json({ mensagem: "JSON inválido!" })
    }

    try {
        const [result] =
            await connection.execute<ResultSetHeader>(
                'INSERT INTO produto VALUES (?,?,?,?,?,?)',
                [id, nome, categoria, preco, data_criacao, data_modificacao]
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