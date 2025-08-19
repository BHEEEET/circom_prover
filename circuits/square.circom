pragma circom 2.0.0;

/*
    Simple circuit that proves you know a number x such that x^2 = public_square

    Private input: x (the secret number) 
    Public input: public_square (the result we want to prove)
*/

template Square() {
    // Private input - this is what we want to keep secret
    signal input x;

    // Public input - this is known to everyone
    signal input public_square;

    // Intermediate signal
    signal x_squared;

    // Constraint: x_squared = x * x
    x_squared <== x * x;

    // Constraint: must equal the public input
    x_squared === public_square;
}

// Expose public_square as the public signal
component main {public [public_square]} = Square();
