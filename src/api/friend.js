import {_post} from './index'



export const addFriend = (data) => {

    let req = {
      data: data,
      url: 'friend/applyfriend',
    }
    return _post(req);
}


export const getFriend = (data) => {

  let req = {
    data: data,
    url: 'index/getfriend',
  }
  return _post(req);
}


export const deleteFriend = (data) => {

  let req = {
    data: data,
    url: 'friend/deletefriend',
  }
  return _post(req);
}


export const isFriend = (data) => {

  let req = {
    data: data,
    url: 'search/isfriend',
  }
  return _post(req);
}


export const agreeFriend = (data) => {

  let req = {
    data: data,
    url: 'friend/updateFriendState',
  }
  return _post(req);
}

