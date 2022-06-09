require('./cypress/plugins/server')

module.exports = {
  projectId: 'ypt4pf',
  hosts: {
    '*.foobar.com': '127.0.0.1',
    '*.idp.com': '127.0.0.1',
  },
  e2e: {
    baseUrl: 'http://localhost:3500',
    experimentalSessionAndOrigin: true,
  },
}
