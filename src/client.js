const cluster = require("cluster")

const connector = require("./connector")
const portConfig = require("./portConfig")

const run = async () => {
    try {
        const response = await connector.request({
            data: {
                name: "um dado"
            },
            port: portConfig.stringServer
        })
        console.log(response)
    }
    catch (error) {
        console.log(error)
    }
}

if (cluster.isMaster) {
    for (let i = 0; i < 2; i++) {
        cluster.fork()
    }
}
else {
    run()
}
