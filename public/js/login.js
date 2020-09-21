import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (email, password) => {
  try {
    // Using FETCH API. Doesn't return response from server || Still Works
    // const response = await fetch('http://127.0.0.1:4000/api/v1/users/login', {
    //   method: 'POST',
    //   headers: {
    //     Accept: '*/*',
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     email,
    //     password,
    //   }),
    // });
    // Using Axios | Best Solution
    const response = await axios({
      method: 'POST',
      url: '/api/v1/users/login', // This works because the API and website are hosted on the same platform
      data: {
        email,
        password,
      },
    });
    const username = response.data.data.user.name;
    if (response.data.status === 'success') {
      showAlert('success', `Welcome Back ${username}!!`);
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    // AXIOS
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
    });
    // console.log(res);
    // FETCH API
    // const res = await fetch('http://127.0.0.1:4000/api/v1/users/logout');
    // console.log(res.json());
    if (res.data.status === 'success') {
      window.location.assign('/');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
