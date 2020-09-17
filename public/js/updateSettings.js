import axios from 'axios';
import { showAlert } from './alerts';

export const updateData = async (name, email) => {
  try {
    const res = await axios({
      url: 'http://127.0.0.1:4000/api/v1/users/updateMe',
      method: 'PATCH',
      data: {
        name,
        email,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Profile Updated Successfully!');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
