import {_post} from './index'

export const getLastMessage = (data) => {
  let req = {
    data,
    url: 'index/getlastmsg'
  }
  return _post(req);
}

export const getMessage = (data) => {
  
  let req = {
    data,
    url: 'chat/msg'
  }
  if(data.friendType == 1){
    req.url = 'index/getgroupmsg'
  }
  return _post(req);
}

export const readMessageForGroup = (data) => {
  
  let req = {
    data,
    url: 'index/updategroupmsg'
  }
  return _post(req);
}


export const getUnreadMessage = (data) => {
  let req = {
    data,
    url: 'index/unreadmsg'
  }
  return _post(req);
}

export const sendMessage = (data) => {
  let req = {
    data,
    url: 'chat/sendMessage'
  }
  return _post(req);
}

export const sendImageMessage = (data) => {
  let req = {
    data: data,
    url: 'file/sendImageMessage',
  }
  return _post(req);
}

export const readMessage = (data) => {

  let req = {
    data: data,
  }

  req.url = 'index/updatemsg'
  
  return _post(req);

  
}