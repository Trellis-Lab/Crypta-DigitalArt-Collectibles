var Migrations = artifacts.require("./Collectibles.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
};
