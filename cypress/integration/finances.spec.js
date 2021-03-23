/// <reference types="cypress" />

import { format, prepareLocalStorage } from '../support/utils'

// cy.viewport
// Arquivos de config



context('Dev Finances Agilizei', () => {

   // Hooks são trechos de código que executam antes e depois de cada ou todos
   // os testes
   // before > Executa antes de todos os teste
   // beforeEach > Executa antes de cada teste
   // after > Executa antes de todos os testes
   // afterEach > Executa depois de cada os testes

   beforeEach(() => {
      cy.visit('https://devfinance-agilizei.netlify.app/#', {
         onBeforeLoad: (win) => {
            prepareLocalStorage(win)
         }
      });

   });
   it('Cadastrar entradas', () => {
      // - entender o fluxo manualmente
      // - mapear os elementos que vamos interagir
      // - descrever a interações com o cypress
      // - adicionar as asserções que precisamos (validações)


      cy.get('#transaction .button').click();
      cy.get('#description').type('Salário');
      cy.get('[name=amount]').type(500);
      cy.get('[type=date]').type('2021-03-16');
      cy.get('button').contains('Salvar').click();

      cy.get('#data-table tbody tr').should('have.length', 3)



   });

   it('Cadastrar saídas', () => {


      cy.get('#transaction .button').click();
      cy.get('#description').type('Despesas');
      cy.get('[name=amount]').type(-300);
      cy.get('[type=date]').type('2021-03-16');
      cy.get('button').contains('Salvar').click();

      cy.get('#data-table tbody tr').should('have.length', 3);



   });

   it('Remover entradas e saídas', () => {

      const entrada = "Salário"
      const saida = "Despesas"
      cy.get('#transaction .button').click();
      cy.get('#description').type(entrada);
      cy.get('[name=amount]').type(40);
      cy.get('[type=date]').type('2021-03-16');
      cy.get('button').contains('Salvar').click();

      cy.get('#transaction .button').click();
      cy.get('#description').type(saida);
      cy.get('[name=amount]').type(-25);
      cy.get('[type=date]').type('2021-03-16');
      cy.get('button').contains('Salvar').click();


      // Cadastrar saídas
      // Remover entradas e saídas

      // Estratégia 1: voltar para o elemento pai e avançar para um td img atributo
      cy.get('td.description')
         .contains(entrada)
         .parent()
         .find('img[onclick*=remove]')
         .click()

      cy.get('td.description')
         .contains(saida)
         .siblings()
         .children('img[onclick*=remove]')
         .click();

      cy.get('#data-table tbody tr').should('have.length', 2);



   });

   it('Validar saldo com diversas transações', () => {
      
      // capturar as linhas com as transações
      // cy.get($el).find('td.income, td.expense')
      // Formatar os valores das linhas

      // Somar os valores de entradas e saídas

      // capturar o texto do total 


      // comparar somatório de entradas e despesas com o total

      let incomes = 0;
      let expenses = 0;
      
      cy.get('#data-table tbody tr')
      .each(($el, index, $list) => {

         // invoke uma função chamada text();

         cy.get($el).find('td.income, td.expense').invoke('text').then( text => {
            if(text.includes('-')){
               expenses -= format(text)
            } else {
               incomes += format(text)
            }

            cy.log('entradas', incomes)
            cy.log('saídas', expenses)

         })
      })

      cy.get('#totalDisplay').invoke('text').then(text => {
         
         let formattedTotalDisplay = format(text)
         let expectedTotal = incomes - expenses

         expect(formattedTotalDisplay).to.eq(expectedTotal)

      })      


   });


});