'use strict';

var _ = require('lodash');
var Store = require('../../components/store');

var getUser = function (user) {

    if (user.provider === 'local') {
        return user.name;
    }

    return user[user.provider].login;
};

exports.index = function (req, res) {

    Store.getWorkspaces(getUser(req.user)).then(function (workspaces) {

        return res.json({
            workspaces: workspaces
        });
    }).catch(function (err) {
        handleError(res, err);
    });
};

exports.getFile = function (req, res) {
    var workspace = req.params.workspace;
    var file = req.params.file;

    Store.getFile(getUser(req.user) + '/' + workspace, file).then(function (file) {

        return res.json({
            file: file
        });
    }).catch(function (err) {
        handleError(res, err);
    });
};

exports.getFilesInWorkspace = function (req, res) {
    var workspace = req.params.workspace;

    Store.getFiles(getUser(req.user) + '/' + workspace).then(function (files) {

        return res.json({
            files: files
        });
    }).catch(function (err) {
        handleError(res, err);
    });
};

exports.createWorkspace = function (req, res) {
    var name = req.params.workspace;

    Store.createWorkspace(getUser(req.user) + '/' + name).then(function () {

        return res.json({
            message: 'Workspace successfully created.'
        });
    }).catch(function (err) {
        handleError(res, err);
    });
};

exports.updateFile = function (req, res) {
    var workspace = req.params.workspace;
    var file = req.params.file;

    Store.writeFile(getUser(req.user) + '/' + workspace, file, req.body.file).then(function (file) {

        return res.json({
            message: 'File updated successfully.',
            content: file
        });
    }).catch(function (err) {
        handleError(res, err);
    });
};

exports.createFile = function (req, res) {
    var workspace = req.params.workspace;
    var file = req.params.file;

    Store.createFile(getUser(req.user) + '/' + workspace, file).then(function (file) {

        return res.json({
            message: 'File created successfully.'
        });
    }).catch(function (err) {
        handleError(res, err);
    });
};

function handleError(res, err) {
    return res.status(err.status || 500).json({error: err});
}
