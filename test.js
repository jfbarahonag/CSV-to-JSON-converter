/**
 * Generates a JSON file from CSV file, [CAUTION!] only receives 
 * the first input subsequent inputs of the same slug will be 
 * ignored
 * 
 * Multiples characteristics will be separated by dashes
 * At the moment only applies for 'image' and 'features' fields
 */

const csv = require('csv-parser')
const fs = require('fs')

const buffer = []
const KEY = '`'
const OUTPUT_FILENAME = 'cell_data.json'
const INPUT_FILENAME = 'cell_data.csv'

fs.createReadStream(INPUT_FILENAME)
    .pipe(csv())
    .on('data', row => { //a row is an object

        let features_temp

        if (row.features.includes(KEY)) //has multiples features
        {
            features_temp = row.features.split(KEY)
            row.features = features_temp
        } else {// has only one feature
            features_temp = row.features
            row.features = []
            row.features.push(features_temp)
        }
        
        if (row.image.includes(KEY)) //has multiples images
        {
            image_temp = row.image.split(KEY)
            row.image = image_temp
        } else {// has only one feature
            image_temp = row.image
            row.image = []
            row.image.push(image_temp)
        }
        
        if (buffer.length == 0) {
            buffer.push(row)
        } else {

            let exists = false

            buffer.map(obj => {
                if (obj.slug === row.slug) {
                    exists = true
                    console.log('slug already exists -> ', row.name)
                    return
                }
            })
            
            if (exists !== true) {
                buffer.push(row)
            }
        }

    })
    .on('end', () => {
        const data = JSON.stringify(buffer)
        fs.writeFileSync(OUTPUT_FILENAME, data)
    })
