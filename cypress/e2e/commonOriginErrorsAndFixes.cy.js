
describe('Common errors and fixes', () => {
  it('cy.visit fail to visit a cross origin page - failure', () => {
    cy.visit('/fixtures/auth/index.html')
    // instead of clicking we want to force the url to the cross origin page
    // This fails because you're trying to visit a cross origin page.
    cy.visit('http://www.idp.com:3500/fixtures/auth/idp.html')
    cy.origin('http://idp.com:3500', () => {
      cy.get('[data-cy="username"]').type('BJohnson')
      cy.get('[data-cy="login"]').click()
    })

    // Verify that the user has logged in on localhost
    cy.get('[data-cy="welcome"]')
    .invoke('text')
    .should('equal', 'Welcome BJohnson')
  })

  it('cy.visit fail to visit a cross origin page - fix', () => {
    cy.visit('/fixtures/auth/index.html')
    cy.origin('http://idp.com:3500', () => {
      // Instead visit from within the cy.origin block.
      cy.visit('http://www.idp.com:3500/fixtures/auth/idp.html')
      cy.get('[data-cy="username"]').type('BJohnson')
      cy.get('[data-cy="login"]').click()
    })

    // Verify that the user has logged in on localhost
    cy.get('[data-cy="welcome"]')
    .invoke('text')
    .should('equal', 'Welcome BJohnson')
  })

  it('calls another command before cy.origin - failure',{ pageLoadTimeout: 5000 }, () => {
    cy.visit('/fixtures/auth/index.html')
    cy.get('[data-cy="login-idp"]').click() // Takes you to idp.com
    // Page load times out because the command immediately following
    // a cross origin navigation should be cy.origin
    cy.url().should('contain', 'http://www.idp.com:3500')
    cy.origin('http://idp.com:3500', () => {
      cy.get('[data-cy="username"]').type('BJohnson')
      cy.get('[data-cy="login"]').click()
    })

    // Verify that the user has logged in on localhost
    cy.get('[data-cy="welcome"]')
    .invoke('text')
    .should('equal', 'Welcome BJohnson')
  })

  it('calls another command before cy.origin - fix', () => {
    cy.visit('/fixtures/auth/index.html')
    cy.get('[data-cy="login-idp"]').click() // Takes you to idp.com
    cy.origin('http://idp.com:3500', () => {
      // Move the check into cy.origin
      cy.url().should('contain', 'http://www.idp.com:3500')
      cy.get('[data-cy="username"]').type('BJohnson')
      cy.get('[data-cy="login"]').click()
    })

    // Verify that the user has logged in on localhost
    cy.get('[data-cy="welcome"]')
    .invoke('text')
    .should('equal', 'Welcome BJohnson')
  })

  it('yields an unserializable object - failure', () => {
    cy.origin('http://idp.com:3500', () => {
      cy.visit('http://www.idp.com:3500/fixtures/auth/idp.html')

      // This fails be cause dom objects are unserializable and as suck cannot be yielded from cy.origin
      cy.get('[data-cy="login"]') // Yielding a dom object
    }).then((subject) => subject)
    .should('equal', 'Login')
  })

  it('yields an unserializable object - fix', () => {
    cy.origin('http://idp.com:3500', () => {
      cy.visit('http://www.idp.com:3500/fixtures/auth/idp.html')

      // Fix: change to yield a serializable value.
      cy.get('[data-cy="login"]').invoke('text') // Yielding a dom object
    }).then((subject) => subject)
    .should('equal', 'Login')
  })

  it('tries to use an undefined variable - failure', () => {
    const username = 'username'

    cy.visit('/fixtures/auth/index.html')
    cy.get('[data-cy="login-idp"]').click() // Takes you to idp.com
    // cy.origin will fail to execute because username is not defined
    // this happens because the origin block is serialized and sent
    // to the idp origin but username will be undefined.
    cy.origin('http://idp.com:3500', () => {
      cy.get('[data-cy="username"]').type(username)
      cy.get('[data-cy="login"]').click()
    })

    // Verify that the user has logged in on localhost
    cy.get('[data-cy="welcome"]')
    .invoke('text')
    .should('equal', 'Welcome username')
  })

  it('tries to use an undefined variable - fix', () => {
    const username = 'username'

    cy.visit('/fixtures/auth/index.html')
    cy.get('[data-cy="login-idp"]').click() // Takes you to idp.com
    // Fix: use the args command parameter to pass the username variable along
    // with the origin block.
    cy.origin('http://idp.com:3500', { args: { username } }, ({ username }) => {
      cy.get('[data-cy="username"]').type(username)
      cy.get('[data-cy="login"]').click()
    })

    // Verify that the user has logged in on localhost
    cy.get('[data-cy="welcome"]')
    .invoke('text')
    .should('equal', 'Welcome username')
  })

  it('passes an unserializable value - failure', () => {
    const username = () => 'username'

    cy.visit('/fixtures/auth/index.html')
    cy.get('[data-cy="login-idp"]').click() // Takes you to idp.com
    // username is a function and unserializable, args must be serializable.
    cy.origin('http://idp.com:3500', { args: { username } }, ({ username }) => {
      cy.get('[data-cy="username"]').type(username())
      cy.get('[data-cy="login"]').click()
    })

    // Verify that the user has logged in on localhost
    cy.get('[data-cy="welcome"]')
    .invoke('text')
    .should('equal', 'Welcome username')
  })

  it('passes an unserializable value - fix', () => {
    const username = () => 'username'

    cy.visit('/fixtures/auth/index.html')
    cy.get('[data-cy="login-idp"]').click() // Takes you to idp.com
    // In this case we can execute username before passing, other solutions may vary.
    cy.origin('http://idp.com:3500', { args: { username: username() } }, ({ username }) => {
      cy.get('[data-cy="username"]').type(username)
      cy.get('[data-cy="login"]').click()
    })

    // Verify that the user has logged in on localhost
    cy.get('[data-cy="welcome"]')
    .invoke('text')
    .should('equal', 'Welcome username')
  })
})


