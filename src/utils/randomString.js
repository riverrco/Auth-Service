// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

/**
 * Creates random string with the length provided
 */

const randomString = (digit) => {
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({length:digit})
    .map(i =>  possible.charAt(Math.floor(Math.random() * possible.length)))
    .join('');
};

export default randomString;