const express = require('express');
const router = express.Router();
const components = require('../controller/components')

/* GET. */
router.get('', async function (req, res) {

    const listed_files = await components.file_list()
    console.log(listed_files)

    res.send(listed_files.data['files']);
});

module.exports = router;
