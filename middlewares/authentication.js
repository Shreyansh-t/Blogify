const { validate } = require("../models/users");
const {validateToken} = require("../services/authentication");


function checkForAuthenticationCookie(cookieName) {
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookieName];
        if(!tokenCookieValue){
            
        }

        try {
            const userPayload = validateToken(tokenCookieValue);
            req.user = userPayload;
        } catch (error) {
        }
        next();

    };
}


module.exports = {
    checkForAuthenticationCookie,
};
