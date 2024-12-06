import { faker } from "@faker-js/faker";


describe('criação de usuario', function(){
    describe('criação de usuários com sucesso', function(){
        let usuario ={
            nome:faker.internet.username(),
            email:faker.internet.email(),
            password: 'qweasd',
            administrador: 'true'
        }
        it('criação de usuário', function(){
           cy.request('POST','usuarios', usuario).then(function(response){
            expect(response.status).to.equal(201)
            expect(response.body.message).to.equal('Cadastro realizado com sucesso')            
            expect(response.body).to.have.property('_id').and.to.be.a('string')
            });
        });
        
        it('criação de usuario com command', function(){
            cy.criarUsuario().then(function(response){
                cy.log(response)
            })

        });
    });

    describe('criação de usuário de maneira invalida', function(){
        it('não deve ser possivel a criação de usuário sem informar um nome', function(){
            cy.request({
                method:'POST',
                url:'usuarios',
                body:{
                    email:faker.internet.email(),
                    password: 'qweasd',
                    administrador: 'true'                    
                },failOnStatusCode: false            
            }).then(function(response){
                expect(response.status).to.equal(400)
                expect(response.body.nome).to.equal('nome é obrigatório')
            });
        });

        it('não deve ser possivel a criação de usuário sem informar um email', function(){
            cy.request({
                url: 'usuarios',
                method:'POST',
                body:{
                    nome: faker.internet.username(),                    
                    password: 'qweasd',
                    administrador: 'true'
                }, failOnStatusCode:false
            }).then(function(response){
                expect(response.status).to.equal(400)
                expect(response.body.email).to.equal('email é obrigatório')
            });
        });

        it.only('não deve ser possivel a criação de usuario sem preencher os campos nome, email e senha', function(){
            cy.request({
                url: 'usuarios',
                method:'POST',
                body:{
                    nome: '',                    
                    email: '',
                    password: '',
                    administrador: 'true'
                }, failOnStatusCode:false
            }).then(function(response){
                expect(response.status).to.equal(400)
                expect(response.body.nome).to.equal('nome não pode ficar em branco')
                expect(response.body.email).to.equal('email não pode ficar em branco')
                expect(response.body.password).to.equal('password não pode ficar em branco')
            });
        })

        it('não deve ser possivel a criação de usuario utilizando um email invalido', function(){
            cy.request({
                url:"usuarios",
                method: 'POST',
                body:{
                    nome: faker.internet.username(),
                    email:'teste.com',
                    password: 'qweasd',
                    administrador: 'true'
                }, failOnStatusCode: false
            }).then(function(response){
                expect(response.status).to.equal(400);
                expect(response.body.email).to.equal('email deve ser um email válido')
            });
        });

        it('um email valido não deve conter um emoji', function(){
            cy.request({
                url:'usuarios',
                method: 'POST',
                body:{
                    nome: 'fulano', 
                    email:faker.internet.username()+'🤡@teste.com',
                    password:'1',
                    administrador: 'true'
                },failOnStatusCode: false
            }).then(function(response){
                expect(response.status).to.equal(400)
                expect(response.body.email).to.equal('email deve ser um email válido')
            })
        });

        
        
    });

    describe('o email deve ser unico para cada usuário', function(){
        let usuario ={
            nome: faker.internet.username(),
            email: faker.internet.email(),
            password: 'qweasd',
            administrador: 'true'
        }
        
        before(function(){
            cy.request({
                url:'usuarios',
                method:'POST',
                body:usuario,
                administrador: true
            })
        })
        it('não deve ser possivel dois usuários utilizando o mesmo email', function(){
            cy.request({
                url:'usuarios',
                method:'POST',
                body:usuario,
                failOnStatusCode: false
            }).then(function(response){
                expect(response.status).to.equal(400)
                expect(response.body.message).to.equal('Este email já está sendo usado')
            });

        });

        it('no email não deve diferenciar caracteres maiusculos de minuscualos', function(){            
            
            usuario.email=usuario.email.toLowerCase();
          
            cy.request({
                url:'usuarios',
                method:'POST',
                body:usuario,
                failOnStatusCode: false
            }).then(function(response){
                expect(response.status).to.equal(400)
                expect(response.body.message).to.equal('Este email já está sendo usado')
            });
        });
    });   
});

