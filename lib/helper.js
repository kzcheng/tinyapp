const generateRandomString = function() {
  const length = 6;
  let result = ``;
  let characters = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`;
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const getUserByEmail = function(email, database) {
  for (const uid in database) {
    if (database[uid].email === email) {
      return database[uid];
    }
  }
  return undefined;
};

const getURLsOfUser = function(id, urlDatabase) {
  let returnObj = {};
  for (const shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === id) {
      returnObj[shortURL] = urlDatabase[shortURL];
    }
  }
  return returnObj;
};

const checkDuplicatedEmail = function(email, userDatabase) {
  for (const userID in userDatabase) {
    if (userDatabase[userID].email === email) {
      return true;
    }
  }
  return false;
};

module.exports = {
  generateRandomString,
  getUserByEmail,
  getURLsOfUser,
  checkDuplicatedEmail,
};