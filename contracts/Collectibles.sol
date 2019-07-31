pragma solidity ^0.5.0;

import "zeppelin/contracts/token/ERC721/ERC721Full.sol";


/// @title A trading platform for digital art
/// @author Manank Patni
/// @notice The contract create a platform for the digital art trading and showcase
/// @dev The contract inherits ERC721 token to implement NFT
contract Collectibles is ERC721Full {


    address payable public contract_owner;

    bool private stop = true;

    modifier contractOwner{
        require(msg.sender == contract_owner);
        _;
    }

    modifier paidEnough(uint _price){
        require(_price <= msg.value);
        _;
    }

    modifier onSale(uint id){
        require(art_list[id].onsale == true);
        _;
    }

    modifier onlyOwner(uint id){
        require(art_list[id].owner == msg.sender);
        _;
    }

    modifier stopFunctioning{
        require(stop == true);
        _;
    }

    event AddArt(uint artid);
    event SwitchSaleStatus(uint artid, bool status); 

    struct Art{
        uint id;
        string name;
        string description;
        string image;
        address payable artist;
        uint price;
        address payable owner;
        bool onsale;
    }
    
    Art[] private art_list;

    /// @dev Makes the contract deployer as owner, set Token Symbol and Name
    constructor() ERC721Full("DigArt", "DAC") public {
        contract_owner = msg.sender;
    }

    /// @notice Owner can disable the app temporarily in case of emergency
    /// @dev Creates a circuit breaker in case of unprecedented bugs, switches on and off
    function switchContractWorking() public contractOwner{
        if(stop == true){
            stop = false;
        }
        else{
            stop = true;
        }
    }

    /// @dev Returns the number total number of tokens
    /// @return count in integers
    function getartlength() public view returns (uint) {
        uint count = art_list.length;
        return count;
    }

    /// @dev Get a particular token by id
    /// @param id of token
    /// @return Returns id, name, description, image, artist, price, owner, onsaleornot
    function getArt(uint id) public view returns (uint, string memory, string memory, string memory, address, uint, address, bool) {
        Art memory a = art_list[id];
        return (id, a.name, a.description, a.image, a.artist, a.price, a.owner, a.onsale);
    }

    /// @dev Convert a digital art to NFT
    /// @param name Name of the Token
    /// @param desc Short description of the collectibles
    /// @param image_url IPFS url of the image
    /// @param price Collectibe sell price
    /// @return id of minted token
    function convert_art(string memory name, string memory desc, string memory image_url, uint price) public stopFunctioning{
        uint id = art_list.length;
        art_list.push(Art(id,name,desc,image_url,msg.sender,price,msg.sender,false));
        _mint(msg.sender,id);
        emit AddArt(id);
    }

    /// @dev Returns the tokens ids for particular owner, uses ERC721 _tokensofOwner
    /// @param _owner Takes address of owner
    /// @return count of integers of ids
    function ownerArtsCount(address _owner) public view returns(uint[] memory){
        return _tokensOfOwner(_owner);
    }

    /// @notice Transfer the amount equal to price and transfers the ownership of token
    /// @dev Uses _transferFrom of the ERC721 implementation
    /// @param id of token
    function buy_art(uint id) public payable paidEnough(art_list[id].price) onSale(id) stopFunctioning{
        address payable _owner = art_list[id].owner;
        art_list[id].onsale = false;
        _owner.transfer(msg.value);
        art_list[id].owner = msg.sender;
        _transferFrom(_owner, msg.sender, id);
    }

    /// @dev Update price of Token
    /// @param id Token Id
    /// @param price Price of the collectible
    function price_update(uint id, uint price) public onlyOwner(id){
        art_list[id].price = price;
    }

    /// @notice Switch a digital art on/off sale
    /// @dev Only the owner of token can switch this status
    /// @param id Id of the token
    function switchSaleStatus(uint id) public onlyOwner(id){
        bool status = art_list[id].onsale;
        if(status == true){
            art_list[id].onsale = false;
        }
        else{
            art_list[id].onsale = true;
        }

        emit SwitchSaleStatus(id, status);
    }
}
