###Crypta-DigitalArt-Collectibles

This project is made for Consensys Ethereum Bootcamp Spring 2019
>Author: Manank Patni

The project creates a decentralised space for the designers and artists to showcase their craetions and earn from it. 

It uses the ERC721 standard for the Non Fungible Token Creation. Any user can submit their art piece like a wallpaper, digital paing, poster or etc. They can showcase it and even trade it for ether.

##How to set it up?

- Clone this directory using `git clone`
- Run ganache using `ganache-cli` or ganache gui
- Run `truffle compile` and `truffle migrate`
- Start the Frontend Server using `npm run dev`
- The site can be seen on `localhost:3000`

##What all can it currently do?
- A person can connect to Metamask to browse the site
- Any user can submit their art/design
- Users can see all the collectibles
- Users can update the state of their collectible to be on sale on not
- Users can buy the collectible by paying ether
- Owner can stop the funcitoning of Dapp in case of emergency

## Evaluation checklist

- [x] README.md
- [X] Screen recording [!!]
- [x] Truffle project - compile, migrate, test
- [x] Smart Contract Commented
- [x] Library use
- [x] Local development interface
    - [x] Displays the current ETH Account
    - [x] Can sign transactions using MetaMask
    - [x] App interface reflects contract state
- [x] 5 tests in Js or Sol
    - [x] Structured tests
    - [x] All pass
- [x] Circuit breaker/Emergency stop
- [x] Project includes a file called design_pattern_desicions.md / at least 2 implemented
- [x] avoiding_common_attacks.md and explains at least 3 attacks and how it mitigates
- [x] deployed_addresses.txt that indicates contract address on testnet
- [ ] upgradeable design pattern
- [ ] One contract written in Vyper or LLL
- [x] IPFS
- [ ] uPort
- [ ] ENS
- [ ] Oracle


