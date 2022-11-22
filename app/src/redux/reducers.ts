interface ErrorReducer {
  type: string;
  payload: string;
}

export const errors = (state = [], { type, payload }: ErrorReducer) => {
  switch (type) {
    case 'ADD_ERROR':
      return [...state, payload];
    case 'REMOVE_CURRENT_ERROR':
      //remove the first error
      return state.filter((_, idx) => idx !== 0);
    default:
      return state;
  }
};
