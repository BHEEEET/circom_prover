pragma circom 2.0.0;

/*
    Simple circuit that proves you know a number x such that x^2 = public_square
    
    Private input: x (the secret number) 
    Public input: public_square (the result we want to prove)
    
    The circuit constrains that x * x = public_square
*/

template Square() {
    // Private input - this is what we want to keep secret
    // In Circom 2.0, inputs are private by default
    signal input x;
    
    // Public input - this is known to everyone (the result)
    signal input public_square;
    
    // Output signal
    signal output square_root_exists;
    
    // Intermediate signal to hold x^2
    signal x_squared;
    
    // Constraint: x_squared = x * x
    x_squared <== x * x;
    
    // Constraint: x_squared must equal the public input
    x_squared === public_square;
    
    // Output 1 if constraint is satisfied
    square_root_exists <== 1;
}

// Create the main component with public signals specified
component main {public [public_square]} = Square();