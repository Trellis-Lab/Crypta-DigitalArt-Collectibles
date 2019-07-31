##Design Patterns Decisions 

##Using ERC721

 The ERC721 tokens are a very good wasy one can represent a thing like Unique Digital Art. 

#Features provided by the ERC721 fit for my project:- 

- A digital art piece must be unique
- Digital art must be tradable and transferrable 

##Using OpenZepplin contract:-

- One should be using extrenal contracts from trusted sources and battle tested code
- Zepplin contracts provide a standard ERC721 full implementation which covers for all of ERC721 features with security

##Circuit Breaker:-

- A circuit breaker has been implementaed with the name switchContractWorking()
- In case of any bug the owner can switch the state to stop all transactions from happening

##Modifiers- 
- Multiple modifiers are used to ensure the fulfilment of certain conditions before the execution of function

##Using web3js instead over other libraries like web3py for python
- Other libraries require the user to enter the private key in the platform where as using web3js users can use metamask and other such plugins keeping security in own hands.
