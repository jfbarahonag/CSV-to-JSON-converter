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

fs.createReadStream('data.csv')
    .pipe(csv())
    .on('data', row => { //a row is an object

        let features_temp

        if (row.features.includes('-')) //has multiples features
        {
            features_temp = row.features.split('-')
            row.features = features_temp
        } else {// has only one feature
            features_temp = row.features
            row.features = []
            row.features.push(features_temp)
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
        fs.writeFileSync('data.json', data)
    })


// fs.createReadStream('data.csv')
//     .pipe(csv())
//     .on('data', row => {

//         // first input
//         if (buffer.length == 0) {
//             const img_temp = row.image
//             row.image = []
//             row.image.push(img_temp)

//             buffer.push(row)
//         } else {
//             buffer.map( (obj, idx) => {
//                 if (obj.slug !== row.slug) {
//                     const img_temp = row.image
//                     row.image = []
//                     row.image.push(img_temp)
//                     buffer.push(row)
//                 } else {
//                     /* exists */
//                     buffer[idx].image.push(row.image);
//                 }
//             })
//         }

    

//     })
//     .on('end', () => {
//         console.log(buffer)
//     })