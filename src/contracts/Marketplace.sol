pragma solidity ^0.5.0;


contract Marketplace {
    string public name;

    uint public productCount = 0;

    mapping(uint => Product) public products;

    struct Product {
        uint id;
        string name;
        uint price;
        address payable owner; 
        bool purchased;
    }

    event ProductCreated(
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased

    );

    event ProductPurchased(
         uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased


    );

    constructor() public {
        name = "Mega";
    }



    function createProduct(string memory _name, uint _price ) public {

        require(bytes(_name).length > 0);
        require(_price > 0);

        productCount++;

        products[productCount] = Product(productCount, _name,_price, msg.sender, false);

        emit ProductCreated(productCount, _name,_price, msg.sender, false);
    }   

    function purchaseProduct(uint _id) public payable {

        Product memory newProduct = products[_id];

        address payable _seller = newProduct.owner;

        require(newProduct.id > 0 && newProduct.id <= productCount);
        require(msg.value >= newProduct.price);

        require(!newProduct.purchased);

        require(_seller != msg.sender);

        

        newProduct.owner = msg.sender;

        // mark as purchased 

        newProduct.purchased = true;

        // update the product

        products[_id] = newProduct;



        // Send ether

         address(_seller).transfer(msg.value);

         emit ProductPurchased(productCount, newProduct.name, newProduct.price, msg.sender, true);
        
    }

    
    
}

