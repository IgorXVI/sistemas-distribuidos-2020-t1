const net = require("net")

const formater = require("./formater")

const request = ({
    data,
    port
}) => new Promise((resolve, reject) => {
    const client = net.createConnection({ port }, () => {
        client.write(formater.formatToSendJSON(data))
    })

    client.on("data", serverData => {
        client.end()
        resolve(formater.parseDataToJSON(serverData))
    })

    client.on("error", error => reject(error))
})

const createServer = ({
    requestHandler,
    errorHandler,
    port
}) => {
    const server = net.createServer(conn => {
        conn.on("data", clientData =>
            requestHandler(formater.parseDataToJSON(clientData))
                .then(response => conn.write(formater.formatToSendJSON(response)))
                .catch(errorHandler)
        )

        conn.on("error", errorHandler)
    })

    server.listen(port)

    console.log(`Server listening on port ${port}`)
}

module.exports = {
    request,
    createServer
}