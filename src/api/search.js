import {_post} from './index'

export const searchUser = (data) => {

    let req = {
      data: data,
      url: 'search/user',
    }
    return _post(req);
}
  

