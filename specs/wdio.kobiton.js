import BPromise from 'bluebird'
import {remote} from 'webdriverio'
import configs from '../configs'

describe('hooks', async () => {

  const desiredCaps = configs.desiredCaps
  const user = process.env.KOBITON_USERNAME
  const key = process.env.KOBITON_ACCESS_KEY

  let client = remote({
    protocol: 'https',
    port: 443,
    host: 'api.kobiton.com',
    user,
    key,
    desiredCapabilities: desiredCaps,
    logLevel: 'verbose'
  })

  let sessionId
  let kobitonSessionId

  before(async () => {
    await client.init()
    await getSessionData(client)
  })

  after(async () => {
    await client
      .end()
  })

  it('run test', async () => {
    await client
      .url('http://webdriver.io')
      .setValue('.ds-input', 'click')
      .click('.algolia-docsearch-suggestion--title')
      .pause(1000)
      .getTitle().then((title) => {
        console.log(title) // should return "WebdriverIO - click"
      })
  })

  async function getSessionData(client) {
    sessionId = client.requestHandler.sessionID
    const sessionInfo = await client.session()
    kobitonSessionId = sessionInfo.value.kobitonSessionId

    console.log('sessionId', sessionId)
    console.log('kobitonSessionId', sessionInfo.value.kobitonSessionId)
  }

})