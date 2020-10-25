const connector = require("./connector")
const portConfig = require("./portConfig")

//lock global para alterar a string global
let globalLock = false

//função para formatar resposta do servidor, sempre vai ser uma das mensagens: "locked", "unlocked", "failed"
const makeResponse = message => ({ message })

//lida com as requisições do cliente
const requestHandler = async data => {
    //pega a flag informada pelo cliente, se for true é para fazer lock, se for false é para fazer unlock
    const { lock } = data

    console.log("incoming lock request:", lock)

    //se o cliente quiser fazer lock e o lock global estiver desativado, ativa o lock  
    if (lock === true && globalLock === false) {
        console.log("lock successful")

        globalLock = true
        return makeResponse("locked")
    }
    //se o cliente quiser desativar o lock
    else if (lock === false) {
        console.log("unlock successful")

        //se o lock estiver ativado, desativa ele
        if (globalLock === true) {
            console.log("changing lock value to false")
            globalLock = false
        }
        //se não, não faz nada
        
        return makeResponse("unlocked")
    }
    //só cai aqui os casos que o lock for true e o global lock for false, ou seja, tentou fazer lock mas já estava ativado
    else {
        console.log("lock failed, already locked")
        return makeResponse("failed")
    }
}

//lida com erro
const errorHandler = error => console.log(error)

//cria o servidor
connector.createServer({
    port: portConfig.authServer,
    requestHandler,
    errorHandler
})