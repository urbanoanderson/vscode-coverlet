'use strict';

import * as vscode from 'vscode';
import * as strip from './strip';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.commands.registerCommand('extension.coverletStrip', coverletStripHandler));
	context.subscriptions.push(vscode.commands.registerCommand('extension.coverletFilecheck', coverletFilecheckHandler));
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

	vscode.workspace.findFiles('*/coverage.json', '**/node_modules/**', 1).then((uris) => {
		console.log(uris[0].path);
		uris.forEach((uri) => {
			vscode.workspace.openTextDocument(uri).then(doc => vscode.window.showTextDocument(doc));
		});
	});
}