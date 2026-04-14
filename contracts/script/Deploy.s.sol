// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/MTWToken.sol";
import "../src/LandRegistry.sol";
import "../src/ZoningRegistry.sol";
import "../src/governance/MTWTimelock.sol";
import "../src/governance/MTWGovernor.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envOr("PRIVATE_KEY", uint256(keccak256("default")));
        address deployer = vm.addr(deployerPrivateKey);

        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy MTWToken
        MTWToken mtwToken = new MTWToken();

        // 2. Deploy Timelock
        address[] memory proposers = new address[](0);
        address[] memory executors = new address[](1);
        executors[0] = address(0); // Will be replaced by Governor address

        MTWTimelock timelock = new MTWTimelock(
            1 days,
            proposers,
            executors,
            deployer
        );

        // 3. Deploy Governor
        MTWGovernor governor = new MTWGovernor(mtwToken, timelock);

        // 4. Set up Timelock roles
        bytes32 proposerRole = timelock.PROPOSER_ROLE();
        bytes32 executorRole = timelock.EXECUTOR_ROLE();
        bytes32 adminRole = timelock.DEFAULT_ADMIN_ROLE();

        timelock.grantRole(proposerRole, address(governor));
        timelock.grantRole(executorRole, address(0)); // Allow anyone to execute
        timelock.revokeRole(adminRole, deployer);

        // 5. Deploy LandRegistry
        LandRegistry landRegistry = new LandRegistry();

        // 6. Deploy ZoningRegistry
        ZoningRegistry zoningRegistry = new ZoningRegistry(address(timelock));

        // 7. Transfer ownership/roles of other contracts to DAO if necessary
        landRegistry.grantRole(landRegistry.DEFAULT_ADMIN_ROLE(), address(timelock));
        // landRegistry.revokeRole(landRegistry.DEFAULT_ADMIN_ROLE(), deployer);

        vm.stopBroadcast();

        console.log("MTWToken deployed to:", address(mtwToken));
        console.log("MTWTimelock deployed to:", address(timelock));
        console.log("MTWGovernor deployed to:", address(governor));
        console.log("LandRegistry deployed to:", address(landRegistry));
        console.log("ZoningRegistry deployed to:", address(zoningRegistry));
    }
}
