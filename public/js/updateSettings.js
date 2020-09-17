import axios from 'axios';
import { showAlert } from './alerts';

export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? 'http://127.0.0.1:4000/api/v1/users/updateMyPassword'
        : 'http://127.0.0.1:4000/api/v1/users/updateMe';
    const res = await axios({
      url,
      method: 'PATCH',
      data,
    });
    console.log(res);
    if (res.data.status === 'success') {
      showAlert('success', `${type} Updated Successfully!`.toUpperCase());
    }
  } catch (err) {
    console.log(err.response);
    showAlert('error', err.response.data.message);
  }
};
