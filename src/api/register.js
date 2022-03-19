import {_post} from './index'

export const match = (data) => {
    let req = {
      data,
      url: 'signup/add'
    }
    return _post(req);
  }
  


export const registerApi = (data) => {
    let req = {
      data,
      url: 'signup/add'
    }
    return _post(req);
}

export const registerJudge = (data) => {
    let req = {
      data,
      url: 'signup/judge'
    }
    return _post(req);
  }
  
  
