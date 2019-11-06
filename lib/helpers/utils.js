const generateRandomPassword = () => Math.random().toString(36).slice(2);

module.exports = {
    generateRandomPassword
}