const Marketplace = artifacts.require('./Marketplace.sol')


require('chai')
.use(require("chai-as-promised"))
.should()


contract('Marketplace', ([buyer,seller,owner]) =>{
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
            result = await marketplace.createProduct("car", web3.utils.toWei('1', 'Ether'), {from:seller})
            productCount = await marketplace.productCount()
        })
        it("PRoduct created successfully", async()=>{
            assert.equal(productCount, 1)

            const event = result.logs[0].args
            assert.equal(event.id.toNumber() , productCount.toNumber(), "ID is correct")
            assert.equal(event.price , 1000000000000000000, "Price is correct")

            console.log(event)
    
            // Failures Product must have a name

            await await marketplace.createProduct("", web3.utils.toWei('1', 'Ether'), {from:seller}).should.be.rejected

            await await marketplace.createProduct("", 0, {from:seller}).should.be.rejected


                
        })

        it("list products", async() =>{
            const product = await marketplace.products(productCount)
            assert.equal(product.id.toNumber(), productCount.toNumber(), "ID is correct")
            assert.notEqual(product.name, "")

        })

        it('Sells Product', async()=>{

            let oldSellerBalance

            oldSellerBalance = await web3.eth.getBalance(seller)
            oldSellerBalance = new web3.utils.BN(oldSellerBalance)

             result = await marketplace.purchaseProduct(productCount, {from : buyer, value : web3.utils.toWei('1',"Ether")})

             const event = result.logs[0].args

            //  check logs
            assert.equal(event.id.toNumber(), productCount.toNumber(), "ID is correct")


            assert.notEqual(event.name, "")

            assert.equal(event.owner , buyer, "Owner is correct")
            assert.equal(event.purchased, true, "Purchased is correct")


            // Check that seller receieved funds

            let newSellerBalance

            newSellerBalance = await web3.eth.getBalance(seller)
            newSellerBalance = new web3.utils.BN(newSellerBalance)


            let price 

            price = web3.utils.toWei('1', 'Ether')
            price = new web3.utils.BN(price)

            console.log(oldSellerBalance, newSellerBalance, price)

            const expectedBalance =oldSellerBalance.add(price)

            assert.equal(newSellerBalance.toString(), expectedBalance.toString())




        })


    })
})  





    


    