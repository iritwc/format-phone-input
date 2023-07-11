# Format Phone Input

This repository is a Vanilla Javascript version of implementation of a custom phone number input.

Given a phone number input element, it should dynamically react to a user type/enter/interact and format the number to match the pattern: (ddd) ddd-dddd (aka match the requirement for a specific common format: ([area-code]) [prefix]-[local]).

  1. Given an Html input of type="tel" and id="phone"
  2. Only digits [0-9] are allowed as input.
  3. User should be able to edit the number at any caret position (aka insert/delete digits).
  4. Input should reflect the pattern/format even when a fewer than 10 digits where typed/entered.

     
Example: 

If the user consecutively entered the sequence: 1 2 3 4 5 6 7 8 9 0, the input should respectively display:

1

12

123

(123) 4

(123) 45

(123) 456

(123) 456-7

(123) 456-78

(123) 456-789

(123) 456-7890

