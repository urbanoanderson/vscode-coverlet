'use strict';

import * as vscode from 'vscode';
import * as strip from './strip';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.commands.registerCommand('extension.coverletStrip', coverletStripHandler));
	context.subscriptions.push(vscode.commands.registerCommand('extension.coverletFilecheck', coverletFilecheckHandler));
	context.subscriptions.push(vscode.commands.registerCommand('extension.coverletFilecheckMenu', coverletFilecheckMenuHandler));
}

export function coverletStripHandler() {
	let editor = vscode.window.activeTextEditor;

	if (editor) {
		let document = editor.document;

		// Get range of the full document
		var firstLine = editor.document.lineAt(0);
		var lastLine = editor.document.lineAt(editor.document.lineCount - 1);
		var textRange = new vscode.Range(0,
							firstLine.range.start.character,
							editor.document.lineCount - 1,
							lastLine.range.end.character);

		var processedReport = strip.stripAllTestedCode(document.getText())

		if (processedReport == null){
			vscode.window.showErrorMessage("Error: selected file is not a valid json")
		}
		else{
			// Replace document by the processed text
			editor.edit(editBuilder => {
				editBuilder.replace(textRange, JSON.stringify(processedReport, null, 2));
			});
		}
	}
}

export function coverletFilecheckHandler() {
	// An editor must be opened
	if(!vscode.window.activeTextEditor) {
		vscode.window.showErrorMessage("Error: no file is currently opened");
		return;
	}

	// Current file is not a C# source file
	if(vscode.window.activeTextEditor.document.languageId !== "csharp")	{
		vscode.window.showErrorMessage("Error: current file is not a C# source code file");
		return;
	}

	filecheck(vscode.window.activeTextEditor.document.fileName);
}

export function coverletFilecheckMenuHandler(uri:vscode.Uri) {
	filecheck(uri.fsPath);
};

export function filecheck(classFilename : string) {
	//Find a coverlet report file
	vscode.workspace.findFiles('**/coverage.json', '**/node_modules/**', 1).then((uris) => {
		if(uris.length === 0) {
			vscode.window.showErrorMessage("Error: could not find a Coverlet 'coverage.json' report file on current workspace");
		}
		else {
			uris.forEach((uri) => {
				//Extract its text
				let reportText = "";
				vscode.workspace.openTextDocument(uri).then(doc =>{
					reportText = doc.getText();
				})
				//Create an untitled striped report file
				.then(() => {
					vscode.workspace.openTextDocument({ language: 'json' }).then(doc => {
						vscode.window.showTextDocument(doc).then(e => {
							e.edit(edit => {
								let newReportContent = strip.stripAllButOneFile(reportText, classFilename);
								if (newReportContent === null){
									vscode.window.showErrorMessage("Error: selected report file is invalid")
								}
								else {
									edit.insert(new vscode.Position(0, 0), JSON.stringify(newReportContent, null, 2));
								}
							});
						});
					});
				});
			});
		}
	});
}