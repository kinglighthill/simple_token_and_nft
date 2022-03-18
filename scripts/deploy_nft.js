const { ethers } = require("hardhat")
const { pinFileToIPFS } = require("./uploadFile")

async function main() {
    const simpleNFTContract = await ethers.getContractFactory("SimpleNFT")
    const simpleNFT = await simpleNFTContract.deploy()
    await simpleNFT.deployed()

    await sleep(1000 * 60)
    
    console.log("Contract deployed to address: ", simpleNFT.address)

    console.log("minting nfts...")

    await mint(simpleNFT, "my_nft")

    await sleep(1000 * 60)

    await mint(simpleNFT, "ape")

    console.log("Count: ", await simpleNFT.tokenId())
}

async function mint(contract, imageName) {
    const URI = await pinFileToIPFS(contract.address, imageName)
    const trx = await contract.mint(URI)
    trx.wait(3)
    
    console.log("my nft minted");
}

async function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time))
}

const runMain = async () => {
    try {
        await main()
        process.exit(0)
    } catch(error) {
        console.error(error)
        process.exit(1)
    }
}

runMain()