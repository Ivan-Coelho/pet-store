import { faker } from "@faker-js/faker";

describe('teste do carrinho', function () {

    let usuario, produto, carrinhoId

    beforeEach(function () {
        cy.criarUsuarioLogado().then(function (response) {
            usuario = response.usuario


            cy.criarProduto(usuario.token).then(function (response) {
                produto = response.produto
            });
        });
    });

    afterEach(function(){
        cy.request({
            method:'DELETE',
            url: 'carrinhos/concluir-compra',
            headers:{Authorization: usuario.token}
        })        
        
        cy.deletarProduto(produto._id, usuario.token);
        cy.deletarUsuario(usuario._id)
    });

    it('teste criação de carrinho com sucesso', function(){
        cy.request({
            method:'POST',
            url:'carrinhos',
            headers:{Authorization: usuario.token},
            body:{
                "produtos": [
                  {
                    idProduto: produto._id,
                    quantidade: 5
                  }
                ]              
            }
        }).then(function(response){            
            expect(response.status).to.equal(201)            
            expect(response.body).to.have.property('message', "Cadastro realizado com sucesso")
            expect(response.body).to.have.property('_id').and.to.be.a('string');
            
            
        });
    });

    it('Não deve ser possivel criar carrinho com uma quantidade de produtos maior que o estoque ', function(){
        cy.request({
            method:'POST',
            url:'carrinhos',
            headers:{Authorization: usuario.token},
            failOnStatusCode: false,
            body:{
                "produtos": [
                  {
                    idProduto: produto._id,
                    quantidade: 51
                  }
                ]              
            }
        }).then(function(response){            
            expect(response.status).to.equal(400)            
            expect(response.body).to.have.property('message', "Produto não possui quantidade suficiente")
                        
        });
    });
   
    it('cadastro de carrinho com mais produtos', function(){
        let produtoId = [];
        for(let i=0; i<4 ;i++){
            cy.criarProduto(usuario.token).then(function(response){
                produtoId.push(response.produto._id)
            })
        }

        cy.wrap(null).then(() => {
            cy.log(produtoId);        
        
        cy.request({
            method:'POST',
            url:'carrinhos',
            headers:{Authorization: usuario.token},
            body:{
                "produtos": [
                  {
                    idProduto: produto._id,
                    quantidade: 5
                  },
                  {
                    idProduto:produtoId[0],
                    quantidade: 10
                  },
                  {
                    idProduto:produtoId[1],
                    quantidade: 10
                  },
                  {
                    idProduto:produtoId[2],
                    quantidade: 10
                  },
                  {
                    idProduto:produtoId[3],
                    quantidade: 10
                  }                  
                ]              
            }
        }).then(function(response){
            carrinhoId = response.body._id 
        })
        })
        
        cy.request({
            method:'GET',
            url:'carrinhos',
            qs:{idUsuario:usuario._id}
        }).then(function(response){
            expect(response.body.carrinhos[0].produtos).to.be.an('array').to.have.lengthOf(5);
        })

     });

     it('Ao acresentar o produto no carrinho, a quantidade deve diminuir no estoque', function(){

        cy.request({
            method: 'POST',
            url: 'carrinhos',
            headers:{Authorization: usuario.token},
            body:{
                "produtos": [
                  {
                    idProduto: produto._id,
                    quantidade: 30
                  }
                ]              
            }
        })

        cy.request({
            method:'GET',
            url:'produtos/'+ produto._id
        }).then(function(response){
            expect(response.body.nome).to.equal(produto.nome)
            expect(response.body.quantidade).to.equal(20)
        })
        

     });

     it('Ao concluir a compra, os produtos não devem voltar ao estoque', function(){
        cy.request({
            method:'POST',
            url:'carrinhos',
            headers:{Authorization: usuario.token},
            body:{
                "produtos": [
                  {
                    idProduto: produto._id,
                    quantidade: 1
                  }
                ]              
            }
        })

        cy.concluirCompra(usuario.token);

        cy.request({
            method:'GET',
            url:'produtos/' + produto._id
        }).then(function(response){
            expect(response.body.nome).to.equal(produto.nome);
            expect(response.body.quantidade).to.equal(49)
        })

     });

     it('Ao cancelar a compra, os produtos devem retornar ao estoque', function(){

        cy.request({
            method:'POST',
            url:'carrinhos',
            headers:{Authorization: usuario.token},
            body:{
                "produtos": [
                  {
                    idProduto: produto._id,
                    quantidade: 1
                  }
                ]              
            }
        })

        cy.cancelarCompra(usuario.token);

        cy.request({
            method:'GET',
            url:'produtos/' + produto._id
        }).then(function(response){
            expect(response.body.nome).to.equal(produto.nome);
            expect(response.body.quantidade).to.equal(50)
        });

     });

     it('')

});