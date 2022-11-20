// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.4.25 <=0.8.17;

import "./types/MarketTypes.sol";

interface IMarketAPI {
error WithdrawFailed(); 

    function add_balance(MarketTypes.AddBalanceParams memory params) external payable;

    function publish_storage_deal(MarketTypes.MockDeal memory deal, address callee) external; 

    function get_deal_client_collateral(
        MarketTypes.GetDealClientCollateralParams memory params
    ) external view returns (MarketTypes.GetDealClientCollateralReturn memory);

    function getDeal() external view returns (MarketTypes.MockDeal memory deal);

    function get_deal_total_price(
        MarketTypes.GetDealEpochPriceParams memory params
    ) external view returns (MarketTypes.GetDealEpochPriceReturn memory);

    function get_deal_verified(
        MarketTypes.GetDealVerifiedParams memory params
    ) external view returns (MarketTypes.GetDealVerifiedReturn memory);

    function createDeal(uint256 dealID,address client )external returns(MarketTypes.MockDeal memory deal);

}