const connector = require("./connector")
const portConfig = require("./portConfig")

let globalLock = false

const requestHandler = async data => {
    const { lock } = data

    console.log("incoming lock request:", lock)

    const makeResponse = message => ({ message })

    if (lock === true && globalLock === false) {
        console.log("lock successful")

        globalLock = true
        return makeResponse("locked")
    }
    else if (lock === false) {
        console.log("unlock successful")

        if (globalLock === true) {
            console.log("changing lock valye to false")
            globalLock = false
        }

        return makeResponse("unlocked")
    }
    else {
        console.log("lock failed, already locked")
        return makeResponse("failed")
    }
}

const errorHandler = error => console.log(error)

connector.createServer({
    port: portConfig.authServer,
    requestHandler,
    errorHandler
})