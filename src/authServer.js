const connector = require("./connector")
const portConfig = require("./portConfig")

let globalLock = false

const requestHandler = async data => {
    const { lock } = data

    const makeResponse = message => ({ message })

    if (lock === true && globalLock === false) {
        globalLock = true
        return makeResponse("locked")
    }
    else if (lock === false) {
        if (globalLock === true) {
            globalLock = false
        }

        return makeResponse("unlocked")
    }
    else {
        return makeResponse("failed")
    }
}

const errorHandler = error => console.log(error)

connector.createServer({
    port: portConfig.authServer,
    requestHandler,
    errorHandler
})