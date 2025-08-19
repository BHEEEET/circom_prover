const { expect } = require("chai");
const path = require("path");
const { wasm } = require("circom_tester");

describe("Square Circuit Test", function () {
    this.timeout(100000);

    let circuit;

    before(async function () {
        circuit = await wasm(path.join(__dirname, "..", "circuits", "square.circom"), {
            include: ["node_modules"],
        });
    });

    it("computes square correctly for positive numbers", async function () {
        const input = { x: 5, public_square: 25 };
        const witness = await circuit.calculateWitness(input, true);
        await circuit.checkConstraints(witness);
    });

    it("computes square correctly for zero", async function () {
        const input = { x: 0, public_square: 0 };
        const witness = await circuit.calculateWitness(input, true);
        await circuit.checkConstraints(witness);
    });

    it("computes square correctly for negative numbers", async function () {
        const input = { x: -7, public_square: 49 };
        const witness = await circuit.calculateWitness(input, true);
        await circuit.checkConstraints(witness);
    });

    it("computes square correctly for large numbers", async function () {
        const input = { x: 123, public_square: 15129 }; // 123^2
        const witness = await circuit.calculateWitness(input, true);
        await circuit.checkConstraints(witness);
    });

    it("fails when the square is incorrect", async function () {
        const input = { x: 5, public_square: 24 }; // wrong on purpose
        let threw = false;
        try {
            const witness = await circuit.calculateWitness(input, true);
            await circuit.checkConstraints(witness);
        } catch (e) {
            threw = true; // enough
        }
        expect(threw, "Expected the circuit to reject incorrect square").to.equal(true);
    });


    it("works with integer inputs (circom is integer arithmetic)", async function () {
        // If you pass decimals in, coerce to int before calling the circuit.
        const input = { x: 3, public_square: 9 };
        const witness = await circuit.calculateWitness(input, true);
        await circuit.checkConstraints(witness);
    });

    // Table-driven cases
    const cases = [
        { x: 1, square: 1 },
        { x: 2, square: 4 },
        { x: 10, square: 100 },
        { x: 15, square: 225 },
        { x: 100, square: 10000 },
    ];

    for (const { x, square } of cases) {
        it(`works for x=${x}, square=${square}`, async function () {
            const input = { x, public_square: square };
            const witness = await circuit.calculateWitness(input, true);
            await circuit.checkConstraints(witness);
        });
    }
});
