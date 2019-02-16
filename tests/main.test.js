/* eslint-env jest */
/* global spyOn */
import React, {useState} from 'react';
import {act, cleanup, fireEvent, render, testHook} from 'react-testing-library';
import {useStore} from '../src';

const counterStore = () => {
  const [count, setCount] = useState(0);

  const increment = (amount = 1) => setCount(count + amount);
  const decrement = (amount = 1) => setCount(count - amount);

  return {count, setCount, increment, decrement};
};

const Counter = () => {
  const {count, setCount, increment, decrement} = useStore(counterStore);

  const updateState = () => setCount(100);

  return (
    <div>
      <span>Count: {count}</span>
      <button onClick={() => decrement()}>-</button>
      <button onClick={() => increment()}>+</button>
      <button onClick={updateState}>set</button>
    </div>
  );
};


const brokenStore = () => {};

const BrokenCounter = () => {
  const {state} = useStore(brokenStore);
  return <div>{state}</div>;
};

afterEach(cleanup);

test('should incresase/decrease state counter in hook', () => {
  let count, setCount;
  testHook(() => ({count, setCount} = counterStore()));

  expect(count).toBe(0);

  act(() => {
    setCount(1);
  });
  expect(count).toBe(1);
});

test('should incresase/decrease state counter in container', () => {
  
  const {getByText} = render(
    <Counter />
  );

  expect(getByText(/^Count:/).textContent).toBe('Count: 0');

  fireEvent.click(getByText('+'));
  fireEvent.click(getByText('+'));
  expect(getByText(/^Count:/).textContent).toBe('Count: 2');

  fireEvent.click(getByText('-'));
  expect(getByText(/^Count:/).textContent).toBe('Count: 1');

  fireEvent.click(getByText('set'));
  expect(getByText(/^Count:/).textContent).toBe('Count: 100');
});


test('should throw error when no stores are given to provider', () => {
  spyOn(console, 'error');
  expect(() =>
    useStore()
  ).toThrowError('You must provide a store function to the useStore hook!');
});

test('should work with multiple components using the same store', () => {
  const {getByText: getByText1 } = render(
    <Counter />
  );

  const {getByText: getByText2} = render(
    <Counter />
  );  

  expect(getByText1(/^Count:/).textContent).toBe('Count: 0');
  expect(getByText2(/^Count:/).textContent).toBe('Count: 0');

  fireEvent.click(getByText1('+'));
  fireEvent.click(getByText2('+'));
  expect(getByText1(/^Count:/).textContent).toBe('Count: 2');
  expect(getByText2(/^Count:/).textContent).toBe('Count: 2');

  fireEvent.click(getByText1('-'));
  expect(getByText1(/^Count:/).textContent).toBe('Count: 1');
  expect(getByText2(/^Count:/).textContent).toBe('Count: 1');

  fireEvent.click(getByText2('set'));
  expect(getByText1(/^Count:/).textContent).toBe('Count: 100');
  expect(getByText2(/^Count:/).textContent).toBe('Count: 100');
});
