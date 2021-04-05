import Image from "../models/Image";
let images = {};

images.find = async(req,res) => {
    await Image.find( (err,images) => {
        if(err) res.send(err)
        res.send(images)
    })
}

module.exports = images;