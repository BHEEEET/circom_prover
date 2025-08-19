const snarkjs = require("snarkjs");
const fs = require("fs");
const path = require("path");

async function generateProof(secretNumber, publicSquare) {
    console.log(`🔒 Generating proof for secret number: ${secretNumber}`);
    console.log(`🔍 Public square: ${publicSquare}`);

    // Prepare input
    const input = {
        x: secretNumber,
        public_square: publicSquare
    };

    try {
        // Generate proof
        console.log("⚡ Generating ZK proof...");
        const { proof, publicSignals } = await snarkjs.groth16.fullProve(
            input,
            path.join("build","square_js", "square.wasm"),
            path.join("keys", "square_final.zkey")
        );

        console.log("✅ Proof generated successfully!");
        console.log("📊 Public signals:", publicSignals);

        // Save proof to file
        const proofData = {
            proof: proof,
            publicSignals: publicSignals,
            input: {
                secret_number: secretNumber,
                public_square: publicSquare
            }
        };

        fs.writeFileSync(
            path.join("build", "proof.json"),
            JSON.stringify(proofData, null, 2)
        );

        console.log("💾 Proof saved to build/proof.json");
        return proofData;

    } catch (error) {
        console.error("❌ Proof generation failed:", error);
        throw error;
    }
}

async function verifyProof(proofPath = null) {
    console.log("🔍 Verifying proof...");

    try {
        // Load verification key
        const vKey = JSON.parse(fs.readFileSync(
            path.join("keys", "verification_key.json")
        ));

        // Load proof
        const proofFile = proofPath || path.join("build", "proof.json");
        const proofData = JSON.parse(fs.readFileSync(proofFile));

        // Verify
        const res = await snarkjs.groth16.verify(
            vKey,
            proofData.publicSignals,
            proofData.proof
        );

        if (res) {
            console.log("✅ Proof verification PASSED!");
            console.log(`🎯 Verified: Someone knows a number that squares to ${proofData.publicSignals[0]}`);
        } else {
            console.log("❌ Proof verification FAILED!");
        }

        return res;

    } catch (error) {
        console.error("❌ Verification failed:", error);
        return false;
    }
}

// Interactive CLI
async function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.log("🧮 ZK Square Proof Generator");
        console.log("");
        console.log("Usage:");
        console.log("  node scripts/prove.js <secret_number>");
        console.log("  node scripts/prove.js verify");
        console.log("");
        console.log("Examples:");
        console.log("  node scripts/prove.js 7        # Prove you know square root of 49");
        console.log("  node scripts/prove.js -5       # Prove you know square root of 25");
        console.log("  node scripts/prove.js verify   # Verify the last generated proof");
        return;
    }

    if (args[0] === "verify") {
        await verifyProof();
        return;
    }

    // Parse secret number
    const secretNumber = parseInt(args[0]);
    if (isNaN(secretNumber)) {
        console.error("❌ Please provide a valid number");
        return;
    }

    const publicSquare = secretNumber * secretNumber;
    
    console.log("🔢 ZK Proof Demo: Square Root");
    console.log("================================");
    console.log(`Secret number (private): ${secretNumber}`);
    console.log(`Public square: ${publicSquare}`);
    console.log("");

    // Generate proof
    const proofData = await generateProof(secretNumber, publicSquare);
    
    console.log("");
    console.log("📋 Proof Summary:");
    console.log(`   Secret kept private: ${secretNumber}`);
    console.log(`   Public verification: ✓ Someone knows √${publicSquare}`);
    console.log("");

    // Auto-verify
    console.log("🔍 Auto-verifying proof...");
    const isValid = await verifyProof();
    
    if (isValid) {
        console.log("");
        console.log("🎉 Success! You've generated and verified your first ZK proof!");
        console.log("💡 The verifier knows you have a number that squares to " + publicSquare);
        console.log("🔒 But they don't know your secret number: " + secretNumber);
    }
}

// Handle different ways this file might be run
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { generateProof, verifyProof };