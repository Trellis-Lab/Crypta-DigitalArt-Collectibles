/*

The public version of the file used for testing can be found here: https://gist.github.com/ConsenSys-Academy/7d59ba6ebe581c1ffcc981469e226c6e

This test file has been updated for Truffle version 5.0. If your tests are failing, make sure that you are
using Truffle version 5.0. You can check this by running "truffle version"  in the terminal. If version 5 is not
installed, you can uninstall the existing version with `npm uninstall -g truffle` and install the latest version (5.0)
with `npm install -g truffle`.

*/
let BN = web3.utils.BN
let Collectibles = artifacts.require('Collectibles')
let catchRevert = require("./exceptionHelpers.js").catchRevert

contract('Collectibles', function(accounts) {

    const owner = accounts[0]
    const alice = accounts[1]
    const bob = accounts[2]
    const oliver = accounts[3]
    const emptyAddress = '0x0000000000000000000000000000000000000000'

    const art = [1,'monalisa','this is monalisa', 'monal.png' , alice, 32165, alice, false]

    let instance

    beforeEach(async () => {
        instance = await Collectibles.new()
    })

    it("should add art with the provided details", async() => {
        const tx = await instance.convert_art(art[1], art[2] ,art[3], art[5], {from: alice})
                
        const result = await instance.getArt.call(0)

        assert.equal(result[1], art[1], 'the name of the last added item does not match the expected value')
        assert.equal(result[5].toString(10), art[5], 'the price of the last added item does not match the expected value')
        assert.equal(result[7], false, 'the state of the item should be "Not For Sale"')
        assert.equal(result[4], alice, 'the address adding the item should be listed as the artist')
        assert.equal(result[6], alice, 'the address adding the item should be listed as the owner')
    })

    it("should emit a AddArt event when an art is added", async()=> {
        let eventEmitted = false
        const tx = await instance.convert_art(art[1], art[2] ,art[3], art[5], {from: alice})
        
        if (tx.logs[1].event == "AddArt") {
            eventEmitted = true
        }

        assert.equal(eventEmitted, true, 'adding an item should emit a AddArt event')
    })

    it("should switch the sale status", async() => {
        const tx = await instance.convert_art(art[1], art[2] ,art[3], art[5], {from: alice})
        const tx2 = await instance.switchSaleStatus(0, {from: alice})
        const result = await instance.getArt.call(0)

        assert.equal(result[7], true, 'it should be changed to true')
    })

    it("should emit a SwitchSaleStatus event when an art is added", async()=> {
        let eventEmitted = false
        await instance.convert_art(art[1], art[2] ,art[3], art[5], {from: alice})
        const tx = await instance.switchSaleStatus(0, {from: alice})

        if (tx.logs[0].event == "SwitchSaleStatus") {
            eventEmitted = true
        }

        assert.equal(eventEmitted, true, 'switching the sale status of an item should emit a SwitchSaleStatus event')
    })

    it("should give error when a buyer tries to buy a not for sale item", async() => {
    	const tx = await instance.convert_art(art[1], art[2] ,art[3], art[5], {from: alice})
    	await catchRevert(instance.buy_art(0, {from: bob, value: 32165}))
    })

    it("should error when not enough value is sent when purchasing an item", async()=>{
         await instance.convert_art(art[1], art[2] ,art[3], art[5], {from: alice})
        const tx2 = await instance.switchSaleStatus(0, {from: alice})
        
        await catchRevert(instance.buy_art(0, {from: bob, value: 31}))
    })

})
 
