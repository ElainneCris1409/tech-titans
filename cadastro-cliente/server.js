const express = require('express');
const mysql = require('mysql2/promise')
const app = express();

const PORT = process.env.PORT || 3000;

/*
Criar a conexao com a base de dados
*/
const pool = mysql.createPool({
    host: 'localhost',
    user: 'tonysoprano',
    password: '12345678',
    database: 'data_dev',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

app.use(express.json());

app.use(express.urlencoded({extended: true}));

/*
Cliente {nome, id, morada}
conta {id_cliente, id, saldo}
*/ 
let clientes = [];
let contas = [];

app.put('/cliente', async(req, res) => {
    try {
        const {id, nome, morada} = req.body;
        const connection = await pool.getConnection();
        const [result] = await connection.execute('UPDATE cliente SET nome = ?, morada = ? WHERE id = ?', [nome, morada, id]);
        connection.release();
        res.status(200).json({ message: 'Cliente atualizado com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar cliente:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.get('/clientes', async(req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows, fields] = await connection.execute('SELECT * FROM cliente');
        connection.release();
        res.json(rows); // Retorna os resultados da consulta como JSON
    } catch (error) {
        console.error('Erro ao obter clientes:', error);
        res.status(500).json({ error: 'Erro interno do servidor' }); // Retorna um status 500 em caso de erro
    }
});

app.get('/contas_clientes', async(req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows, fields] = await connection.execute('select cli.nome, co.id, co.saldo from cliente cli inner join CONTA co on cli.id = co.CLIENTE_iD');
        connection.release();
        res.json(rows); // Retorna os resultados da consulta como JSON
    } catch (error) {
        console.error('Erro ao obter clientes:', error);
        res.status(500).json({ error: 'Erro interno do servidor' }); // Retorna um status 500 em caso de erro
    }
});

app.post('/cliente', async(req, res) => {
    console.log(req.body);
    const {nome, morada} = req.body; // informações para colocar no postman no body
    try {
        if(nome !== null && morada !== null){
            const connection = await pool.getConnection();
            await connection.execute('INSERT INTO cliente (nome, morada) VALUES (?, ?)', [nome, morada]);
            connection.release();    
            res.json({sucess: true, message: 'cliente registado'});        
        }
    } catch (error) {
        console.error('Erro ao registar um cliente', error);
        res.status(500).json({sucess: false, message: 'Erro ao registar um cliente'});
    }
    
    
    
});

app.post('/conta', async(req, res) => {
    console.log(req.body);
    const {id_cliente, saldo} = req.body;
    try {
        if(id_cliente !== null && saldo !== null){
            const connection = await pool.getConnection();
            await connection.execute('INSERT INTO CONTA (cliente_id, saldo) VALUES (?, ?)', [id_cliente, saldo]);
            connection.release();    
            res.json({sucess: true, message: 'conta registado'});        
        }
    } catch (error) {
        console.error('Erro ao registar conta', error);
        res.status(500).json({sucess: false, message: 'Erro ao registar conta'});
    }
});

app.get('/contas', async(req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows, fields] = await connection.execute('SELECT * FROM CONTA');
        connection.release();
        res.json(rows); // Retorna os resultados da consulta como JSON
    } catch (error) {
        console.error('Erro ao obter contas:', error);
        res.status(500).json({ error: 'Erro interno do servidor' }); // Retorna um status 500 em caso de erro
    }
});

app.put('/conta', async(req, res) => {
    try {
        const {saldo, id} = req.body;
        const connection = await pool.getConnection(); // Obtem uma conexão do pool com a base de dados 
        atualizarConta(id, saldo, connection);
        res.status(200).json({ message: 'Conta atualizado com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar conta:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.put('/debito', async(req, res) => {
    console.log(req.body);
    const {id_conta, valor} = req.body;
    const connection = await pool.getConnection();
    const [rows, fields] = await connection.execute('SELECT saldo FROM CONTA WHERE id = ?', [id_conta]);
    connection.release();
    const saldo = rows[0].saldo;
    if(saldo < valor){
        res.json({sucess: false, message: 'Saldo insuficiente'});

    } else {
        const novoSaldo = saldo - valor;
        console.log(novoSaldo);
        atualizarConta(id_conta, novoSaldo, connection);                    
        res.json({sucess: true, message: 'Debito efetuado com sucesso'});
    }
   
});

app.put('/credito', async(req, res) => {
    console.log(req.body);
    const {id_conta, valor} = req.body;
    const connection = await pool.getConnection();
    const [rows, fields] = await connection.execute('SELECT saldo FROM CONTA WHERE id = ?', [id_conta]);
    connection.release();
    const saldo = rows[0].saldo;
    const novoSaldo = Number(saldo) + valor;
    console.log(saldo);
    console.log(novoSaldo);
    atualizarConta(id_conta, novoSaldo, connection);
    res.json({sucess: true, message: 'Credito efetuado com sucesso'});
});
async function atualizarConta(id, saldo, connection){
    await connection.execute('UPDATE CONTA SET saldo = ? WHERE id = ?', ([saldo, id]));
    connection.release();
    
}
app.put('/transferencia', async(req, res) => {
    console.log(req.body);
    const {id_conta_origem, id_conta_destino, valor} = req.body;
    const connection = await pool.getConnection();
    const [rows, fields] = await connection.execute('SELECT saldo FROM CONTA WHERE id = ?', [id_conta_origem]);
    connection.release();
    const saldoContaDebito = rows[0].saldo;
    if(saldoContaDebito < valor){
        res.json({sucess: false, message: 'Saldo insuficiente'});

    } else {
        const novoSaldoOrigem = saldoContaDebito - valor;
        console.log(novoSaldoOrigem);
        atualizarConta(id_conta_origem, novoSaldoOrigem, connection);
        const [rows, fields] = await connection.execute('SELECT saldo FROM CONTA WHERE id = ?', [id_conta_destino]);
        connection.release();
        const saldo = rows[0].saldo;
        const novoSaldoDestino = Number(saldo) + valor;
        console.log(novoSaldoDestino);
        atualizarConta(id_conta_destino, novoSaldoDestino, connection);
        res.json({sucess: true, message: 'Transferencia efetuada com sucesso'});
    }
}); 
app.post('/movimentacao', async(req, res) => {
    console.log(req.body);
    const {descricao, valor, tipo_transacao, id_conta, data_movimentacao} = req.body; // informações para colocar no postman no body
    try {
        if(id_conta !== null && tipo_transacao !== null && valor !== null && descricao !== null && data_movimentacao !== null){
            const connection = await pool.getConnection();
            await connection.execute('INSERT INTO  MOVIMENTACAO (descricao, valor, tipo_transacao, id_conta, data_movimentacao) VALUES (?, ?, ?, ?, ?)', [descricao, valor, tipo_transacao, id_conta, data_movimentacao]);
            connection.release();    
            res.json({sucess: true, message: 'movimentacao registada'});        
        }
    } catch (error) {
        console.error('Erro de movimentacao', error);
        res.status(500).json({sucess: false, message: 'Erro ao registar movimentacao'});
    }
     
    
});
app.get('/movimentacao', async(req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows, fields] = await connection.execute('SELECT * FROM  MOVIMENTACAO');
        connection.release();
        res.json(rows); // Retorna os resultados da consulta como JSON
    } catch (error) {
        console.error('Erro ao realizar movimentacao:', error);
        res.status(500).json({ error: 'Erro de movimentacao' }); // Retorna um status 500 em caso de erro
    }
});

app.put('/movimentacao', async(req, res) => {
    try {
        const {id, descricao, valor, tipo_transacao, id_conta, data_movimentacao} = req.body;
        const connection = await pool.getConnection(); // Obtem uma conexão do pool com a base de dados 
        atualizarMovimentacao(descricao, valor, tipo_transacao, id_conta, data_movimentacao, connection, id);
        res.status(200).json({ message: 'Movimentacao atualizado com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar movimentacao:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

   async function atualizarMovimentacao (descricao, valor, tipo_transacao, id_conta, data_movimentacao, connection, id){
    await connection.execute('UPDATE MOVIMENTACAO SET descricao = ?, valor = ?, tipo_transacao = ?, id_conta = ?, data_movimentacao = ? WHERE id = ?', ([descricao, valor, tipo_transacao, id_conta, data_movimentacao, id]));
    connection.release();
}


app.listen(PORT, () => {
    console.log(`A executar na porta http://localhost:${PORT}`)
});



