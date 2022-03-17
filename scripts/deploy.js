const { ethers } = require("hardhat")

async function main() {
    const simpleTokenContract = await ethers.getContractFactory("SimpleToken")
    const simpleToken = await simpleTokenContract.deploy()
    await simpleToken.deployed()
    
    console.log("Contract deployed to address: ", simpleToken.address)
}

const runMain = async () => {
    try {
        await main()
        process.exit(0)
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}

runMain()