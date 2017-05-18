let assert = require("chai").assert;
let emailValidator = require("../index").EmailValidator;

describe("EmailValidator", () => {
    "use strict";

    describe("obtains address by priority", () => {


        it("prioritises an address with multi values", () => {

            assert.deepEqual(emailValidator.getAddressByPriority([
                {priority: 50, address: "localhost1"},
                {priority: 40, address: "localhost2"},
                {priority: 30, address: "localhost3"},
                {priority: 20, address: "localhost4"}
            ]), {priority: 20, address: "localhost4"});

        });

        it("prioritises an address with single values", () => {

            assert.deepEqual(emailValidator.getAddressByPriority([
                {priority: 10, address: "1manband"}
            ]), {priority: 10, address: "1manband"});

            assert.deepEqual(emailValidator.getAddressByPriority([
                {priority: 0, address: "1manband"}
            ]), {priority: 0, address: "1manband"});

            assert.deepEqual(emailValidator.getAddressByPriority([
                {priority: -10, address: "1manband"}
            ]), {priority: -10, address: "1manband"});
        });


        it("prioritises an address with no values", () => {
            assert.isNull(emailValidator.getAddressByPriority([]));
        });

    });

    describe("removes the nickname from an email address", () => {
        it ("removes the nickname part", () => {
            assert.equal(emailValidator.removeNickName("Test Me <test@citypay.com>"), "test@citypay.com");
        });
    });

    describe("obtain the domain from an email address", () => {

        it("domain from a simple address", () => {
            assert.equal(emailValidator.getDomainFromAddress("test@citypay.com"), "citypay.com");
            assert.equal(emailValidator.getDomainFromAddress("test@sub.citypay.com"), "sub.citypay.com");
            assert.equal(emailValidator.getDomainFromAddress("test-along.name@sub.citypay.com"), "sub.citypay.com");
        });
        it("domain from a nickname style address", () => {
            assert.equal(emailValidator.getDomainFromAddress("Test Me <test@citypay.com>"), "citypay.com");
            assert.equal(emailValidator.getDomainFromAddress("Test Me <test@sub.citypay.com>"), "sub.citypay.com");
        });
        it("null for an invalid address with no ampersand", () => {
            assert.equal(emailValidator.getDomainFromAddress("test.citypay.com"), null);
        });
        it("null for an invalid address", () => {
            assert.equal(emailValidator.getDomainFromAddress(null), null);
        });


    });

    describe("validates an mx record", () => {
        it ("obtains an mx record for a known domain", (done) => {
            emailValidator.validateMxRecord("test@citypay.com", (err, res) => {
                assert.isNull(err);
                assert(res, "test@citypay.com");
                done();
            });
        });
        it ("obtains an mx record", (done) => {
            emailValidator.validateMxRecord("test@foo", (err, res) => {
                assert(err, "No addresses found for foo");
                assert.isUndefined(res);
                done();
            });
        });
    });


    describe("validates an email address fully", () => {

        it ("validates an email", (done) => {
            emailValidator.validEmail("test@citypay.com", (err, res) => {
                assert.isNull(err);
                assert(res, "test@citypay.com");
                done();
            });
        });
        it ("validates an invalid email", (done) => {
            emailValidator.validEmail("test@foo", (err, res) => {
                assert(err, "No addresses found for foo");
                assert.isUndefined(res);
                done();
            });
        });

    });


});
