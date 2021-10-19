Migrations = await ethers.getContractFactory("Migrations");

module.exports = async () => {
  const migrations = await Migrations.new();
  Migrations.setAsDeployed(migrations);
};
