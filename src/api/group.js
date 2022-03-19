import {_post} from './index'



export const buildGroup = (data) => {

    let req = {
      data: data,
      url: 'group/buildgroup',
    }
    return _post(req);
}


export const getGroup = (data) => {

  let req = {
    data: data,
    url: 'index/getgroup',
  }
  return _post(req);
}


export const deletegroup = (data) => {

  let req = {
    data: data,
    url: 'group/deletegroup',
  }
  return _post(req);
}


export const isgroup = (data) => {

  let req = {
    data: data,
    url: 'search/isgroup',
  }
  return _post(req);
}


export const agreegroup = (data) => {

  let req = {
    data: data,
    url: 'group/updategroupState',
  }
  return _post(req);
}

