/**
 * @jest-environment jsdom
 */
import {repositionStart, handleKeyDown, handleKeyUp} from './phone';

const mockFn = jest.fn(_=> true);   

const setUp = ({ key='', value='', selectionStart=0 }) => 
({ 
    key,
    keyCode: key.charCodeAt(),
    target: {
        value, 
        selectionStart
    },
    preventDefault: mockFn
});

test('It should Not allow letters as inputs, rather allow digits', ()=>{
    const input = setUp({key: 'G'});
    expect(input.target.value).toBe(''); // before
    handleKeyDown(input);
    expect(input.target.value).toBe(''); // after
    expect(input.preventDefault).toHaveBeenCalled(); // after

    const inputDigit = setUp({key: '1'});  
    expect(inputDigit.preventDefault.mock.calls).toHaveLength(1);
    expect(inputDigit.preventDefault.mock.calls[0]).toHaveLength(0);
});

test('It should format for size <  3', ()=> {
    const inputDigit =  setUp({value: '123'});     
    expect(inputDigit.target.value).toBe('123'); // before
    handleKeyUp(inputDigit);
    expect(inputDigit.target.value).toBe('123'); // before
});

test('It should format for (6 >= size >  3)', ()=> {
    const inputDigit =  setUp({value: '123456'});     
    expect(inputDigit.target.value).toBe('123456'); // before
    handleKeyUp(inputDigit);
    expect(inputDigit.target.value).toBe('(123) 456'); // before
});

test('It should format for size > 6', ()=> {
    const value = '1234567890';
    const inputDigit =  setUp({value});     
    expect(inputDigit.target.value).toBe(value); // before
    handleKeyUp(inputDigit);
    expect(inputDigit.target.value).toBe('(123) 456-7890'); // before
});

test('It should reposition the caret and keep format rule on insert-within', () => {
    // set initial value
    const input = setUp({value: '124', selectionStart: 3});

     // Simulate a 'ArrowLeft' - change the caret position -1 steps (3-1=2)
    input.target.selectionStart -= 1;
    expect(input.target.selectionStart).toBe(2);
    
    // // Insert digit '3' in caret position 2
    const value = '1234';
    input.target.value = value;
    input.target.selectionStart += 1; //  = 3
    handleKeyUp(input);
    expect(input.target.value).toBe('(123) 4');
    expect(input.target.selectionStart).toBe(3); // still = 3 
    const start = repositionStart(value, input.target.value, input.target.selectionStart);
    expect(start).toBe(4); // right position = 4
  });


  test('It should reposition the caret and keep format rule on a delete-within', () => {
     // set initial value
    const input = setUp({value: '12345567'});
    handleKeyUp(input);
    expect(input.target.value).toBe('(123) 455-67');
    
    //  Change caret position -3 steps (12-3=9)
    //  & Backspace digit 5
    const value = '(123) 45-67';
    input.target.value = value;
    input.target.selectionStart = 9;
    handleKeyUp(input);
    expect(input.target.value).toBe('(123) 456-7');
    expect(input.target.selectionStart).toBe(9); // still 9 
    const start = repositionStart(value, input.target.value, input.target.selectionStart);
    expect(start).toBe(8); // right position = 8
  });