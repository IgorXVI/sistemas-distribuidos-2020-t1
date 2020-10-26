const delay = require("delay")

const connector = require("./connector")
const portConfig = require("./portConfig")

//string global que vai ser modificada pelos clientes
let globalString = ""

//faz requisição para o servidor de autorização, com um delay aleatório entre 0 e 1 segundos
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

//se tudo der certo, retorna um json com um atributo success com valor true e o valor do globalString
const makeSuccessResponse = () => ({
    success: true,
    globalString
})

//se der erro, retorna um json com um atributo success com valor false e a mensagem de erro 
const makeErrorResponse = message => ({
    success: false,
    message
})

//lida com as requisições do cliente
const requestHandler = async data => {
    //pega a substring que o cliente quer adicionar a string global
    const { subStr } = data

    //pede ao servidor de autorização para fazer lock
    const message = await lockRequest(true)

    //se conseguir fazer lock 
    if (message === "locked") {
        console.log(subStr, "locked")

        //adiciona a substring à string global  
        globalString += subStr
        console.log(subStr, "string modified")

        //pede ao servidor de autorização para fazer unlock, repete a requisição até dar certo
        let unlockMessage = await lockRequest(false)
        while (unlockMessage !== "unlocked") {
            await delay(1000)
            unlockMessage = await lockRequest(false)
        }

        //retorna json de sucesso ao cliente
        console.log(subStr, "unlocked")
        return makeSuccessResponse()
    }

    //se não, retorna a mensagem de erro do servidor de autorização
    console.log(subStr, "unable to lock")
    return makeErrorResponse(message)
}

const errorHandler = error => console.log(error)

connector.createServer({
    port: portConfig.stringServer,
    requestHandler,
    errorHandler
})
