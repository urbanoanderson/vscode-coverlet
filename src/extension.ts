'use strict';

import * as vscode from 'vscode';
import * as strip from './stripReport';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('extension.coverletStrip', function () {

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

			var processedReport = strip.stripReport(document.getText())

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
	});

	context.subscriptions.push(disposable);
}