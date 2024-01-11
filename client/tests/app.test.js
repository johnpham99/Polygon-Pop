import React from 'react';
import { render, renderHook, act } from '@testing-library/react';
import {validMoveExists, inBoard} from '../src/App';
import {validLeftMatch, validRightMatch, validUpMatch, validDownMatch, validVerticalMatch, validHorizontalMatch} from '../src/App';  
import {clearMatch, findAllMatches, clearAllMatches} from '../src/App';  

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

describe("1D Matches", () => {
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
 
    let clearedCells = new Set()

    test('vertical clearing 1', () => {
      const clearedCells = new Set();
      clearMatch(0, arr1, clearedCells)
      expect(clearedCells).toEqual(new Set([0,9,18])); 
    });

    test('vertical clearing 2', () => {
      const clearedCells = new Set();
      clearMatch(9, arr1, clearedCells)
      expect(clearedCells).toEqual(new Set([0,9,18])); 
    });

    test('vertical clearing 3', () => {
      const clearedCells = new Set();
      clearMatch(40, arr1, clearedCells)
      expect(clearedCells).toEqual(new Set([13,22,31,40,49,58])); 
    });

    test('vertical clearing 4', () => {
      const clearedCells = new Set();
      clearMatch(22, arr1, clearedCells)
      expect(clearedCells).toEqual(new Set([13,22,31,40,49,58])); 
    });

    test('vertical clearing 5', () => {
      const clearedCells = new Set();
      clearMatch(80, arr1, clearedCells)
      expect(clearedCells).toEqual(new Set([62,71,80])); 
    });
  });

  describe("Horizontal Clears", () => {
    let arr1 = [0, 1, 2, 0, 0, 0, 6, 7, 8,
      9, 10, 11, 12, 13, 14, 15, 16, 17, 
      18, 19, 20, 0, 22, 23, 24, 25, 26, 
      27, 28, 29, 0, 31, 32, 33, 34, 35, 
      36, 37, 38, 39, 40, 41, 42, 43, 44, 
      45, 46, 47, 48, 39, 50, 51, 52, 53, 
      54, 0, 0, 0, 0, 0, 0, 61, 62, 
      63, 64, 65, 66, 67, 68, 69, 70, 0, 
      72, 73, 74, 75, 76, 77, 0, 0, 0];

    let arr2 = [0, 1, 2, 3, 4, 5, 6, 7, 8,
        9, 10, 11, 12, 13, 14, 15, 0, 0, 
        0, 0, 0, 21, 22, 23, 24, 25, 26, 
        27, 28, 29, 30, 31, 32, 33, 34, 35, 
        36, 37, 38, 39, 40, 41, 42, 43, 44, 
        45, 46, 47, 48, 49, 50, 51, 52, 53, 
        54, 55, 56, 57, 58, 59, 60, 61, 62, 
        63, 64, 65, 66, 67, 68, 69, 70, 71, 
        72, 73, 74, 75, 76, 77, 78, 79, 80]

    test('horizontal clearing 1', () => {
      const clearedCells = new Set();
      clearMatch(0, arr1, clearedCells)
      expect(clearedCells).toEqual(new Set([])); 
    });
    
    test('horizontal clearing 2', () => {
      const clearedCells = new Set();
      clearMatch(3, arr1, clearedCells)
      expect(clearedCells).toEqual(new Set([3,4,5])); 
    });

    test('horizontal clearing 3', () => {
      const clearedCells = new Set();
      clearMatch(4, arr1, clearedCells)
      expect(clearedCells).toEqual(new Set([3,4,5])); 
    });

    test('horizontal clearing 4', () => {
      const clearedCells = new Set();
      clearMatch(80, arr1, clearedCells)
      expect(clearedCells).toEqual(new Set([78,79,80])); 
    });

    test('horizontal clearing 5', () => {
      const clearedCells = new Set();
      clearMatch(57, arr1, clearedCells)
      expect(clearedCells).toEqual(new Set([55,56,57,58,59,60])); 
    });

    test('wrapping 1', () => {
      const clearedCells = new Set();
      clearMatch(16, arr2, clearedCells)
      expect(clearedCells).toEqual(new Set([])); 
    });

    test('wrapping 2', () => {
      const clearedCells = new Set();
      clearMatch(17, arr2, clearedCells)
      expect(clearedCells).toEqual(new Set([])); 
    });

    test('wrapping 3', () => {
      const clearedCells = new Set();
      clearMatch(18, arr2, clearedCells)
      expect(clearedCells).toEqual(new Set([18,19,20])); 
    });
  });

});

describe("2D Matches", () => {
  let arr1 = [0, 0, 0, 3, 4, 5, 6, 7, 8,
              0, 10, 11, 12, 0, 14, 15, 16, 17, 
              0, 19, 20, 21, 0, 23, 24, 25, 26, 
              27, 28, 29, 30, 0, 32, 33, 34, 35, 
              36, 37, 38, 39, 0, 41, 42, 43, 44, 
              45, 46, 47, 0, 0, 0, 0, 0, 0, 
              54, 55, 56, 57, 0, 59, 60, 61, 0, 
              63, 64, 65, 66, 67, 68, 69, 70, 0, 
              72, 73, 74, 75, 76, 77, 78, 79, 0];

  test('2D Clear 1', () => {
    const clearedCells = new Set();
    clearMatch(49, arr1, clearedCells)
    expect(clearedCells).toEqual(new Set([13,22,31,40,49,58,48,50,51,52,53])); 
  });

  test('2D Clear 2', () => {
    const clearedCells = new Set();
    clearMatch(0, arr1, clearedCells)
    expect(clearedCells).toEqual(new Set([0,1,2,9,18])); 
  });

  test('2D Clear 3', () => {
    const clearedCells = new Set();
    clearMatch(1, arr1, clearedCells)
    expect(clearedCells).toEqual(new Set([0,1,2])); 
  });

  test('2D Clear 4', () => {
    const clearedCells = new Set();
    clearMatch(18, arr1, clearedCells)
    expect(clearedCells).toEqual(new Set([0,9,18])); 
  });

  test('2D Clear 5', () => {
    const clearedCells = new Set();
    clearMatch(58, arr1, clearedCells)
    expect(clearedCells).toEqual(new Set([58,49,40,31,22,13])); 
  });

  test('2D Clear 6', () => {
    const clearedCells = new Set();
    clearMatch(48, arr1, clearedCells)
    expect(clearedCells).toEqual(new Set([48,49,50,51,52,53])); 
  });

  test('2D Clear 7', () => {
    const clearedCells = new Set();
    clearMatch(53, arr1, clearedCells)
    expect(clearedCells).toEqual(new Set([48,49,50,51,52,53,62,71,80])); 
  });

  test('2D Clear 8', () => {
    const clearedCells = new Set();
    clearMatch(80, arr1, clearedCells)
    expect(clearedCells).toEqual(new Set([80,71,62,53])); 
  });
});

describe('Board clearing', () => {
  let arr1 = [0, 0, 0, 3, 4, 5, 6, 7, 8,
    0, 10, 11, 12, 0, 14, 15, 16, 17, 
    0, 19, 20, 21, 0, 23, 24, 25, 26, 
    27, 28, 29, 30, 0, 32, 33, 34, 35, 
    36, 37, 38, 39, 0, 41, 42, 43, 44, 
    45, 46, 47, 0, 0, 0, 0, 0, 0, 
    54, 55, 56, 57, 0, 59, 60, 61, 0, 
    63, 64, 65, 66, 67, 68, 69, 70, 0, 
    72, 73, 74, 75, 76, 77, 78, 79, 0];

    test('clear all matches', () => {
      let clearedCells = findAllMatches(arr1)
      expect(clearAllMatches(arr1, clearedCells)).toEqual(
        [null, null, null, 3, 4, 5, 6, 7, 8,
          null, 10, 11, 12, null, 14, 15, 16, 17, 
          null, 19, 20, 21, null, 23, 24, 25, 26, 
          27, 28, 29, 30, null, 32, 33, 34, 35, 
          36, 37, 38, 39, null, 41, 42, 43, 44, 
          45, 46, 47, null, null, null, null, null, null, 
          54, 55, 56, 57, null, 59, 60, 61, null, 
          63, 64, 65, 66, 67, 68, 69, 70, null, 
          72, 73, 74, 75, 76, 77, 78, 79, null]
      )
    })
})


/* ----------------------------------  Example Functions used to test Jest Testing  ---------------------------------- */

// export function add(a, b) {
//   return a + b;
// }

// export function useExampleHook(initialValue) {
//   const [value, setValue] = useState(initialValue);

//   useEffect(() => {
//     // Some side effect logic here
//   }, [value]);

//   const increment = () => {
//     setValue(value + 1);
//   };

//   return { value, increment };
// }

// export function useExampleHook(initialValue) {
//   const [value, setValue] = useState(initialValue);

//   useEffect(() => {
//     // Some side effect logic here
//   }, [value]);

//   const increment = () => {
//     setValue(value + 1);
//   };

//   return { value, increment };
// }


/* ----------------------------------  Example Test Cases w/ Example Functions  ---------------------------------- */

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