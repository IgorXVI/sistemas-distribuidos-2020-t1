const delay = require("delay")

const connector = require("./connector")
const portConfig = require("./portConfig")

let globalString = ""

const lockRequest = async lock => {
    await delay(Math.random() * 1000)
    
    const { message } = await connector.request({
        data: {
            lock
        },
        port: portConfig.authServer
    })

    return message
}

const makeSuccessResponse = () => ({
    success: true,
    globalString
})

const makeErrorResponse = message => ({
    success: true,
    message
})

const requestHandler = async data => {
    const { subStr } = data

    const message = await lockRequest(true)

    if (message === "locked") {
        console.log(subStr, "locked")

        globalString += subStr
        console.log(subStr, "string modified")

        const otherMessage = await lockRequest(false)

        if (otherMessage === "unlocked") {
            console.log(subStr, "unlocked")
            return makeSuccessResponse()
        }

        console.log(subStr, "unable to unlock")
        return makeErrorResponse(otherMessage)
    }

    console.log(subStr, "unable to lock")
    return makeErrorResponse(message)
}

const errorHandler = error => console.log(error)

connector.createServer({
    port: portConfig.stringServer,
    requestHandler,
    errorHandler
})