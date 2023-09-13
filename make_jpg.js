import jimp from 'jimp'
import fs from 'fs'
import path from 'path'

const from_path = 'png_assets/locations'
const to_path = 'public/assets/locations'

let images = fs.readdirSync(from_path)
images.map(i => {
    let inputPath = path.join(from_path, i)
    let outputPath = path.join(to_path, i).replace('.png', '.jpg')

    jimp.read(inputPath).then(image => {
        return image
            .quality(60) // Set JPEG quality to 60 (0 to 100)
            .writeAsync(outputPath)
    })
})
