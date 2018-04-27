var express = require('express');

var routes = function (db) {
    var userRouter = express.Router();
    var userController = require('../Controllers/userController')(db);
    userRouter.route('/')
        .post(userController.post)
        .get(userController.get);
    
    userRouter.use('/:userId', function (req, res, next) {
        let sql = `SELECT * from Users where userId=${req.params.userId}`;
        db.get(sql,[],function(err, user){
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
    userRouter.route('/:userId')
        .get(userController.getId)
        .put(userController.putId)
        .patch(userController.patchId)
        .delete(userController.deleteId);
    
    return userRouter;
};

module.exports = routes;