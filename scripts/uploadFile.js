require('dotenv').config()

const axios = require("axios");
const console = require('console');
const fs = require("fs")
const FormData = require("form-data");
const { PINATA_API_KEY, PINATA_SECRET_KEY } = process.env

const pinFileToIPFS = async (minter, fileName) => {
    let imageData = new FormData()
    imageData.append("file", fs.createReadStream(`${__dirname}/${fileName}.jpeg`))
    
    const imageResponseData = await pushFileToIPFS(imageData)
    const imageURI = `https://ipfs.io/ipfs/${imageResponseData.IpfsHash}`

    console.log("ImageURI: ", imageURI)

    const currentDate = Date.now()
    const metaDataFilePath = `${__dirname}/${currentDate}_meta.json`

    let metaData = JSON.stringify({
        name: "SimpleNFT",
        image: imageURI,
        description: "A simple NFT",
    })

    fs.writeFileSync(metaDataFilePath, metaData, (err) => {
        if (err) {
            throw err
        }

        console.log("metadata saved")
    })


    let jsonData = new FormData()
    jsonData.append("file", fs.createReadStream(metaDataFilePath))
    
    const jsonResponseData = await pushFileToIPFS(jsonData)
    const jsonURI = `https://ipfs.io/ipfs/${jsonResponseData.IpfsHash}`

    return jsonURI
}

async function pushFileToIPFS(fileData) {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

    try {
        const res = await axios.post(
            url, 
            fileData,
            {
                maxContentLength: "Infinity",
                headers: {
                    "Content-Type": `multipart/form-data; boundary=${fileData._boundary}`,
                    pinata_api_key: PINATA_API_KEY,
                    pinata_secret_api_key: PINATA_SECRET_KEY,
                },
            }
        )
        return res.data
    } catch(error) {
        console.error(error.message)
        return null
    }
}

module.exports = { pinFileToIPFS }