import React from 'react';

export function useStore(store) {

  // complain if no or wrong store is provided
  if (!store || typeof store !== 'function') {
    throw new Error('You must provide a store function to the useStore hook!');
  }

  return store();
}
