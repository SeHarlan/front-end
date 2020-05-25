import { SET_GLOBAL_MAP_MOBILITY_BY_DATE } from '../actions/globalActions';


const initialState = {
  globalMapMobilityByDate: {}
};

export default function reducer(state = initialState, { type, payload }) {
  switch(type) {
    case SET_GLOBAL_MAP_MOBILITY_BY_DATE:
      return { ...state, globalMapMobilityByDate: payload };
    default: 
      return state;
  }
}
