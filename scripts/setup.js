const { execSync } = require("child_process");

function run(cmd) {
  console.log(`$ ${cmd}`);
  execSync(cmd, { stdio: "inherit" });
}

async function setup() {
  console.log("🚀 Starting trusted setup...");

  run("snarkjs powersoftau new bn128 12 keys/pot12_0000.ptau -v");
  run('snarkjs powersoftau contribute keys/pot12_0000.ptau keys/pot12_0001.ptau --name="First contribution" -v');
  run("snarkjs powersoftau prepare phase2 keys/pot12_0001.ptau keys/pot12_final.ptau -v");
  run("snarkjs groth16 setup build/square.r1cs keys/pot12_final.ptau keys/square_0000.zkey -v");
  run('snarkjs zkey contribute keys/square_0000.zkey keys/square_final.zkey --name="Final contribution" -v');
  run("snarkjs zkey export verificationkey keys/square_final.zkey keys/verification_key.json");

  console.log("✅ Setup complete!");
}

if (require.main === module) setup();
