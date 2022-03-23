const axios = require('axios')

const secret_url = 'https://echo-serv.tbxnet.com/v1/secret/file'

function hasQueryParams(url) {
    return url.includes('?');
}

const isHex = function checkHex(isHex) {
    return /^[0-9A-F]+$/ig.test(isHex);
}

const validate_file = function validate(text, number, hex) {
    if ((isNaN(text)) && (isNaN(number) === false) && (isHex(hex)) && (hex.length === 32)) {
        return true
    }
}

const passing_dict = function assign(record) {
    let current_record = record.split(',')
    return {
        'file': current_record[0],
        'text': current_record[1],
        'number': current_record[2],
        'hex': current_record[3]
    }
}

const file_list = () => {
    try {
        return (axios.get(secret_url+'s/', {
            headers: {
                'Authorization': 'Bearer aSuperSecretKey'
            }
        }))
    }
    catch (error) {
        console.error(error)
    }
}

const download_file = async (file) => {
    try {
        let processed_content = []
        let dict_file
        let pass = false
        let content;
        let url = secret_url + '/' + file
        let payload

        await (axios.get(url, {
            headers: {
                'Authorization': 'Bearer aSuperSecretKey'
            }
        })).then(response => payload = response.data).catch(error => payload = error.message)
        content = payload.split('\n')
        for (let each of content) {
            dict_file = passing_dict(each)
            pass = validate_file(dict_file['text'], dict_file['number'], dict_file['hex'])
            if (pass) {
                processed_content.push(dict_file)
            }
        }

        return {pass, processed_content}
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    hasQueryParams,
    file_list,
    download_file
}
