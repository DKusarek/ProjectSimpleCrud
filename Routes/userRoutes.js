var express = require('express');

var routes = function (db) {
    var userRouter = express.Router();
    var userController = require('../Controllers/userController')(db);
    userRouter.route('/')
        .post(userController.post)
        .get(userController.get);
    
    userRouter.use('/:userId', function (req, res, next) {
        User.findById(req.params.userId, function (err, user) {
            if (err) {
                res.status(500).send(err);
            } else if (user) {
                req.user = user;
                next();
            } else {
                res.status(404).send('User not found');
            }
        });
    });
    
    
    return userRouter;
};

module.exports = routes;