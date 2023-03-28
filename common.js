// close
const close = () => {
  window.close();
};
s
const setCookie = (key, data) => {
  const now = new Date();
  const expiry = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 day
  document.cookie = key+"="+data+"; expires=" + expiry.toUTCString() + "; path=/";
};

function getCookieValue(name) {
  const cookies = document.cookie.split(";").map(cookie => cookie.trim().split("=")).reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
  return cookies[name];
}
