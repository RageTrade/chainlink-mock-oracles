// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import {AggregatorV2V3Interface} from "@chainlink/contracts/src/v0.8/interfaces/AggregatorV2V3Interface.sol";

contract ChainlinkMockOracle is AggregatorV2V3Interface {
    struct Round {
        int256 answer;
        uint256 startedAt;
        uint256 updatedAt;
        uint80 answeredInRound;
    }

    Round[] _rounds;
    string public description;
    mapping(address => bool) public authorisedDataProviders;

    constructor(string memory _description, int256 _initialAnswer) {
        description = _description;
        authoriseDataProvider(msg.sender, true);
        setData(_initialAnswer);
    }

    function setData(int answer) public {
        require(
            authorisedDataProviders[msg.sender],
            "Not authorised data provider"
        );
        _rounds.push(
            Round({
                answer: answer,
                startedAt: block.timestamp,
                updatedAt: block.timestamp,
                answeredInRound: uint80(_rounds.length)
            })
        );
    }

    function authoriseDataProvider(address provider, bool status) public {
        authorisedDataProviders[provider] = status;
    }

    function decimals() external pure returns (uint8) {
        return 8;
    }

    function version() external pure returns (uint256) {
        return 0;
    }

    // getRoundData and latestRoundData should both raise "No data present"
    // if they do not have data to report, instead of returning unset values
    // which could be misinterpreted as actual reported values.
    function getRoundData(uint80 _roundId)
        public
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        if (_rounds.length == 0 || _rounds.length < _roundId) {
            revert("No data present");
        }

        Round memory _round = _rounds[_roundId];
        return (
            _roundId,
            _round.answer,
            _round.startedAt,
            _round.updatedAt,
            _round.answeredInRound
        );
    }

    function latestRoundData()
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        return getRoundData(uint80(_rounds.length - 1));
    }

    function latestTimestamp() external view returns (uint256) {
        return block.timestamp;
    }

    function getAnswer(uint256 roundId) external view returns (int256) {
        return _rounds[roundId].answer;
    }

    function getTimestamp(uint256 roundId) external view returns (uint256) {
        return _rounds[roundId].startedAt;
    }

    function latestAnswer() external view returns (int256) {
        (, int256 answer, , ,) = getRoundData(uint80(_rounds.length - 1));

        return answer;
    }

    function latestRound() external view returns (uint256) {
        uint256 length = _rounds.length;
        if(length == 0) return 0;
        
        return _rounds.length - 1;
    }
}
