/**
 * @jest-environment jsdom
 */
import {handleKeyDown, handleKeyUp} from './phone';

// const eventTarget = document.getElementById("phone");


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
    console.log(input.preventDefault.mock.calls);
    expect(input.preventDefault).toHaveBeenCalled(); // after

    const inputDigit = setUp({key: '1'});  
    // console.log(inputDigit.preventDefault.mock.calls);
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
    const input = setUp({value: '124', selectionStart: 3});
    // set initial value
    // fireEvent.change(input, {target: {value: '124'}});
    expect(input.target.value).toBe('124') // need to make a change so React registers "" as a change
    expect(input.target.selectionStart).toBe(3);

     // Simulate a 'ArrowLeft' - change the caret position -1 steps (3-1=2)
    input.target.selectionStart -= 1;
    handleKeyUp(input);
    expect(input.target.selectionStart).toBe(2);
     
    // // Insert digit (4) in previous position (2)
    input.target.value = '1234';
    handleKeyUp(input);
    expect(input.target.value).toBe('(123) 4');
  });


  test('It should reposition the caret and keep format rule on a delete-within', () => {
    const input = setUp({value: '12345567'});
    // set initial value
    handleKeyUp(input);
    expect(input.target.value).toBe('(123) 455-67');
    // expect(input.selectionStart).toBe(input.value.length); // = 12
    
    //  Change caret position -3 steps (12-3=9)
    //  & Backspace digit 5
    input.target.value = '(123) 45-67';
    input.target.selectionStart = 9;
    handleKeyUp(input);
    expect(input.target.value).toBe('(123) 456-7');
    // expect(input.target.selectionStart).toBe(8);
  });