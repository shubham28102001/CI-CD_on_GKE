const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const csvParser = require("csv-parser");
const PORT = 3001;
const app = express();

const DIR_NAME = './Shubham_PV_dir';

app.use(bodyParser.json());

app.post("/sum", async (req, res) => {
    let data = req.body;
    let fileName = data.file;
    let filePath = DIR_NAME + '/' + fileName;
    let product = data.product;
    let sum = 0;
    let dataArr = [];

    try {
        fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (record) => {
            if(record.product && record.amount) {
                dataArr.push(record)
                if(record.product == product) {
                    sum += parseInt(record.amount, 10);
                }
            }
        })
        .on('end', () => {
            if( dataArr.length == 0 ) {
                return res.json(
                    {
                        file: fileName,
                        error: "Input file not in CSV format."
                    }
                )
            }
            return res.json(
                {
                    file: fileName, 
                    sum: sum 
                }
            );
        })
    } catch (error) {
        console.log(error);
        return res.json(
            {
                file: fileName, 
                error: "Error parsing input file." 
            }
        );
    }
});

app.listen(PORT, () => {
    if (!fs.existsSync(DIR_NAME)) {
        fs.mkdirSync(DIR_NAME);
    }
    console.log(`Container 2 listening on port ${PORT}`);
})
