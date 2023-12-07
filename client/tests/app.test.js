import React from 'react';
import { render, renderHook, act } from '@testing-library/react';
import {add, useExampleHook, validMoveExists, inBoard} from '../src/App';
import {validLeftMatch, validRightMatch, validUpMatch, validDownMatch, validVerticalMatch, validHorizontalMatch} from '../src/App';  
import {verticalClear, horizontalClear} from '../src/App';  

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

describe("Clearing Matches from Board", () => {
  describe("Vertical Clears", () => {
    let arr1 = [0, 1, 2, 3, 4, 5, 6, 7, 8,
      0, 10, 11, 12, 0, 14, 15, 16, 17, 
      0, 19, 20, 21, 0, 23, 24, 25, 26, 
      27, 28, 29, 30, 0, 32, 33, 34, 35, 
      36, 37, 38, 39, 0, 41, 42, 43, 44, 
      45, 46, 47, 48, 0, 50, 51, 52, 53, 
      54, 55, 56, 57, 0, 59, 60, 61, 0, 
      63, 64, 65, 66, 67, 68, 69, 70, 0, 
      72, 73, 74, 75, 76, 77, 78, 79, 0];
 
   test('vertical clearing 1', () => {
     expect(verticalClear(0, arr1)).toEqual(
        [null, 1, 2, 3, 4, 5, 6, 7, 8,
         null, 10, 11, 12, 0, 14, 15, 16, 17, 
         null, 19, 20, 21, 0, 23, 24, 25, 26, 
         27, 28, 29, 30, 0, 32, 33, 34, 35, 
         36, 37, 38, 39, 0, 41, 42, 43, 44, 
         45, 46, 47, 48, 0, 50, 51, 52, 53, 
         54, 55, 56, 57, 0, 59, 60, 61, 0, 
         63, 64, 65, 66, 67, 68, 69, 70, 0, 
         72, 73, 74, 75, 76, 77, 78, 79, 0]);
   });
 
   test('vertical clearing 2', () => {
     expect(verticalClear(9, arr1)).toEqual(
        [null, 1, 2, 3, 4, 5, 6, 7, 8,
         null, 10, 11, 12, 0, 14, 15, 16, 17, 
         null, 19, 20, 21, 0, 23, 24, 25, 26, 
         27, 28, 29, 30, 0, 32, 33, 34, 35, 
         36, 37, 38, 39, 0, 41, 42, 43, 44, 
         45, 46, 47, 48, 0, 50, 51, 52, 53, 
         54, 55, 56, 57, 0, 59, 60, 61, 0, 
         63, 64, 65, 66, 67, 68, 69, 70, 0, 
         72, 73, 74, 75, 76, 77, 78, 79, 0]);
   });
 
   test('vertical clearing 3', () => {
     expect(verticalClear(40, arr1)).toEqual(
        [0, 1, 2, 3, 4, 5, 6, 7, 8,
         0, 10, 11, 12, null, 14, 15, 16, 17, 
         0, 19, 20, 21, null, 23, 24, 25, 26, 
         27, 28, 29, 30, null, 32, 33, 34, 35, 
         36, 37, 38, 39, null, 41, 42, 43, 44, 
         45, 46, 47, 48, null, 50, 51, 52, 53, 
         54, 55, 56, 57, null, 59, 60, 61, 0, 
         63, 64, 65, 66, 67, 68, 69, 70, 0, 
         72, 73, 74, 75, 76, 77, 78, 79, 0]);
   });
 
   test('vertical clearing 4', () => {
     expect(verticalClear(22, arr1)).toEqual(
        [0, 1, 2, 3, 4, 5, 6, 7, 8,
         0, 10, 11, 12, null, 14, 15, 16, 17, 
         0, 19, 20, 21, null, 23, 24, 25, 26, 
         27, 28, 29, 30, null, 32, 33, 34, 35, 
         36, 37, 38, 39, null, 41, 42, 43, 44, 
         45, 46, 47, 48, null, 50, 51, 52, 53, 
         54, 55, 56, 57, null, 59, 60, 61, 0, 
         63, 64, 65, 66, 67, 68, 69, 70, 0, 
         72, 73, 74, 75, 76, 77, 78, 79, 0]);
   });
 
   test('vertical clearing 5', () => {
     expect(verticalClear(80, arr1)).toEqual(
        [0, 1, 2, 3, 4, 5, 6, 7, 8,
         0, 10, 11, 12, 0, 14, 15, 16, 17, 
         0, 19, 20, 21, 0, 23, 24, 25, 26, 
         27, 28, 29, 30, 0, 32, 33, 34, 35, 
         36, 37, 38, 39, 0, 41, 42, 43, 44, 
         45, 46, 47, 48, 0, 50, 51, 52, 53, 
         54, 55, 56, 57, 0, 59, 60, 61, null, 
         63, 64, 65, 66, 67, 68, 69, 70, null, 
         72, 73, 74, 75, 76, 77, 78, 79, null]);
   });
  });

  describe("Horizontal Clearing", () => {
    let arr1 = [0, 1, 2, 0, 0, 0, 6, 7, 8,
      9, 10, 11, 0, 13, 14, 15, 16, 17, 
      18, 19, 20, 0, 22, 23, 24, 25, 26, 
      27, 28, 29, 0, 31, 32, 33, 34, 35, 
      36, 37, 38, 39, 40, 41, 42, 43, 44, 
      45, 46, 47, 48, 39, 50, 51, 52, 53, 
      54, 0, 0, 0, 0, 0, 0, 61, 0, 
      63, 64, 65, 66, 67, 68, 69, 70, 0, 
      72, 73, 74, 75, 76, 77, 0, 0, 0];

      test('horizontal clearing 1', () => {
        expect(horizontalClear(0,arr1)).toEqual(
          [0, 1, 2, 0, 0, 0, 6, 7, 8,
            9, 10, 11, 0, 13, 14, 15, 16, 17, 
            18, 19, 20, 0, 22, 23, 24, 25, 26, 
            27, 28, 29, 0, 31, 32, 33, 34, 35, 
            36, 37, 38, 39, 40, 41, 42, 43, 44, 
            45, 46, 47, 48, 39, 50, 51, 52, 53, 
            54, 0, 0, 0, 0, 0, 0, 61, 0, 
            63, 64, 65, 66, 67, 68, 69, 70, 0, 
            72, 73, 74, 75, 76, 77, 0, 0, 0]);
      });

      test('horizontal clearing 2', () => {
        expect(horizontalClear(3,arr1)).toEqual(
          [0, 1, 2, null, null, null, 6, 7, 8,
            9, 10, 11, 0, 13, 14, 15, 16, 17, 
            18, 19, 20, 0, 22, 23, 24, 25, 26, 
            27, 28, 29, 0, 31, 32, 33, 34, 35, 
            36, 37, 38, 39, 40, 41, 42, 43, 44, 
            45, 46, 47, 48, 39, 50, 51, 52, 53, 
            54, 0, 0, 0, 0, 0, 0, 61, 0, 
            63, 64, 65, 66, 67, 68, 69, 70, 0, 
            72, 73, 74, 75, 76, 77, 0, 0, 0]);
      });

      test('horizontal clearing 3', () => {
        expect(horizontalClear(4,arr1)).toEqual(
          [0, 1, 2, null, null, null, 6, 7, 8,
            9, 10, 11, 0, 13, 14, 15, 16, 17, 
            18, 19, 20, 0, 22, 23, 24, 25, 26, 
            27, 28, 29, 0, 31, 32, 33, 34, 35, 
            36, 37, 38, 39, 40, 41, 42, 43, 44, 
            45, 46, 47, 48, 39, 50, 51, 52, 53, 
            54, 0, 0, 0, 0, 0, 0, 61, 0, 
            63, 64, 65, 66, 67, 68, 69, 70, 0, 
            72, 73, 74, 75, 76, 77, 0, 0, 0]);
      });

      test('horizontal clearing 4', () => {
        expect(horizontalClear(80,arr1)).toEqual(
          [0, 1, 2, 0, 0, 0, 6, 7, 8,
            9, 10, 11, 0, 13, 14, 15, 16, 17, 
            18, 19, 20, 0, 22, 23, 24, 25, 26, 
            27, 28, 29, 0, 31, 32, 33, 34, 35, 
            36, 37, 38, 39, 40, 41, 42, 43, 44, 
            45, 46, 47, 48, 39, 50, 51, 52, 53, 
            54, 0, 0, 0, 0, 0, 0, 61, 0, 
            63, 64, 65, 66, 67, 68, 69, 70, 0, 
            72, 73, 74, 75, 76, 77, null, null, null]);
      });

      test('horizontal clearing 5', () => {
        expect(horizontalClear(57,arr1)).toEqual(
          [0, 1, 2, 0, 0, 0, 6, 7, 8,
            9, 10, 11, 0, 13, 14, 15, 16, 17, 
            18, 19, 20, 0, 22, 23, 24, 25, 26, 
            27, 28, 29, 0, 31, 32, 33, 34, 35, 
            36, 37, 38, 39, 40, 41, 42, 43, 44, 
            45, 46, 47, 48, 39, 50, 51, 52, 53, 
            54, null, null, null, null, null, null, 61, 0, 
            63, 64, 65, 66, 67, 68, 69, 70, 0, 
            72, 73, 74, 75, 76, 77, 0, 0, 0]);
      });

  });
});

