const express = require('express');
const router = express.Router();
const components = require('../controller/components')

/* GET. */
router.get('', async function (req, res) {
    const processed_files = []

    const listed_files = await components.file_list()

    if(components.hasQueryParams(req.url)){
        if (req.query.fileName) {
            let filename = req.query.fileName.slice(1,-1)
            if (filename.indexOf('.csv') !== -1) {
                for (let file of listed_files.data['files']) {
                    if (file.indexOf(filename) !== -1) {
                        let {pass, processed_content} = await components.download_file(filename)
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
        for (let filename of listed_files.data['files']) {
            let {pass, processed_content} = await components.download_file(filename)
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
