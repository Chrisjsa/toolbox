const express = require('express');
const router = express.Router();

const axios = require('axios')
const fs = require("fs");

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

// const download_file = (file) => {
//     try {
//         let url = secret_url+'/'+file
//         console.log(url)
//         return (axios.get(url, {
//             headers: {
//                 'Authorization': 'Bearer aSuperSecretKey'
//             }
//         }))
//     }
//     catch (error) {
//         console.error(error)
//     }
// }

/* GET. */
router.get('', async function (req, res) {
    const processed_files = []
    let pass = false
    let dict_file

    // let listed_files = await file_list()
    const listed_files = [
        'file1.csv,RgTya,64075909,70ad29aacf0b690b0467fe2b2767f765',
        'file1.csv,AtjW,6,d33a8ca5d36d3106219f66f939774cf5',
        'file1.csv,PNzRfORtKtEDOzmIVrQuSh,74088708,3e29651a63a5202a5661e05a060401fb',
        'file1.csv,d,6173,f9e1bcdb9e3784acc448af34f47252',
        'file2.csv,RgTya,998855,70ad29aacf0b690b0467fe2b2767f765'
    ]

    if(hasQueryParams(req.url)){
        if (req.query.fileName) {
            let file = req.query.fileName.slice(1,-1)
            if (file.indexOf('.csv') !== -1) {
                for (let each of listed_files){
                    if (each.indexOf(file) !== -1) {
                        dict_file = passing_dict(each)
                        pass = validate_file(dict_file['text'], dict_file['number'], dict_file['hex'])
                        if (pass) {
                            processed_files.push(dict_file)
                            break
                        } else {
                            processed_files.push({'Error':'Formato de archivo no es valido.'})
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
        for (let each of listed_files) {
            pass = false
            let filename = 'file1.csv'
            let dict_file = passing_dict(each)
            if (dict_file['file'] === filename) {
                pass = validate_file(dict_file['text'], dict_file['number'], dict_file['hex'])
                if (pass) {
                    processed_files.push(dict_file)
                }
            }
        }


        // for (let each of listed_files.data['files']) {
        //     let current_file = await download_file(each).then(response => {
        //         response.data.pipe(fs.createWriteStream('test_file'))
        //     }).catch(error => {
        //         console.log(error);
        //     })
        //     console.log(current_file)
        // }
    }

    res.contentType('application/json')
    res.send(processed_files);
});

module.exports = router;
