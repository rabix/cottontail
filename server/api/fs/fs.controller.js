'use strict';

var Store = require('../../components/store');

exports.index = function (req, res) {
    
    Store.getWorkspaces('').then(function (workspaces) {
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

    Store.getFile(workspace, file).then(function (data) {
	    
        return res.json({
            content: data
        });
    }).catch(function (err) {
        handleError(res, err);
    });
};

exports.getFilesInWorkspace = function (req, res) {
    var workspace = req.params.workspace;

    Store.getFiles(workspace).then(function (files) {

        return res.json({
            files: files
        });
    }).catch(function (err) {
        handleError(res, err);
    });
};

exports.createWorkspace = function (req, res) {
    var name = req.params.workspace;

    console.log(name);
    
    Store.createWorkspace(name).then(function (ws) {
        console.log(ws);

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

    Store.writeFile(workspace, file, req.body.content).then(function (file) {

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

    Store.createFile(workspace, file).then(function (file) {

        return res.json({
            message: 'File created successfully.',
            content: file
        });
    }).catch(function (err) {
        handleError(res, err);
    });
};

function handleError(res, err) {
    return res.status(err.status || 500).json({error: err});
}
