const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const axios = require('axios');
const PORT = 3000;
const app = express();

const DIR_NAME = './Shubham_PV_dir';

app.use(bodyParser.json());

app.post('/store-file', async (req, res) => {
    try {
        let data = req.body;

        if (!data || !data.file || !data.data || data.data == undefined) {
            return res.json(
                {
                    file: data.file,
                    error: "Invalid JSON input."
                }
            );
        }

        let fileName = data.file;
        let fileData = data.data;

        let formattedFileData = fileData.split('\n').map(line => line.replace(/\s/g, '')).join('\n');

        fs.writeFile(DIR_NAME + '/' + fileName, formattedFileData, (err) => {
            if (err) {
                return res.json(
                    {
                        file: fileName,
                        error: "Error while storing the file to the storage."
                    }
                );
            }
        });

        return res.json(
            {
                file: fileName,
                message: "Success."
            }
        );
    } catch (error) {
        console.log(error);
        return res.json(
            {
                error: error
            }
        );
    }
});


app.post('/calculate', async (req, res) => {
    try {
        let data = req.body;

        if (!data || !data.file || !data.product) {
            return res.json(
                {
                    file: null,
                    error: "Invalid JSON input."
                }
            );
        }

        let fileName = data.file;
        let product = data.product;

        if (!fs.existsSync(DIR_NAME + '/' + fileName)) {
            return res.json(
                {
                    file: fileName,
                    error: "File not found."
                }
            );
        }

        let request = {
            file: fileName,
            product: product
        };

        try {
            let response = await axios.post('http://container2-service:3001/sum', request);
            return res.json(response.data);
        } catch (error) {
            console.log(error);
            return res.json(
                {
                    error: error
                }
            );
        }
    } catch (error) {
        console.log(error);
        return res.json(
            {
                error: error
            }
        );
    }
});

app.listen(PORT, () => {
    if (!fs.existsSync(DIR_NAME)) {
        fs.mkdirSync(DIR_NAME);
    }
    console.log(`Container 1 listening on port ${PORT}`);
})