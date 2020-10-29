const cluster = require("cluster")
const delay = require("delay")

const connector = require("./connector")
const portConfig = require("./portConfig")

//roda um cliente
const run = async () => {
    //loop infinito de requisições
    // eslint-disable-next-line no-constant-condition
    while(true) {
        try {
            //faz requisição para o servidor de string, pedindo para concatenar a substring à string global
               
            const id = `${cluster.worker.id}: ${new Date().getTime()}`

            const response = await connector.request({
                data: {
                    subStr: ` - ID ${id}`
                },
                port: portConfig.stringServer
            })
            //resposta do servidor de string, contendo uma flag de sucesso e a string global modificada (success: true) ou uma mensagem de erro (success: false)
            response.id = id
            console.log(response)
        }
        catch (error) {
            console.log(error)
        }
        
        //espera uma quandidade aleatória de segundos, entre 3 e 5 para seguir para a próxima iteração
        await delay(Math.random() * 2000 + 3000)
    }
}

//confere se o cluster é o master
if (cluster.isMaster) {
    //se for, cria dois processos filhos separados, que vão rodar em paralelo
    for (let i = 0; i < 2; i++) {
        cluster.fork()
    }
}
else {
    //roda o cliente
    run()
}