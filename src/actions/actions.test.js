import * as actions from './actions';

describe('actions', () => {
  it('creates an action to setGlobalMobilityDataByDate', () => {
    const date = '';
    const expectedAction = {};

    expect(actions.setGlobalMobilityDataByDate(date)).toEqual(expectedAction);
  });
});
