import { faker } from "@faker-js/faker";

describe('atualização de usuários', function () {

    let idUser
    let novoUser = {
        nome: faker.internet.username(),
        email: faker.internet.email(),
        password: 'qweasd',
        administrador: 'true',
    }

    beforeEach(function () {
        cy.criarUsuario().then(function (response) {
            idUser = response.usuario._id
        })
    });

    afterEach(function () {
        cy.deletarUsuario(idUser);
    });

    it('deve ser possivel atualizar os dados de um usuário com id valido', function () {

        cy.request({
            method: 'PUT',
            url: 'usuarios/' + idUser,
            body: novoUser
        }).then(function (response) {
            expect(response.status).to.equal(200)
            expect(response.body.message).to.equal('Registro alterado com sucesso')
        })
        cy.request({
            method: 'GET',
            url: 'usuarios/' + idUser
        }).then(function (response) {
            let usuarioEsperado = { ...novoUser, _id: idUser }
            expect(response.body).to.deep.equal(usuarioEsperado)
        })
    });

    it('Devera ser realizado o cadastro caso o Id informado não seja encontrado', function () {
        cy.request({
            method: 'PUT',
            url: 'usuarios/' + "555",
            body: novoUser
        }).then(function (response) {
            expect(response.status).to.equal(201)
            expect(response.body.message).to.equal("Cadastro realizado com sucesso")
            expect(response.body).to.have.property('_id').and.to.be.a('string')
        });
    });

    it('Não deve ser possivel atualizar os dados para um email já utilizado', function () {
        let usuario
        cy.criarUsuario().then(function (response) {
            usuario = response.usuario
            cy.request({
                method: 'PUT',
                url: 'usuarios/' + idUser,
                body: {
                    nome: 'ivan',
                    email: usuario.email,
                    password: 'asdqwe',
                    administrador: 'true'
                }, failOnStatusCode: false
            }).then(function (response) {
                expect(response.status).to.equal(400);
                expect(response.body.message).to.equal("Este email já está sendo usado")
            });
            cy.deletarUsuario(usuario.id);
        });
    });

    it('não deve ser possivel atualizar o cadastro do usuário sem informar uma senha', function () {
        let novosDados = {
            nome: faker.internet.username(),
            email: faker.internet.email(),
            administrador: 'true'
        }

        cy.request({
            method: 'PUT',
            url: 'usuarios/' + idUser,
            body: novosDados,
            failOnStatusCode: false
        }).then(function (response) {
            expect(response.status).to.equal(400)
            expect(response.body.password).to.equal('password é obrigatório')
        })
    });

});

describe('buscar usuario por id', function () {

    let usuario
    before(function () {
        cy.criarUsuario().then(function (response) {
            usuario = response.usuario
        });
    });


    after(function () {
        cy.deletarUsuario(usuario.id)
    });

    it('Deve retornar os dados do usuário, ao informar um id valido', function () {

        cy.request('GET', 'usuarios/' + usuario._id).then(function (response) {
            expect(response.status).to.equal(200);
            expect(response.body).to.deep.equal(usuario)
        });
    });

    it('Informar um id inexistente, não deve encontrar um usuário', function () {
        cy.request({
            method: 'GET',
            url: 'usuarios/' + 555,
            failOnStatusCode: false

        }).then(function (response) {
            expect(response.status).to.equal(400)
            expect(response.body.message).to.equal("Usuário não encontrado")
        })
    });
});