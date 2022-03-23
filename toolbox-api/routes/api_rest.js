const express = require('express');
const router = express.Router();

const axios = require('axios')
const fs = require("fs");
const {response} = require("express");

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

/* GET. */
router.get('', async function (req, res) {
    const processed_files = []

    const listed_files2 = await file_list()

    if(hasQueryParams(req.url)){
        if (req.query.fileName) {
            let filename = req.query.fileName.slice(1,-1)
            if (filename.indexOf('.csv') !== -1) {
                for (let file of listed_files2.data['files']) {
                    if (file.indexOf(filename) !== -1) {
                        let {pass, processed_content} = await download_file(filename)
                        for (let each of processed_content) {
                            if (pass) {
                                processed_files.push(each)
                            }
                        }
                    }
                }
            } else {
                processed_files.push({'Error':'Extension de archivo no es valido.'})
            }
        } else {
            processed_files.push({'Error':'Query no es valido.'})
        }
    }else{
        for (let filename of listed_files2.data['files']) {
            let {pass, processed_content} = await download_file(filename)
            for (let each of processed_content) {
                if (pass) {
                    processed_files.push(each)
                }
            }
        }
    }

    res.contentType('application/json')
    res.send(processed_files);
});

module.exports = router;
