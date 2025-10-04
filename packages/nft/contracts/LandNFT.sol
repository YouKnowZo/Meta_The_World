// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract LandNFT is ERC721 {
    struct Land {
        int256 lat;
        int256 lng;
        string uri;
    }
    mapping(uint256 => Land) public lands;
    uint256 private _tokenIdCounter;

    constructor() ERC721("MetaLand", "MLAND") {}

    function mintLand(int256 lat, int256 lng, string memory uri) public {
        uint256 tokenId = ++_tokenIdCounter;
        lands[tokenId] = Land(lat, lng, uri);
        _safeMint(msg.sender, tokenId);
    }
}
