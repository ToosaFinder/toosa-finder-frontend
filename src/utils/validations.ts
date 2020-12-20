// eslint-disable-next-line no-useless-escape
const regExpEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const regExpLogin = /^[a-zA-Z](.[a-zA-Z0-9_-]*)$/;

function validateEmail(email: string): boolean {
  return regExpEmail.test(email.toLowerCase());
}

function validateLogin(login: string): boolean {
  return regExpLogin.test(login);
}

function validatePassword(password: string): boolean {
  return password.length >= 8;
}

export { validateEmail, validateLogin, validatePassword };
