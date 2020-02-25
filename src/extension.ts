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
	// A project must be opened
	if(vscode.workspace == undefined)
		return;

	// An editor must be opened
	if(!vscode.window.activeTextEditor)
		return;

	filecheck(vscode.window.activeTextEditor.document.fileName);
}

export function coverletFilecheckMenuHandler(uri:vscode.Uri) {
	filecheck(uri.fsPath);
};

export function filecheck(classFilename : string) {
	//Find a coverlet report file
	vscode.workspace.findFiles('*/coverage.json', '**/node_modules/**', 1).then((uris) => {
		uris.forEach((uri) => {
			//Extract its text
			var reportText = "";
			vscode.workspace.openTextDocument(uri).then(doc =>{
				reportText = doc.getText();
			})
			//Create a new file
			.then(() => {
				const wpFolders = vscode.workspace && vscode.workspace.workspaceFolders
				const untitledUri = wpFolders && wpFolders[0].uri + '/filecheck.json';

				vscode.workspace.openTextDocument(vscode.Uri.parse('untitled:'+ untitledUri)).then(doc => {
					vscode.window.showTextDocument(doc).then(e => {
						e.edit(edit => {
							var newReportContent = strip.stripAllButOneFile(reportText, classFilename);
							edit.insert(new vscode.Position(0, 0), JSON.stringify(newReportContent, null, 2));
						});
					});
				});
			});
		});
	});
}