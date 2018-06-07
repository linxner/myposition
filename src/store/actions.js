import * as types from './mutation-types'

export const selectPlay = function ({ commit}, {list,index}) {
  commit(types.SET_SQUENCE_LIST, list)
  commit(types.SET_PLAYLIST, list)
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN,true)
  commit(types.SET_PLAYING,true)
}
