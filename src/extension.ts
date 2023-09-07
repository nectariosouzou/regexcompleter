/* eslint-disable @typescript-eslint/naming-convention */
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import fetch, { RequestInit } from 'node-fetch';

const ENDPOINT_URL = "https://igojsbdn5pdx522mcv3azjr3pa0juixs.lambda-url.us-east-1.on.aws";
const TIMEOUT = 10000;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "regexforge" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerTextEditorCommand('regexforge.create', async (editor, edit) => {
		const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
		statusBarItem.text = "$(sync~spin) API Call In Progress";
		const userResponse = await vscode.window.showInputBox({
			placeHolder: 'Type in an explanation for a regex expression...'
		});
		if (userResponse) {
			statusBarItem.show();
			callChatGPT(userResponse).then((response) => {
				const gptMap = JSON.parse(response);
				editor.edit(editBuilder => {
					editBuilder.insert(editor.selection.active, gptMap['regex']);
				});
				vscode.window.showInformationMessage(gptMap['explanation']);
				statusBarItem.hide();
			}).catch((error) => {
				vscode.window.showErrorMessage("Error with request");
				statusBarItem.hide();
			});
		}
	});
	context.subscriptions.push(disposable);
}

async function callChatGPT(userPrompt: string): Promise<string> {
    const bodyData = {
        prompt: userPrompt
    };
    const bodyJson = JSON.stringify(bodyData);

    const options: RequestInit = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': bodyJson.length.toString()
        },
        body: bodyJson
    };

    try {
        const response = await Promise.race([fetch(ENDPOINT_URL, options), createTimeoutPromise()]);
        if (!response.ok) {
            throw new Error(`HTTP request failed with status: ${response.status}`);
        }
        const responseData = await response.text();
        return responseData;
    } catch (error) {
        throw error;
    }
}

function createTimeoutPromise(): Promise<never> {
    return new Promise<never>((_, reject) => {
        setTimeout(() => {
            reject(new Error('Request timed out'));
        }, TIMEOUT);
    });
}
// This method is called when your extension is deactivated
export function deactivate() {}


