Email Validator
====

The email validator library provides a validation routine for an email address based on.

### Format Checking 

Checking the format of the address including RFC-822 nickname style addresses (i.e. My Name <test@foo.com>).

Format checking is performed by using a regular expression. 

### Domain Checking

Checks the domain and reviews to see if a valid MX record exists based on the DNS priority records

## Example Usage

```javascript
const emailValidator = require("../index").EmailValidator;

...
emailValidator.validEmail("test@foo.com", (err, res) => {
   
    if (err) throw err;
    
    // email is valid, so continue...
    
});

```

