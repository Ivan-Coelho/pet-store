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


Cypress.Commands.add('criarUsuario', function(){
    let idUsuario
    let usuario ={
        nome: faker.internet.username(),
        email:faker.internet.email(),//.toLowCase(),
        password: 'qweasd',
        administrador: 'true'
    };

    cy.request({
        method:'POST',
        url:'usuarios',
        body: usuario
    }).then(function(response){
        idUsuario =  response.body._id
        usuario = {...usuario, _id:idUsuario}
        return{
            usuario
        }
    });    
});

Cypress.Commands.add('usuarioComum', function(){

    let idUsuario
    let usuarioComum ={
        nome: faker.internet.username(),
        email:faker.internet.email(),
        password: 'qweasd',
        administrador: 'false'
    };

    cy.request({
        method:'POST',
        url:'usuarios',
        body: usuarioComum
    }).then(function(response){
        idUsuario =  response.body._id
        usuarioComum = {...usuarioComum, _id:idUsuario}
        return{
            usuarioComum
        }
    });
});

Cypress.Commands.add('logarUsuario', function(email, senha){
    cy.request('POST', 'login',{
        email:email,
        password: senha
    }).then(function(response){
        let token = response.authorization
    });
});

Cypress.Commands.add('deletarUsuario', function(idUser){
    cy.request({
        method:'DELETE',
        url:'usuarios/' +idUser
    });
});

Cypress.Commands.add('deletarProduto', function(idProduto,token){
    cy.request({
        method:'DELETE',
        url:'produtos/' + idProduto,
        headers: {Authorization: token}
    });
});



