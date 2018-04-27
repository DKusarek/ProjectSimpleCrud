var express = require('express');

var routes = function (db) {
    var groupRouter = express.Router();
    var groupController = require('../Controllers/groupController')(db);
    groupRouter.route('/')
        .post(groupController.post)
        .get(groupController.get);
    groupRouter.use('/:groupId', function (req, res, next) {
        let sql = `SELECT * from Groups where groupId=${req.params.groupId}`;
        db.get(sql,[],function(err, group){
            if (err) {
                res.status(500).send(err);
            } else if (group) {
                req.group = group;
                next();
            } else {
                res.status(404).send('Group not found');
            }
        });
    });
    groupRouter.route('/:groupId')
        .get(groupController.getId)
        .put(groupController.putId)
        .patch(groupController.patchId)
        .delete(groupController.deleteId);
    return groupRouter;
};

module.exports = routes;