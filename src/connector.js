const net = require("net")

const formater = require("./formater")

//faz uma requisição para um servidor
const request = ({
    data,
    port
}) => new Promise((resolve, reject) => {
    //cria uma conexão com o servidor, com base no port
    const client = net.createConnection({ port }, () => {
        //manda o json informado pelo usuário
        client.write(formater.formatToSendJSON(data))
    })

    //espera a resposta do servidor
    client.on("data", serverData => {
        //termina a conexão
        client.end()
        //retorna a resposta do servidor em json
        resolve(formater.parseDataToJSON(serverData))
    })

    //joga um erro, se tiver erro  
    client.on("error", error => reject(error))
})

//cria um servidor
const createServer = ({
    //função que lida com as requisições, recebendo o json que o cliente manda e retornando um json de resposta, deve ser assíncrona 
    requestHandler,
    //função que lida com erros
    errorHandler,
    //porta do servidor
    port
}) => {
    const server = net.createServer(conn => {
        //lida com a requisição do cliente
        conn.on("data", clientData =>
            //manda os dados que o cliente informa no formato de json  
            requestHandler(formater.parseDataToJSON(clientData))
                //manda os dados retornados da função para o cliente
                .then(response => conn.write(formater.formatToSendJSON(response)))
                //lida com erros dentro da função
                .catch(errorHandler)
        )

        //lida com erro
        conn.on("error", errorHandler)
    })

    //escuta na porta informada pelo usuário
    server.listen(port)

    console.log(`Server listening on port ${port}`)
}

module.exports = {
    request,
    createServer
}