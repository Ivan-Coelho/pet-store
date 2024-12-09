import { faker } from "@faker-js/faker";

describe('testes de listagem de produtos', function () {

    let usuario, produto
    before(function () {
        cy.criarUsuarioLogado().then(function (response) {
            usuario = response.usuario

            cy.criarProduto(usuario.token).then(function (response) {
                produto = response.produto
            });
        });
    });

    after(function(){
        cy.deletarProduto(produto._id, usuario.token);
        cy.deletarUsuario(usuario._id);
    });


    it('listar os produtos pelo id', function () {

        cy.request({
            method: 'GET',
            url: 'produtos',
            qs: {_id:produto._id}
        }).then(function(response){
            expect(response.status).to.equal(200);
            expect(response.body.produtos[0]).to.deep.equal(produto)
        })

    });

    it('listar os produtos pelo nome', function () {

        cy.request({
            method: 'GET',
            url: 'produtos',
            qs: {nome: produto.nome}
        }).then(function(response){
            expect(response.status).to.equal(200);
            expect(response.body.produtos[0]).to.deep.equal(produto)
        })

    });

    it('listar os produtos pela descrição', function () {

        cy.request({
            method: 'GET',
            url: 'produtos',
            qs: {nome:produto.nome, descricao: produto.descricao}
        }).then(function(response){
            expect(response.status).to.equal(200);
            expect(response.body.produtos[0]).to.deep.equal(produto)
        })

    });

});