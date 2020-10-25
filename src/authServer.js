const connector = require("./connector")
const portConfig = require("./portConfig")

let globalString = ""

const requestHandler = async data => {
    globalString += data.name
    return globalString
}

const errorHandler = error => console.log(error)

connector.createServer({
    port: portConfig.authServer,
    requestHandler,
    errorHandler
})