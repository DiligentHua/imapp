import {_post} from './index'

//上传
export const upload = (data) => {
  // let formData = new FormData();
  // Object.keys(data).map(key=>{ formData.append(key,data[key]); });
  // formData.append('file', data)
  let req = {
    data: data,
    url: 'file/upload',
  }
  return _post(req);
}
