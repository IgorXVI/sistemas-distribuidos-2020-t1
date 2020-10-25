const cluster = require("cluster")
const delay = require("delay")

const connector = require("./connector")
const portConfig = require("./portConfig")

const run = async () => {
    // eslint-disable-next-line no-constant-condition
    while(true) {
        try {
            const response = await connector.request({
                data: {
                    subStr: ` - ID ${cluster.worker.id}: ${new Date().getTime()}`
                },
                port: portConfig.stringServer
            })
            console.log(response)
        }
        catch (error) {
            console.log(error)
        }
   
        await delay(Math.random() * 2000 + 3000)
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
