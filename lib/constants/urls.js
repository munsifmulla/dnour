// Pre Fetching Data
const API_BASE = process.env.API_BASE;
const urls = {
    list: API_BASE + '/list-log',
    getLog: API_BASE + '/get-log',
};

module.exports = {
    urls
}