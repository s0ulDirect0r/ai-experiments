import type { TraceTableColumn, TraceTableRow } from './TraceTable';

export interface Algorithm {
  id: string;
  name: string;
  description: string;
  code: string;
  columns: TraceTableColumn[];
  generateTrace: () => TraceTableRow[];
}

// Sum of Numbers (0 to 5)
export const sumAlgorithm: Algorithm = {
  id: 'sum',
  name: 'Sum of Numbers',
  description: 'A simple loop that calculates the sum of numbers from 0 to 5',
  code: `let sum = 0;
for (let i = 0; i <= 5; i++) {
  sum += i;
}`,
  columns: [
    { key: 'i', label: 'i' },
    { key: 'sum', label: 'sum' },
    { key: 'condition', label: 'i <= 5' }
  ],
  generateTrace: () => {
    const trace: TraceTableRow[] = [];
    let sum = 0;

    for (let i = 0; i <= 5; i++) {
      sum += i;
      trace.push({ i, sum, condition: i <= 5 });
    }

    // Exit state
    trace.push({ i: 6, sum, condition: false });

    return trace;
  }
};

// Countdown
export const countdownAlgorithm: Algorithm = {
  id: 'countdown',
  name: 'Countdown',
  description: 'Count down from 5 to 0',
  code: `for (let i = 5; i >= 0; i--) {
  console.log(i);
}`,
  columns: [
    { key: 'i', label: 'i' },
    { key: 'condition', label: 'i >= 0' }
  ],
  generateTrace: () => {
    const trace: TraceTableRow[] = [];

    for (let i = 5; i >= 0; i--) {
      trace.push({ i, condition: i >= 0 });
    }

    // Exit state
    trace.push({ i: -1, condition: false });

    return trace;
  }
};

// Factorial
export const factorialAlgorithm: Algorithm = {
  id: 'factorial',
  name: 'Factorial',
  description: 'Calculate 5! (factorial of 5)',
  code: `let factorial = 1;
for (let i = 1; i <= 5; i++) {
  factorial *= i;
}`,
  columns: [
    { key: 'i', label: 'i' },
    { key: 'factorial', label: 'factorial' },
    { key: 'condition', label: 'i <= 5' }
  ],
  generateTrace: () => {
    const trace: TraceTableRow[] = [];
    let factorial = 1;

    for (let i = 1; i <= 5; i++) {
      factorial *= i;
      trace.push({ i, factorial, condition: i <= 5 });
    }

    // Exit state
    trace.push({ i: 6, factorial, condition: false });

    return trace;
  }
};

// Fibonacci
export const fibonacciAlgorithm: Algorithm = {
  id: 'fibonacci',
  name: 'Fibonacci Sequence',
  description: 'Generate first 7 Fibonacci numbers',
  code: `let a = 0, b = 1;
for (let i = 0; i < 7; i++) {
  let temp = a + b;
  a = b;
  b = temp;
}`,
  columns: [
    { key: 'i', label: 'i' },
    { key: 'a', label: 'a (prev)' },
    { key: 'b', label: 'b (current)' },
    { key: 'condition', label: 'i < 7' }
  ],
  generateTrace: () => {
    const trace: TraceTableRow[] = [];
    let a = 0, b = 1;

    for (let i = 0; i < 7; i++) {
      let temp = a + b;
      a = b;
      b = temp;
      trace.push({ i, a, b, condition: i < 7 });
    }

    // Exit state
    trace.push({ i: 7, a, b, condition: false });

    return trace;
  }
};

// Even Counter
export const evenCounterAlgorithm: Algorithm = {
  id: 'evenCounter',
  name: 'Count Even Numbers',
  description: 'Count how many even numbers between 0 and 10',
  code: `let count = 0;
for (let i = 0; i <= 10; i++) {
  if (i % 2 === 0) {
    count++;
  }
}`,
  columns: [
    { key: 'i', label: 'i' },
    { key: 'isEven', label: 'i % 2 === 0' },
    { key: 'count', label: 'count' },
    { key: 'condition', label: 'i <= 10' }
  ],
  generateTrace: () => {
    const trace: TraceTableRow[] = [];
    let count = 0;

    for (let i = 0; i <= 10; i++) {
      if (i % 2 === 0) {
        count++;
      }
      trace.push({ i, isEven: i % 2 === 0, count, condition: i <= 10 });
    }

    // Exit state
    trace.push({ i: 11, isEven: false, count, condition: false });

    return trace;
  }
};

export const algorithms: Algorithm[] = [
  sumAlgorithm,
  countdownAlgorithm,
  factorialAlgorithm,
  fibonacciAlgorithm,
  evenCounterAlgorithm
];
