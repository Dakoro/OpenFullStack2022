describe('Blog App', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user1 = {
      name: 'John',
      username: 'Snake',
      password: 'hitman'
    }
    const user2 = {
      name: 'Elena',
      username: 'Eva',
      password: 'bike',
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user1)
    cy.request('POST', 'http://localhost:3003/api/users/', user2)
    cy.visit('http://localhost:3000')
  })

  it('login form is shown', function() {
    cy.contains('login').click()
  })

  describe('Login', function() {
    it('succeeds with correct credidentials', function() {
      cy.contains('login').click()
      cy.get('#username').type('Snake')
      cy.get('#password').type('hitman')
      cy.get('#login-button').click()
      cy.get('.succes').contains('John is logged')
      cy.contains('John is logged in')
      cy.contains('Logout')
      cy.contains('new blog')
    })

    it('failed with wrong credidentials', function() {
      cy.contains('login').click()
      cy.get('#username').type('Snake')
      cy.get('#password').type('wrongPassword')
      cy.get('#login-button').click()
      cy.get('.error').should('contain', 'Wrong username or password')
      cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)')
      cy.get('html').should('not.contain', 'John is logged')
    })
  })

  describe('when logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'Snake', password: 'hitman' })
    })
    it('a new blog can be created', function() {
      cy.request('GET', 'http://localhost:3003/api/blogs').as('blogsAtStart')
      cy.get('@blogsAtStart').should(function(response) {
        expect(response.body).to.have.length(0)
      })
      cy.contains('new blog').click()
      cy.get('#title').type('New Blog Title')
      cy.get('#author').type('Blog\'s Author')
      cy.get('#url').type('http://blogURL.com')
      cy.contains('add').click()
      cy.get('.succes').contains('A new blog New Blog Title by Blog\'s Author added')
      cy.request('GET', 'http://localhost:3003/api/blogs').as('blogsAtEnd')
      cy.get('@blogsAtEnd').should(function(response) {
        expect(response.body).to.have.length(1)
        expect(response.body[0].title).to.contains('New Blog Title')
        expect(response.body[0].author).to.contains('Blog\'s Author')
        expect(response.body[0].url).to.contains('http://blogURL.com')
      })
    })

    it('a blog can be liked', function() {
      cy.createBlog({
        title: 'LikeTest',
        author: 'Filianore',
        url: 'http://LikeTest.com'
      })
      cy.contains('LikeTest by Filianore')
        .contains('view')
        .click()
      cy.intercept('PUT', '/api/blogs/**').as('update')
      cy.contains('like').click()
      cy.wait('@update')
        .its('response')
        .then(function(response) {
          cy.wrap(response).its('statusCode').should('eq', 200)
          cy.wrap(response).its('body').should('include', { 'likes': 1 })
        })
      cy.request('GET', 'http://localhost:3003/api/blogs').as('blogs')
      cy.get('@blogs').should(function(response) {
        console.log(response.body)
        expect(response.body[0].likes).to.equal(1)
      })
    })
    it('a user can delete a blog', function() {
      cy.createBlog({
        title: 'LikeTest',
        author: 'Filianore',
        url: 'http://LikeTest.com'
      })
      cy.contains('LikeTest by Filianore')
        .contains('view')
        .click()
      cy.intercept('DELETE', '/api/blogs/**').as('delete')
      cy.contains('remove').click()
      cy.wait('@delete')
        .its('response.statusCode')
        .should('eq', 204)
      cy.request('GET', 'http://localhost:3003/api/blogs').as('blogs')
      cy.get('@blogs').should(function(response) {
        console.log(response.body)
        expect(response.body).to.deep.equal([])
      })
    })
    it('other user doesn\' have acces to others blog when logged in', function() {
      cy.createBlog({
        title: 'LikeTest',
        author: 'Filianore',
        url: 'http://LikeTest.com'
      })
      cy.contains('Logout').click()
      cy.login({ username: 'Eva', password: 'bike' })
      cy.get('html').should('not.contain', 'LikeTest by Filianore')
    })

    it('the blogs are sorted by their number of likes', function() {
      cy.createBlog({ title: 'firstBlog', author: 'Zelda', url: 'http://FB.com', likes: 100 })
      cy.createBlog({ title: 'secondBlog', author: 'Freya', url: 'http://SB.com', likes: 500 })
      cy.createBlog({ title: 'thirdBlog', author: 'Gwyn', url: 'http://TB.com', likes: 15 })

      cy.get('.blog').eq(0).should('contain', 'secondBlog')
      cy.get('.blog').eq(1).should('contain', 'firstBlog')
      cy.get('.blog').eq(2).should('contain', 'thirdBlog')
    })
  })
})