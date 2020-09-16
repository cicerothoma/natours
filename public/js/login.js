const form = document.querySelector('.form');

const login = async (email, password) => {
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
      url: 'http://127.0.0.1:4000/api/v1/users/login',
      data: {
        email,
        password,
      },
    });
    const username = response.data.data.user.name;
    if (response.data.status === 'success') {
      alert(`Welcome back ${username}`);
      setTimeout(() => {
        location.assign('/');
      }, 900);
    }
  } catch (err) {
    alert(err.response.data.message);
  }
};

form.addEventListener('submit', (el) => {
  el.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  login(email, password);
});
