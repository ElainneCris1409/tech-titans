const request = require('supertest');
const app = require('./server');

describe('Testes', () => {
    it('Teste de inserção de cliente', async() => {
        const response = await request(app)
            .post('/cliente')
            .send({nome: 'Elainne', id: 1, morada: 'Porto'});
        expect(response.body).toHaveProperty('sucess', true);
    });

    it('Teste de inserção de conta', async() => {
        const response = await request(app)
            .post('/conta')
            .send({id_cliente: 1, id: 1, saldo: 100});
        expect(response.body).toHaveProperty('sucess', true);
    });

    it('Teste de listagem de clientes', async() => {
        const response = await request(app)
            .get('/clientes');
        expect(response.body).toHaveLength(1);
    });

    it('Teste de listagem de contas de cliente', async() => {
        const response = await request(app)
            .get('/contas_clientes')
            .send({id_cliente: 1});
        expect(response.body).toHaveProperty('id_cliente', 1);
        expect(response.body).toHaveProperty('nome_cliente', 'Elainne');
        expect(response.body.contasC).toHaveLength(1);
    });
});