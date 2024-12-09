import { faker } from "@faker-js/faker";

describe('testes de busca de produto', function () {

    let usuario, produto, token

    before(function () {
        cy.criarUsuario().then(function (response) {
            usuario = response.usuario
            cy.logarUsuario(usuario.email, 'qweasd').then(function (response2) {
                token = response2.body.authorization               

                cy.criarProduto(token).then(function (response3) {
                    produto = response3.produto
                });
            });
        });
    });

    after(function () {
        cy.deletarProduto(produto._id, token);
        cy.deletarUsuario(usuario._id)
    });

    it('Não deve ser possível encontrar um produto utilizando um Id invalido', function () {
        cy.request({
            method: 'GET',
            url: 'produtos/' + '555',
            failOnStatusCode: false
        }).then(function (response) {
            expect(response.status).to.equal(400);
            expect(response.body.message).to.equal('Produto não encontrado')
        });
    });

    it('Deve ser possível encontrar um produto utilizando um Id válido', function(){
        cy.request({
            method:'GET',
            url:'produtos/' + produto._id            
        }).then(function(response){
            expect(response.status).to.equal(200);
            expect(response.body).to.deep.equal(produto)
        });
    });
});
