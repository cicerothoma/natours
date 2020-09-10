module.exports = function (str) {
  const slugArr = [...str.trim().toLowerCase()].map((val) => {
    if (val === ' ') {
      val = '-';
    }
    return val;
  });
  const slug = slugArr.join('');

  return slug;
};
