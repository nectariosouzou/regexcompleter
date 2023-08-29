/* eslint-disable @typescript-eslint/naming-convention */
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import fetch from 'node-fetch';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
const ENDPOINT_URL = "https://igojsbdn5pdx522mcv3azjr3pa0juixs.lambda-url.us-east-1.on.aws";

export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "regexcompleter" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerTextEditorCommand('regexcompleter.helloWorld', async (editor, edit) => {
		const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
		statusBarItem.text = "$(sync~spin) API Call In Progress";
		const userResponse = await vscode.window.showInputBox({
			placeHolder: 'Type in an explanation for a regex extension...'
		});
	
		 // Hide the spinning wheel
	
		if (userResponse) {
			statusBarItem.show();
			try {
				const gptResponse = await callChatGPT(userResponse);
	
				editor.edit(editBuilder => {
					editBuilder.insert(editor.selection.active, gptResponse['regex']);
				});
	
				vscode.window.showInformationMessage(gptResponse['explanation']);
				statusBarItem.hide();
			} catch (error) {
				vscode.window.showErrorMessage("Error with request");
				statusBarItem.hide();
			}
		} else {
			vscode.window.showErrorMessage("Error with request");
			statusBarItem.hide();
		}
	});
	

	context.subscriptions.push(disposable);
}

async function callChatGPT(userPrompt: string) {
	const bodyData = {
        prompt: userPrompt
    };

    try {
        const response = await fetch(ENDPOINT_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(bodyData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.json();
		return responseData;
    } catch (error) {
		throw new Error(`There was a problem with the fetch operation: ${error}`);
    }
}

// This method is called when your extension is deactivated
export function deactivate() {}
