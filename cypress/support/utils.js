const { faker } = require('@faker-js/faker');
const fakerBr = require('faker-br');

const generateFirstName = () => faker.person.firstName();
const generateLastName = () => faker.person.lastName();
const generateFullName = () => faker.person.fullName();
const generateEmail = () => faker.internet.email();
const generatePassword = () => faker.internet.password();

module.exports = {
	generateFirstName,
	generateLastName,
	generateFullName,
	generateEmail,
    generatePassword
};