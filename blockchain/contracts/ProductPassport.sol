// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ProductPassport {
    event HashAnchored(
        bytes32 indexed contentHash,
        string passportId,
        uint256 timestamp,
        address indexed recorder
    );

    mapping(bytes32 => PassportRecord) private _records;

    struct PassportRecord {
        string passportId;
        uint256 timestamp;
        address recorder;
    }

    function anchorHash(string calldata passportId, bytes32 contentHash) external {
        require(bytes(passportId).length > 0, "Passport ID required");
        require(bytes(_records[contentHash].passportId).length == 0, "Hash already exists");

        _records[contentHash] = PassportRecord({
            passportId: passportId,
            timestamp: block.timestamp,
            recorder: msg.sender
        });

        emit HashAnchored(contentHash, passportId, block.timestamp, msg.sender);
    }

    function verifyHash(bytes32 contentHash) external view returns (
        bool exists,
        string memory passportId,
        uint256 timestamp,
        address recorder
    ) {
        PassportRecord storage record = _records[contentHash];
        if (bytes(record.passportId).length > 0) {
            return (true, record.passportId, record.timestamp, record.recorder);
        }
        return (false, "", 0, address(0));
    }
}
