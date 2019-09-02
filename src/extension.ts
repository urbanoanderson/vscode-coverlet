'use strict';

import * as vscode from 'vscode';

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

			// Get initial report
			let report
			try {
				report = JSON.parse(document.getText());
			} catch (e) {
				vscode.window.showErrorMessage("Error: selected file is not a valid json")
				return
			}

			var linesElem = "Lines"
			var branchesElem = "Branches"

			for(var dll in report) {
				for(var srcFile in report[dll]) {
					var removeSrcFile = true

					for(var className in report[dll][srcFile]) {
						var classElem = report[dll][srcFile][className]
						var removeClass = true

						for(var classMethod in classElem) {
							var methodElem = report[dll][srcFile][className][classMethod]
							var removeMethod = true
							var removeLinesElem = true
							var removeBranchesElem = true

							for(var linenumber in methodElem[linesElem]){
								if(methodElem[linesElem][linenumber] == 0) {
									removeLinesElem = false
									removeMethod = false
									removeClass = false
									removeSrcFile = false
								}
								else {
									delete methodElem[linesElem][linenumber]
								}
							}

							for (let i = 0; i < methodElem[branchesElem].length; i++) {
								if(methodElem[branchesElem][i]["Hits"] == 0)	{
									removeBranchesElem = false
									removeMethod = false
									removeClass = false
									removeSrcFile = false
								}
								else {
									delete methodElem[branchesElem][i]
								}
							}

							if(removeLinesElem){
								delete methodElem[linesElem]
							}

							if(removeBranchesElem){
								delete methodElem[branchesElem]
							}
							else {
								methodElem[branchesElem] = methodElem[branchesElem].filter(function (el: any) {
									return el != null;
								});
							}

							if(removeMethod){
								delete report[dll][srcFile][className][classMethod]
							}
						}

						if(removeClass){
							delete report[dll][srcFile][className]
						}
					}

					if(removeSrcFile){
						delete report[dll][srcFile]
					}
				}
			}

			let processedReport = JSON.stringify(report, null, 2)

			// Replace document by the processed text
			editor.edit(editBuilder => {
				editBuilder.replace(textRange, processedReport);
			});
		}
	});

	context.subscriptions.push(disposable);
}