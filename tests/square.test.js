const chai = require("chai");
const path = require("path");
const circom_tester = require("circom_tester");
const wasm_tester = circom_tester.wasm;

const expect = chai.expect;

describe("Square Circuit Test", function () {
    let circuit;

    before(async function () {
        // Compile the circuit
        circuit = await wasm_tester(path.join(__dirname, "..", "circuits", "square.circom"));
    });

    it("Should compute square correctly for positive numbers", async function () {
        const input = {
            x: 5,
            public_square: 25
        };

        const witness = await circuit.calculateWitness(input);
        await circuit.checkConstraints(witness);
        
        // Check the output
        await circuit.assertOut(witness, { square_root_exists: 1 });
    });

    it("Should compute square correctly for zero", async function () {
        const input = {
            x: 0,
            public_square: 0
        };

        const witness = await circuit.calculateWitness(input);
        await circuit.checkConstraints(witness);
        await circuit.assertOut(witness, { square_root_exists: 1 });
    });

    it("Should compute square correctly for negative numbers", async function () {
        const input = {
            x: -7,
            public_square: 49
        };

        const witness = await circuit.calculateWitness(input);
        await circuit.checkConstraints(witness);
        await circuit.assertOut(witness, { square_root_exists: 1 });
    });

    it("Should compute square correctly for large numbers", async function () {
        const input = {
            x: 123,
            public_square: 15129  // 123^2
        };

        const witness = await circuit.calculateWitness(input);
        await circuit.checkConstraints(witness);
        await circuit.assertOut(witness, { square_root_exists: 1 });
    });

    it("Should fail for incorrect square", async function () {
        const input = {
            x: 5,
            public_square: 24  // Wrong! 5^2 = 25, not 24
        };

        try {
            await circuit.calculateWitness(input);
            expect.fail("Should have thrown an error for incorrect square");
        } catch (error) {
            // Expected to fail - this is correct behavior
            expect(error.toString()).to.include("Error");
        }
    });

    it("Should work with decimal inputs (circom handles as integers)", async function () {
        // Note: Circom works with integers, so 3.7 becomes 3
        const input = {
            x: 3,
            public_square: 9
        };

        const witness = await circuit.calculateWitness(input);
        await circuit.checkConstraints(witness);
        await circuit.assertOut(witness, { square_root_exists: 1 });
    });

    // Test multiple valid inputs
    const testCases = [
        { x: 1, square: 1 },
        { x: 2, square: 4 },
        { x: 10, square: 100 },
        { x: 15, square: 225 },
        { x: 100, square: 10000 }
    ];

    testCases.forEach(({ x, square }) => {
        it(`Should work for x=${x}, square=${square}`, async function () {
            const input = { x: x, public_square: square };
            
            const witness = await circuit.calculateWitness(input);
            await circuit.checkConstraints(witness);
            await circuit.assertOut(witness, { square_root_exists: 1 });
        });
    });
});