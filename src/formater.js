//tranforma buffer em JSON
const parseDataToJSON = data => JSON.parse(data.toString())

//transforma JSON em string, com separador
const formatToSendJSON = json => JSON.stringify(json) + "\r\n"

module.exports = {
    parseDataToJSON,
    formatToSendJSON
}