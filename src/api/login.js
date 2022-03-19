import {_post} from './index'


export const loginApi = (data) => {
  let req = {
    data,
    url: 'signin/match'
  }
  return _post(req);
}