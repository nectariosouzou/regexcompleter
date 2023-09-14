// Copyright: (c) 2023, Nectarios Ouzounidis
// GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
/* eslint-disable @typescript-eslint/naming-convention */

import * as vscode from 'vscode';
import GptHandler from './gptHandler';
import GptInterface from "./gptHandler";

const ENDPOINT_URL = "https://igojsbdn5pdx522mcv3azjr3pa0juixs.lambda-url.us-east-1.on.aws";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "regexforge" is now active!');

	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerTextEditorCommand('regexforge.create', async (editor) => {
    let chatGpt = new GptHandler(ENDPOINT_URL);
    const userInput = await vscode.window.showInputBox({
      placeHolder: 'Type in an explanation for a regex expression...'
    });

    if (userInput) {
      main(chatGpt, editor, userInput);
    }
	});
	context.subscriptions.push(disposable);
}

export async function main(chatGpt: GptInterface, editor: vscode.TextEditor, userInput: string){
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.text = "$(sync~spin) API Call In Progress";
    statusBarItem.show();
    try {
      const resp = await getRegexResponse(chatGpt, userInput);
      const edit = new vscode.WorkspaceEdit();
      edit.insert(editor.document.uri, editor.selection.active, resp['regex']);
      await vscode.workspace.applyEdit(edit);
      vscode.window.showInformationMessage(resp['explanation']);
    }
    catch (error) {
      vscode.window.showErrorMessage(`${error}`);
    }
    finally{
      statusBarItem.hide();
      statusBarItem.dispose();
    }
}

async function getRegexResponse(chatGpt: GptInterface, userInput: string): Promise<{ [key: string]: string }> {
    const response = await chatGpt.callGpt(userInput);
    const gptMap = JSON.parse(response);
    if (!('regex' in gptMap) || !('explanation' in gptMap)){
      throw Error("malformed json response");
    }
    return gptMap;
}

// This method is called when your extension is deactivated
export function deactivate() {}


