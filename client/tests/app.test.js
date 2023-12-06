import React from 'react';
import { render, renderHook, act } from '@testing-library/react';
import {add, useExampleHook, validMoveExists, inBoard} from '../src/App';
import {validLeftMatch, validRightMatch, validUpMatch, validDownMatch, validVerticalMatch, validHorizontalMatch} from '../src/App';  

/* Example Test Cases to use with Jest Testing */

// test('add function adds two numbers correctly', () => {
//   // Arrange
//   const a = 2;
//   const b = 3;

//   // Act
//   const result = add(a, b);

//   // Assert
//   expect(result).toBe(5);
// });


// test('useExampleHook increments the value correctly', () => {
//   // Arrange
//   let hookResult;

//   // Act
//   renderHook(() => {
//     hookResult = useExampleHook(0);
//   });

//   // Assert initial state
//   expect(hookResult.value).toBe(0);

//   // Act again to trigger the useEffect
//   act(() => {
//     hookResult.increment();
//   });

//   // Assert updated state after increment
//   expect(hookResult.value).toBe(1);
// });

describe('Validity of Indices', () => {
  describe('Out of bounds', () => {
    test('Index -1', () => {
      expect(inBoard(-1)).toBe(false);
    });

    test('Index 81', () => {
      expect(inBoard(81)).toBe(false);
    });
  });

  describe('In Bounds', () => {
    test('Index 0', () => {
      expect(inBoard(0)).toBe(true);
    });

    test('Index 80', () => {
      expect(inBoard(80)).toBe(true);
    });

    test('Index 25', () => {
      expect(inBoard(25)).toBe(true);
    })
  });
});


describe('Match recognition', () => {
  let arr1 = [0,0,0,0,0,0,0,0,0,
              0,0,0,0,0,0,0,0,0,
              0,0,0,0,1,0,0,0,0,
              0,0,0,0,1,0,0,0,0,
              0,0,1,1,1,1,1,0,0,
              0,0,0,0,1,0,0,0,0,
              0,0,0,0,1,0,0,0,0,
              0,0,0,0,0,0,0,0,0,
              0,0,0,0,0,0,0,0,0]

  let arr2 = [0,0,0,0,0,0,0,0,0,
              0,0,0,0,1,0,0,0,0,
              0,0,0,0,1,0,0,0,0,
              0,0,0,0,0,0,0,0,0,
              0,0,1,1,1,1,0,0,0,
              0,0,0,0,1,0,0,0,0,
              1,0,0,0,1,0,0,0,0,
              1,0,0,0,0,0,0,0,0,
              1,1,1,0,0,0,0,0,0]
  test('All Matches at Once', () => {
    expect(validLeftMatch(40, arr1)).toBe(true);
    expect(validRightMatch(40, arr1)).toBe(true);
    expect(validUpMatch(40, arr1)).toBe(true);
    expect(validDownMatch(40, arr1)).toBe(true);
    expect(validHorizontalMatch(40, arr1)).toBe(true);
    expect(validVerticalMatch(40, arr1)).toBe(true);
  });
});

describe("Check if valid move exists", () => {
  let arr1 = [1,2,3,4,5,6,7,8,9,
              -1,-2,-3,-3,-4,-5,-6,-7,-8,
              1,2,3,4,5,6,7,8,9,
              -1,-2,-3,-3,-4,-5,-6,-7,-8,
              1,2,3,4,5,6,7,8,9,
              -1,-2,-3,-3,-4,-5,-6,-7,-8,
              1,2,3,4,5,6,7,8,9,
              -1,-2,-3,-3,-4,-5,-6,-7,-8,
              1,2,3,4,5,6,7,8,9]

  let arr2 = [1,2,3,4,5,6,7,8,9,
            -1,-2,-3,-3,-4,-5,-6,-7,-8,
            1,2,3,4,5,6,7,8,9,
            -1,-2,-3,-3,-4,-5,-6,-7,-8,
            1,2,3,4,5,4,4,8,9,
            -1,-2,-3,-3,-4,-5,-6,-7,-8,
            1,2,3,4,5,6,7,8,9,
            -1,-2,-3,-3,-4,-5,-6,-7,-8,
            1,2,3,4,5,6,7,8,9]  

  test('Only one valid move', () => {
    expect(validMoveExists(arr2)).toBe(true);
  });

  test('No valid move', () => {
    expect(validMoveExists(arr1)).toBe(false);
  });
});


