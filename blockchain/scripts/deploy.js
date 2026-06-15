const fs = require("fs");
const path = require("path");

async function main() {
  const ProductPassport = await ethers.getContractFactory("ProductPassport");
  const contract = await ProductPassport.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("ProductPassport deployed to:", address);

  const contractJson = {
    address,
    abi: JSON.parse(contract.interface.formatJson()),
  };

  const outputDir = path.resolve(__dirname, "../../src/lib/blockchain");
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(
    path.join(outputDir, "contract.json"),
    JSON.stringify(contractJson, null, 2)
  );
  console.log("Contract ABI + address written to src/lib/blockchain/contract.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
