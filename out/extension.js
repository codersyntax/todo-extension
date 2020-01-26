"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "todo" is now active!');
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand("extension.findtodos", () => {
        // The code you place here will be executed every time your command is executed
        if (vscode !== undefined) {
            if (vscode.workspace !== undefined) {
                if (vscode.workspace.workspaceFolders !== undefined) {
                    const workspacePath = vscode.workspace.workspaceFolders[0].uri.fsPath;
                    checkWorkspace(workspacePath);
                }
            }
        }
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function checkWorkspace(workspacePath) {
    fs.readdir(workspacePath, (err, files) => {
        if (err) {
            vscode.window.showErrorMessage("Could not find your current workspace");
            vscode.window.showWorkspaceFolderPick();
        }
        else {
            checkFiles(workspacePath, files);
        }
    });
}
function checkFiles(directoryPath, files) {
    files.forEach(file => {
        fs.lstat(path.join(directoryPath, file), (err, fileStat) => {
            if (fileStat && !err) {
                if (fileStat.isFile()) {
                    fs.readFile(path.join(directoryPath, file), "utf8", (err, fileContent) => {
                        if (err) {
                            return err;
                        }
                        else {
                            if (fileContent.toLowerCase().includes("todo")) {
                                vscode.window
                                    .showInformationMessage(`TODO found: ${path.join(directoryPath, file)}`, "Open File")
                                    .then(selection => {
                                    if (selection === "Open File") {
                                        vscode.workspace
                                            .openTextDocument(path.join(directoryPath, file))
                                            .then(doc => {
                                            vscode.window.showTextDocument(doc, vscode.ViewColumn.Active, false);
                                        });
                                    }
                                });
                            }
                        }
                    });
                }
                else {
                    fs.readdir(path.join(directoryPath, file), (err, files) => {
                        checkFiles(path.join(directoryPath, file), files);
                    });
                }
            }
        });
    });
}
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map