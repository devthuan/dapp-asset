// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AssetManager {
    struct Asset {
        string name;
        uint256 purchaseDate;
        uint256 value;
        string description;
        string imageURL;
        string note;
    }


    mapping(address => Asset[]) public userAssets; 

    function addAsset(
        string memory _name,
        uint256 _purchaseDate,
        uint256 _value,
        string memory _description,
        string memory _imageURL,
        string memory _note
    ) public {
        Asset memory newAsset = Asset({
            name: _name,
            purchaseDate: _purchaseDate,
            value: _value,
            description: _description,
            imageURL: _imageURL,
            note: _note
        });
        

        userAssets[msg.sender].push(newAsset);
    }

    function editAsset(
        uint256 _assetIndex,
        string memory _name,
        uint256 _purchaseDate,
        uint256 _value,
        string memory _description,
        string memory _imageURL,
        string memory _note
    ) public {
        require(_assetIndex < userAssets[msg.sender].length, "Asset does not exist");
        
        Asset storage asset = userAssets[msg.sender][_assetIndex];
        asset.name = _name;
        asset.purchaseDate = _purchaseDate;
        asset.value = _value;
        asset.description = _description;
        asset.imageURL = _imageURL;
        asset.note = _note;
    }


    function deleteAsset(uint256 _assetIndex) public {
        require(_assetIndex < userAssets[msg.sender].length, "Asset does not exist");


        uint256 lastIndex = userAssets[msg.sender].length - 1;
        userAssets[msg.sender][_assetIndex] = userAssets[msg.sender][lastIndex];
        userAssets[msg.sender].pop();
    }


    function getUserAssets() public view returns (Asset[] memory) {
        return userAssets[msg.sender];
    }


    function getAssetDetails(uint256 _assetIndex) public view returns (Asset memory) {
        require(_assetIndex < userAssets[msg.sender].length, "Asset does not exist");
        return userAssets[msg.sender][_assetIndex];
    }
}
