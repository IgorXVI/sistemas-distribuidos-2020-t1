const connector = require("./connector")
const portConfig = require("./portConfig")

let globalString = ""

const lockRequest = async lock => {
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
    const message = await lockRequest(true)

    if (message === "locked") {
        const { subStr } = data

        globalString += subStr

        const otherMessage = await lockRequest(false)

        if (otherMessage === "unlocked") {
            return makeSuccessResponse()
        }

        return makeErrorResponse(otherMessage)
    }

    return makeErrorResponse(message)
}

const errorHandler = error => console.log(error)

connector.createServer({
    port: portConfig.stringServer,
    requestHandler,
    errorHandler
})