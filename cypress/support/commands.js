// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import { faker } from "@faker-js/faker";


Cypress.Commands.add('criarUsuario', function () {
    let idUsuario
    let usuario = {
        nome: faker.internet.username(),
        email: faker.internet.email(),//.toLowCase(),
        password: 'qweasd',
        administrador: 'true'
    };

    cy.request({
        method: 'POST',
        url: 'usuarios',
        body: usuario
    }).then(function (response) {
        idUsuario = response.body._id
        usuario = { ...usuario, _id: idUsuario }
        return {
            usuario
        }
    });
});

Cypress.Commands.add('usuarioComum', function () {

    let idUsuario
    let usuarioComum = {
        nome: faker.internet.username(),
        email: faker.internet.email(),
        password: 'qweasd',
        administrador: 'false'
    };

    cy.request({
        method: 'POST',
        url: 'usuarios',
        body: usuarioComum
    }).then(function (response) {
        idUsuario = response.body._id
        usuarioComum = { ...usuarioComum, _id: idUsuario }
        return {
            usuarioComum
        }
    });
});

Cypress.Commands.add('logarUsuario', function (email, senha) {
    cy.request('POST', 'login', {
        email: email,
        password: senha
    });
});

Cypress.Commands.add('criarUsuarioLogado', function () {
    let idUsuario, token
    let usuario = {
        nome: faker.internet.username(),
        email: faker.internet.email(),
        password: 'qweasd',
        administrador: 'true'
    };

    return cy.request({
        method: 'POST',
        url: 'usuarios',
        body: usuario
    }).then(function (response) {
        idUsuario = response.body._id;

        return cy.request('POST', 'login', {
            email: usuario.email,
            password: 'qweasd'
        }).then(function (response) {
            token = response.body.authorization

            usuario = { ...usuario, _id: idUsuario, token: token }
            return {
                usuario
            }
        });
        
    });
});

Cypress.Commands.add('deletarUsuario', function (idUser) {
    cy.request({
        method: 'DELETE',
        url: 'usuarios/' + idUser
    });
});

Cypress.Commands.add('deletarProduto', function (idProduto, token) {
    cy.request({
        method: 'DELETE',
        url: 'produtos/' + idProduto,
        headers: { Authorization: token }
    });
});

Cypress.Commands.add('criarProduto', function (token) {

    let produtoId
    let produto = {
        nome: faker.commerce.productName(),
        preco: 42,
        descricao: "a vida e tudo mais",
        quantidade: 50
    }

    cy.request({
        method: 'POST',
        url: 'produtos',
        body: produto,
        headers: { Authorization: token }
    }).then(function (response) {
        produtoId = response.body._id

        produto = { ...produto, _id: produtoId }
        return { produto }
    })
})

