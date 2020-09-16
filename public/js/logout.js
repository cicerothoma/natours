if (window.location.pathname.includes('/')) {
  if (document.querySelector('.nav__el--logout')) {
    document
      .querySelector('.nav__el--logout')
      .addEventListener('click', async () => {
        console.log('Hello');
        try {
          //   const res = await axios({
          //     method: 'GET',
          //     url: 'http://127.0.0.1:4000/api/v1/users/logout',
          //   });
          //   console.log(res);
          // The FETCH API also works too
          let res = await fetch('http://127.0.0.1:4000/api/v1/users/logout');
          res = res.json();
          console.log(res);

          window.location.reload();
        } catch (err) {
          //   showAlert('error', err.response.data.message);
          console.log(err);
        }
      });
  }
}
