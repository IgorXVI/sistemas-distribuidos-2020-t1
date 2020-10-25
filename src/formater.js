const parseDataToJSON = data => JSON.parse(data.toString())

const formatToSendJSON = json => JSON.stringify(json) + "\r\n"

module.exports = {
    parseDataToJSON,
    formatToSendJSON
}