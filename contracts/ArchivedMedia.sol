// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./types/MarketTypes.sol";
import "./IMarketAPI.sol";

/** @title ArchivedMedia an FVM NFT Collection. */
/// @author Nick Lionis (github handle : nijoe1 )
/// @notice Use this contract for minting your NFTs inside the ArchivedMedia platform
/// @dev A new  NFTContract that takes The benefits of FVM features
/// Using FEVM we added the Utility to persist files while uploading Media but also while Minting
// That means that the most minted post will be Persisted into the filecoin Network more times 
// and it will stay alive also we added an IPFS CID to represent the creations in the frontend
// By using WEB3.STORAGE

contract ArchivedMedia is ERC721URIStorage,Ownable {
    struct Metadata {
        string fileURI;
        string dataURI;
        uint256 price;
        uint256 file_type; // 0 = image, 1 = video, 2 = audio, 3 = text, 4 = other
        address owner;
        string groupID;
    }

    using Counters for Counters.Counter;

    Counters.Counter private tokenID;
    Counters.Counter private postID;
    Counters.Counter private dealID;

    mapping(uint256 => uint256) private tokenIDs; // tokenID => postId
    mapping(uint256 => Metadata) private PostData; // postId => Metadata
    mapping(uint256 => MarketTypes.MockDeal) private PostDeal; // postId => MockDeal
    mapping(address => uint256) private balances;
    IMarketAPI marketAPI_contract;

    // We need an Oracle from the filecoin.sol actor lib
    int64 public constPricePerByte = 1073741824;

    // We are implementing the MarketAPI by using an Interface
    constructor(IMarketAPI marketAPI_address) ERC721("ArchivedMedia", "AM") {
        marketAPI_contract = marketAPI_address;
    }

    /// @notice Minting function first someone has to persist his post into Filecoin using the Upload Function 
    /// @dev retrieves the values for the post NFT that is going to be Minted.
    /// the caller must mint an NFT on top of someones Post inside our platform
    // By minting someone Post we persist it more times into the network
    function mint(uint256 postId) public payable {
        require(msg.value >= PostData[postId].price, "Not enough ETH sent to mint: check price.");
        require(postID.current() >= postId, "tokenID does not exists");
        // // Persisting the Post-NFT one more time by anyone that mints it. Using the marketAPI
        dealID.increment();
        MarketTypes.MockDeal memory deal = marketAPI_contract.createDeal(dealID.current(),msg.sender);
        // Getting the collateral to execute that Deal

        uint256 Dealcollateral = getDealPrice();


        marketAPI_contract.add_balance{value:Dealcollateral}(MarketTypes.AddBalanceParams(msg.sender)); 

        marketAPI_contract.publish_storage_deal(deal, msg.sender);
        tokenID.increment();
        uint256 newItemId = tokenID.current();
        tokenIDs[newItemId] = postId;
        _setTokenURI(newItemId, PostData[postId].fileURI);
        _safeMint(msg.sender, newItemId);
    }

    // @notice Upload function persist a post into the Filecoin Network then anyone that likes that Post 
    // Can mint it and persist it more times! 
    /// @dev Uploads and Persists a Post into the FVM. 
    function upload(
        string memory file,
        string memory data,
        uint256 price,
        uint256 file_type,
        string memory groupid
    ) public payable  {
        require(bytes(file).length != 0 && bytes(data).length != 0, "Invalid URI");
        require(price > 0, "Price must be greater than 0");
        require(file_type >= 0 && file_type <= 4, "Invalid file type");

        // // Persisting the Post one more time by anyone that mints it. Using the marketAPI

        dealID.increment();
        MarketTypes.MockDeal memory deal = marketAPI_contract.createDeal(dealID.current(),msg.sender);
        // // Getting the collateral to execute that Deal

        uint256 Dealcollateral = getDealPrice();


        marketAPI_contract.add_balance{value:Dealcollateral}(MarketTypes.AddBalanceParams(msg.sender)); 

        marketAPI_contract.publish_storage_deal(deal, msg.sender);

       
        postID.increment();
        uint256 newItemId = postID.current();
        Metadata memory temp = Metadata(file, data, price, file_type, msg.sender,groupid);
        PostData[newItemId] = temp;
        PostDeal[newItemId] = deal;
    }

    // Function to get the Price of a Deal using the marketAPI
    function getDealPrice() public view returns(uint256){
        MarketTypes.MockDeal memory deal = marketAPI_contract.getDeal();

        MarketTypes.GetDealEpochPriceReturn  memory Dealcollateral = marketAPI_contract.get_deal_total_price(
        MarketTypes.GetDealEpochPriceParams(deal.id));

        return Dealcollateral.price_per_epoch;

    }

    // Function to renew a Deal for a Post
    function renewDeal() public pure returns(bool){
        return true;
    }


    function postURI(uint256 postId) public view returns (Metadata memory) {
        return PostData[postId];
    }


    function tokenID_IsVerified(uint256 tokenid) public view returns(bool){
        uint256 postid = tokenIDs[tokenid];
        MarketTypes.MockDeal memory deal = PostDeal[postid];
        MarketTypes.GetDealVerifiedParams memory temp = MarketTypes.GetDealVerifiedParams(deal.id);
        return marketAPI_contract.get_deal_verified(temp).verified;
    }


    /// @notice returns the total number of minted NFTs
    function totalSupply() public view returns (uint256) {
        return tokenID.current();
    }

    function totalPosts() public view returns(uint256) {
        return postID.current();
    }

    //  @notice withdraw function of the contract funds only by the contract owner
    function withdraw() public payable {
        require(balances[msg.sender] != 0, "0 balance");
        (bool success, ) = payable(msg.sender).call{value: balances[msg.sender]}("");
        if (!success) {
            require(false,"Withdrawal failed");
        }
    }
}