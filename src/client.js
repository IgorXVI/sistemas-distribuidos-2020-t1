const net = require("net")

const options = {
    port: 2220
}

const userInfo = {
    user: "igor",
    password: "password1",
    type: "G"
}

const userInfoStr = JSON.stringify(userInfo)

const client = net.createConnection(options, () => {
    client.write(userInfoStr + "\r\n")
})

client.on("data", data => {
    console.log("Returned data: ", JSON.parse(data.toString()))
    client.end()
})