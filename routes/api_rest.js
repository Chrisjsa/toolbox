const express = require('express');
const router = express.Router();

const axios = require('axios')
const fs = require("fs");

const secret_url = 'https://echo-serv.tbxnet.com/v1/secret/file'

/* GET. */
router.get('/', async function (req, res) {
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

    const download_file = (file) => {
        try {
            let url = secret_url+'/'+file
            console.log(url)
            return (axios.get(url, {
                headers: {
                    'Authorization': 'Bearer aSuperSecretKey'
                }
            }))
        }
        catch (error) {
            console.error(error)
        }
    }

    let listed_files = await file_list()


    for (const each of listed_files.data['files']) {
        let current_file = await download_file(each).then(response => {
            response.data.pipe(fs.createWriteStream('test_file'))
        }).catch(error => {
            console.log(error);
        })
        console.log(current_file)
    }
    res.send(response.data);
});

module.exports = router;
