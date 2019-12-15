const Marketplace = artifacts.require('./Marketplace.sol')

contract('Marketplace', (accounts) =>{
    let marketplace

    before(async () => {
        marketplace = await Marketplace.deployed()
    })

    describe('deployment', async() =>{
        it("deployes succesffully", async()=>{
            const address = await marketplace.address
            assert.notEqual(address, 0x0)
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        })

        it("has a name", async()=>{
            const name = await marketplace.name()
            assert.equal(name, "Mega")
        })



        
    })

    
// Test to check if products are valid

    describe("Products", async()=>{
        let result, productCount
        before(async()=>{
            result = await marketplace.createProduct("car", web3.utils.toWei('1', 'Ether'))
            productCount = await marketplace.productCount()
        })
        it("PRoduct created successfully", async()=>{
            assert.equal(productCount, 1)
            console.log(result.logs)
                
        })
    })
})  





    


    