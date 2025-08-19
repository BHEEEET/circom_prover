# circom
# Simple Circom ZK Environment

A beginner-friendly setup to test Zero-Knowledge circuits using Circom, starting with a simple "square of a number" proof.

## What This Does

This circuit proves that you know a secret number `x` such that `x² = public_square`, without revealing what `x` is.

**Example**: You can prove you know the square root of 49, without revealing whether it's 7 or -7.

## Quick Start

### 1. Prerequisites

Install Node.js, Rust, and Circom:

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs/ | sh

# Install Circom
git clone https://github.com/iden3/circom.git
cd circom
cargo build --release
cargo install --path circom

# Verify installation
circom --version
```

### 2. Setup Project

```bash
# Run the setup script
chmod +x setup_simple_circom.sh
./setup_simple_circom.sh

# Navigate to project
cd circom-test

# Install dependencies
npm install
```

### 3. Compile Circuit

```bash
npm run compile
```

This creates:
- `build/square.r1cs` - Constraint system
- `build/square.wasm` - WebAssembly for proof generation
- `build/square.sym` - Symbol table for debugging

### 4. Run Tests

```bash
npm test
```

Tests various scenarios:
- ✅ Positive numbers: 5² = 25
- ✅ Zero: 0² = 0  
- ✅ Negative numbers: (-7)² = 49
- ❌ Wrong squares: 5² ≠ 24

### 5. Generate Keys (Trusted Setup)

```bash
npm run setup
```

This performs the trusted setup ceremony and generates:
- `keys/pot12_final.ptau` - Powers of tau
- `keys/square_final.zkey` - Proving key
- `keys/verification_key.json` - Verification key

### 6. Generate Proofs

```bash
# Prove you know the square root of 49
node scripts/prove.js 7

# Prove you know the square root of 100
node scripts/prove.js 10

# Verify the last proof
node scripts/prove.js verify
```

## Project Structure

```
circom-test/
├── circuits/
│   └── square.circom          # ZK circuit definition
├── tests/
│   └── square.test.js         # Circuit tests
├── scripts/
│   ├── setup.js              # Trusted setup
│   └── prove.js               # Proof generation & verification
├── build/                    # Compiled circuit outputs
├── keys/                     # Cryptographic keys
└── package.json              # Dependencies & scripts
```

## Understanding the Circuit

```javascript
// The circuit proves: x * x = public_square
template Square() {
    signal private input x;         // Secret number (private)
    signal input public_square;     // x² (public)
    signal output square_root_exists; // Always 1 if valid
    
    signal x_squared;
    x_squared <== x * x;           // Constraint 1: compute square
    x_squared === public_square;   // Constraint 2: must equal public input
    
    square_root_exists <== 1;
}
```

## Key Concepts

- **Private Input**: Your secret number `x` - never revealed
- **Public Input**: The square `x²` - everyone knows this
- **Constraints**: Mathematical rules the circuit enforces
- **Witness**: Secret values that satisfy all constraints
- **Proof**: Cryptographic evidence you know a valid witness

## Next Steps

Once comfortable with this simple circuit, you can:

1. **Modify the circuit** - Try different mathematical operations
2. **Add complexity** - Multiple inputs, conditionals, loops
3. **Build rollup circuits** - Batch transaction verification
4. **Integrate with Solana** - On-chain proof verification

## Troubleshooting

**Circuit compilation fails?**
- Check Circom is installed: `circom --version`
- Verify syntax in `square.circom`

**Tests failing?**
- Run `npm run compile` first
- Check constraint logic

**Setup fails?**  
- Ensure `build/square.r1cs` exists
- Check disk space for key generation

**Proof generation fails?**
- Verify setup completed successfully
- Check input format in `prove.js`

## Example Output

```bash
$ node scripts/prove.js 7

🔢 ZK Proof Demo: Square Root
================================
Secret number (private): 7
Public square: 49

🔒 Generating proof for secret number: 7
🔍 Public square: 49
⚡ Generating ZK proof...
✅ Proof generated successfully!
📊 Public signals: [ 49, 1 ]
💾 Proof saved to build/proof.json

🔍 Auto-verifying proof...
🔍 Verifying proof...
✅ Proof verification PASSED!
🎯 Verified: Someone knows a number that squares to 49

🎉 Success! You've generated and verified your first ZK proof!
💡 The verifier knows you have a number that squares to 49
🔒 But they don't know your secret number: 7
```

## Resources

- [Circom Documentation](https://docs.circom.io/)
- [SnarkJS Documentation](https://github.com/iden3/snarkjs)
- [ZK Learning Resources](https://zkp.science/)

Happy Zero-Knowledge proving! 🎉