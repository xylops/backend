module.exports = {
    'secret': 'thisissomerandomsecretkey',
    'database': 'mongodb://xylops:1234@ds151059.mlab.com:51059/backend',
    //refresh users token every 5 minutes
    'tokenExpiredIn': 300,
    //forced user to do a relogin every 6 hours
    'forceExpired':4800
};
