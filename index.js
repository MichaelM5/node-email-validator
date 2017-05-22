const dns = require('dns');

let EmailValidator = function () {};

// extracted from http://emailregex.com
EmailValidator.prototype.Regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

EmailValidator.prototype.removeNickName = function (email) {
    if (email) {
        // check for RFC-822 nickname style i.e. Example Address <example@domain>
        let st = email.indexOf("<");
        let ed = email.indexOf(">", st);
        if (st > -1 && ed > -1) {
            return email.substring(st + 1, ed);
        }
    }
    return email;
};

EmailValidator.prototype.validEmail = function (email, callback) {
    if (typeof email === 'string') {
        let em = this.removeNickName(email);
        if (this.Regex.test(em)) {
            return this.validateMxRecord(em.toLowerCase(), callback);
        } else {
            return callback(`Address ${email} format invalid`)
        }
    }
    return callback(`email string expected, found ${typeof email}`);
};

/**
 * Obtains the address with the highest priority
 * @param addresses
 * @returns an address or {null} if none found
 */
EmailValidator.prototype.getAddressByPriority = function (addresses) {

    let address = addresses && addresses.length > 0 ? addresses[0] : null;

    // find lowest priority
    if (addresses.length > 1) {
        addresses.forEach(a => {
            if (a.priority < address.priority) {
                priority = a.priority;
                address = a;
            }
        });
    }

    return address;
};

EmailValidator.prototype.getDomainFromAddress = function (address) {
    "use strict";
    if (address && address.indexOf('@') > -1) {
        return this.removeNickName(address).split('@')[1];
    } else {
        return null;
    }
};

/**
 * Obtains the mx record
 * @param email
 * @param callback
 */
EmailValidator.prototype.validateMxRecord = function (email, callback) {
    let domain = this.getDomainFromAddress(email);
    dns.resolveMx(domain, (err, addresses) => {

        if (err)
            callback(`Unable to obtain MX record, error: ${err.code}`);
        else if (addresses.length === 0)
            callback(`No addresses found for ${domain}`);
        else {
            let address = this.getAddressByPriority(addresses);
            // console.log("Found %j", address);
            callback(null, email);
        }

    });
};


exports.EmailValidator = new EmailValidator();

