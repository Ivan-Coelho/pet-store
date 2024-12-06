import { faker } from "@faker-js/faker";


describe('testes de autenticação de usuário', function(){
    describe('testes de autenticação com dados invalidos/não cadastrados', function(){
        let usuario
        before(function(){
            cy.criarUsuario().then(function(response){
                usuario = response.usuario
            })
        })
        after(function(){
            cy.deletarUsuario(usuario._id)
        });

        it('usuário tentar logar com senha incorreta', function(){
            cy.request({
                method: 'POST',
                url: 'login',
                body: {
                    email: usuario.email,
                    password:'123456'
            },failOnStatusCode: false
            }).then(function(response){
                expect(response.status).to.equal(401);
                expect(response.body.message).to.equal("Email e/ou senha inválidos")
            });
        });

        it('usuario tentar logar sem informar a senha', function(){
            cy.request({
                method: 'POST',
                url: 'login',
                body: {
                    email: usuario.email           
            },failOnStatusCode: false
            }).then(function(response){
                expect(response.status).to.equal(400);
                expect(response.body.password).to.equal("password é obrigatório")
            });

        })

        it('usuario tentar logar com password em branco', function(){
            cy.request({
                method: 'POST',
                url: 'login',
                body: {
                    email: usuario.email,
                    password:""           
            },failOnStatusCode: false
            }).then(function(response){
                expect(response.status).to.equal(400);
                expect(response.body.password).to.equal("password não pode ficar em branco")
            });

        });

        it('usuario tentar logar utilizando um email invalido', function(){
            cy.request({
                method: 'POST',
                url:'login',
                body: {
                    email: 'jose.com',
                    password: '123456'
                }, failOnStatusCode: false
            }).then(function(response){
                expect (response.status).to.equal(400);
                expect(response.body.email).to.equal('email deve ser um email válido')
            })
        });
        
    });
    describe('usuario cadastrado logar com sucesso', function(){
        
        let usuario
        before(function(){
            cy.criarUsuario().then(function(response){
                usuario = response.usuario
            });
        });

        after(function(){
            cy.deletarUsuario(usuario._id)
        });

        it('usuario cadastrado logar com sucesso', function(){

            cy.request({
                method: 'POST',
                url: 'login',
                body: {
                    email: usuario.email,
                    password: usuario.password
            }
            }).then(function(response){
                expect(response.status).to.equal(200);
                expect(response.body.message).to.equal("Login realizado com sucesso")
                expect(response.body).to.have.property('message', 'Login realizado com sucesso')
                expect(response.body).to.have.property('authorization').and.to.be.a('string')
            });

        });
    });

});