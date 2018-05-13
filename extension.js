/* jshint esversion: 6 */

//Required modules
const vscode = require('vscode');
const path = require('path');

//Get preferences
const preferences = vscode.workspace.getConfiguration('open-file-between-two-folder');
const folderPairList = preferences.get('folderPairList');

//Set error view
const showError = message => vscode.window.showErrorMessage(`Open file from opposite: ${message}`);

exports.activate = context => {
  //Register command
  const openFileFromOtherFolder = vscode.commands.registerCommand('extension.openFileFromOtherFolder', () => {

    //Check to see if workspace is open
    if (!vscode.workspace.rootPath) {
      return showError('You must have a workspace opened.');
    }

    let editor = vscode.window.activeTextEditor;
    var currentlyOpenTabfilePath = editor.document.fileName;

    let searchOppositeFile = currentFile => {
      var found = false;
      for (var index in folderPairList) {
        if (currentFile.startsWith(path.join(vscode.workspace.rootPath, folderPairList[index][0]))) {
          // forward match
          let oppositeFile = currentFile.replace(
            path.join(vscode.workspace.rootPath, folderPairList[index][0]),
            path.join(vscode.workspace.rootPath, folderPairList[index][1])
          );
          var openPath = vscode.Uri.file(oppositeFile);
          vscode.workspace.openTextDocument(openPath).then(vscode.window.showTextDocument);
          found = true;
          break;
        } else if (currentFile.startsWith(path.join(vscode.workspace.rootPath, folderPairList[index][1]))) {
          // backward match
          let oppositeFile = currentFile.replace(
            path.join(vscode.workspace.rootPath, folderPairList[index][1]),
            path.join(vscode.workspace.rootPath, folderPairList[index][0])
          );
          let openPath = vscode.Uri.file(oppositeFile);
          vscode.workspace.openTextDocument(openPath).then(vscode.window.showTextDocument);
          found = true;
          break;
        }
      }

      if (found != true) {
        showError("Warning, no matches were found.");
      }
    };

    searchOppositeFile(currentlyOpenTabfilePath);
  });

  context.subscriptions.push(openFileFromOtherFolder);
};

exports.deactivate = () => { };