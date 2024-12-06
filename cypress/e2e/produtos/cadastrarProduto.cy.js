import { faker } from "@faker-js/faker";

describe('testes de cadastro de produto', function () {

    let usuario, token, tokenComum

    before(function () {

        cy.criarUsuario().then(function (response) {
            usuario = response.usuario
            cy.logarUsuario(usuario.email, usuario.password).then(function (response) {
                token = response.body.authorization
            });
        });

        cy.usuarioComum().then(function (response) {
            usuario = response.usuarioComum
            cy.logarUsuario(usuario.email, usuario.password).then(function (response) {
                tokenComum = response.body.authorization
            })
        })
    });

    after(function () {
        cy.deletarUsuario(usuario._id)
    })

    it('cadastrar um produto com sucesso', function () {
        let produto = faker.commerce.productName()
        let idProduto
        cy.request({
            method: 'POST',
            url: 'produtos',
            body: {
                nome: produto,
                preco: 42,
                descricao: "a vida e tudo mais",
                quantidade: 43
            },
            headers: { Authorization: token }
        }).then(function (response) {
            idProduto = response.body._id
            expect(response.status).to.equal(201);
            expect(response.body).to.have.property('message', "Cadastro realizado com sucesso")
            expect(response.body).to.have.property('_id').and.to.be.a('string')

            cy.deletarProduto(idProduto, token)
        });
    });

    it('Não é possível cadastrar um produto sendo usuário comum', function () {
        let produto = faker.internet.color()
        let idProduto
        cy.request({
            method: 'POST',
            url: 'produtos',
            body: {
                nome: produto,
                preco: 42,
                descricao: "a vida e tudo mais",
                quantidade: 43
            },
            headers: { Authorization: tokenComum },
            failOnStatusCode: false
        }).then(function (response) {
            idProduto = response.body._id
            expect(response.status).to.equal(403);
            expect(response.body).to.have.property('message', "Rota exclusiva para administradores")
        });
    });

    it('Não deve ser possível cadastrar um produto sem token', function () {
        let produto = faker.internet.color()
        let idProduto
        cy.request({
            method: 'POST',
            url: 'produtos',
            body: {
                nome: produto,
                preco: 42,
                descricao: "a vida e tudo mais",
                quantidade: 43
            }, failOnStatusCode: false

        }).then(function (response) {
            idProduto = response.body._id
            expect(response.status).to.equal(401);
            expect(response.body).to.have.property('message', "Token de acesso ausente, inválido, expirado ou usuário do token não existe mais")
        });
    });

    it('não deve ser possivel cadastrar produtos com mesmo nome', function(){
        let produto = faker.commerce.productName()
        let idProduto
        cy.request({
            method: 'POST',
            url: 'produtos',
            body: {
                nome: produto,
                preco: 42,
                descricao: "a vida e tudo mais",
                quantidade: 43
            },
            headers: { Authorization: token }
        }).then(function (response) {
            idProduto = response.body._id       

        cy.request({
            method: 'POST',
            url: 'produtos',
            body: {
                nome: produto,
                preco: 45,
                descricao: "produto novo",
                quantidade: 55
            },
            headers: { Authorization: token },
            failOnStatusCode: false
        }).then(function (response) {
            expect(response.status).to.equal(400);
            expect(response.body.message).to.equal('Já existe produto com esse nome')
            cy.deletarProduto(idProduto, token);
        });
        });       
    });
});