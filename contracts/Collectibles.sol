pragma solidity ^0.5.0;

import "zeppelin/contracts/token/ERC721/ERC721Full.sol";


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


    constructor() ERC721Full("RareItem", "RTM") public {
        contract_owner = msg.sender;
    }

    function switchContractWorking() public contractOwner{
        if(stop == true){
            stop = false;
        }
        else{
            stop = true;
        }
    }

    function getartlength() public view returns (uint) {
        uint count = art_list.length;
        return count;
    }

    function getArt(uint id) public view returns (uint, string memory, string memory, string memory, address, uint, address, bool) {
        Art memory a = art_list[id];
        return (id, a.name, a.description, a.image, a.artist, a.price, a.owner, a.onsale);
    }

    function convert_art(string memory name, string memory desc, string memory image_url, uint price) public stopFunctioning{
        uint id = art_list.length;
        art_list.push(Art(id,name,desc,image_url,msg.sender,price,msg.sender,false));
        _mint(msg.sender,id);
        emit AddArt(id);
    }

    function ownerArtsCount(address _owner) public view returns(uint[] memory){
        return _tokensOfOwner(_owner);
    }

    function buy_art(uint id) public payable paidEnough(art_list[id].price) onSale(id) stopFunctioning{
        address payable _owner = art_list[id].owner;
        _owner.transfer(msg.value);
        art_list[id].owner = msg.sender;
        art_list[id].onsale = false;
        _transferFrom(_owner, msg.sender, id);
    }

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
