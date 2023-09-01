const CryptoJS = require('crypto-js'); // Import CryptoJS
const Cookies =  require("js-cookie");

describe('Programmatic Login', () => {
  it('should login programmatically and access the desired page', () => {
    // Assume your login API endpoint and desired authenticated page URL
    const loginUrl = 'https://qa-bend.source2.link/api/user/login'; // Replace with your actual login API endpoint
    const desiredPageUrl = 'https://qa.source2.link/jobs'; // Replace with your actual desired authenticated page URL

    // Define the user credentials used for login
    const username = 'azher.iqbal@codedistrict.com'; // Replace with the actual username
    const password = '25d55ad283aa400af464c76d713c07ad'; // Replace with the actual password

    // Perform a POST request to your login API endpoint with the user credentials
    cy.request('POST', loginUrl, {
      username,
      password,
    }).then((response) => {
      cy.log(response.body)
      // Assuming the server responds with the MD5 token as "token" in the response body
      const md5Token = response.body.api_token; // Replace "token" with the actual key used in the response
      // Encrypt the MD5 token using CryptoJS
      const encryptedToken = encryptToken(md5Token);

      // Set the encrypted token in a cookie
      cy.setCookie('source2_logged_in_user', encryptedToken);
      cy.getCookie(encryptedToken)
        cy.visit(desiredPageUrl);
    });
  });
});


// function encryptToken(md5Token) {
//   // Replace this encryption logic with CryptoJS
//   // For demonstration purposes, we'll use AES encryption with a random key (not secure, just for illustration)
//   const key = 'U2FsdGVkX18oOFhtHFIGJT7E3ciVFp0disQ2iBZuUvZ3JrbZaaa+5LsLkdLnPcGx'; // Replace with a secure key in a real-world scenario
//   const encryptedUser = CryptoJS.AES.encrypt(md5Token, "source2_logged_in_user");
//   Cookies.set("user", encryptedUser, {
//     path: "/",
//     domain: "qa.source2.link",
//     expires:  365,
//   });
//   return encryptedUser;
// }

function encryptToken(md5Token) {
  // Replace this encryption logic with CryptoJS
  // For demonstration purposes, we'll use AES encryption with a random key (not secure, just for illustration)
  const key = 'source2_logged_in_user'; // Replace with a secure key in a real-world scenario
  const encrypted = CryptoJS.AES.encrypt(md5Token, key).toString();
  return encrypted;
}

