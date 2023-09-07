/* eslint-disable @typescript-eslint/naming-convention */
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import GptHandler from './gptHandler';

const ENDPOINT_URL = "https://igojsbdn5pdx522mcv3azjr3pa0juixs.lambda-url.us-east-1.on.aws";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "regexforge" is now active!');

	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerTextEditorCommand('regexforge.create', async (editor) => {
    main(editor);
	});
	context.subscriptions.push(disposable);
}

async function main(editor: vscode.TextEditor) {
  let chatGpt = new GptHandler(ENDPOINT_URL);
  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBarItem.text = "$(sync~spin) API Call In Progress";

  const userResponse = await vscode.window.showInputBox({
    placeHolder: 'Type in an explanation for a regex expression...'
  });

  if (userResponse) {
    statusBarItem.show();
    try {
      const response = await chatGpt.callGpt(userResponse);
      const gptMap = JSON.parse(response);

      editor.edit(editBuilder => {
          editBuilder.insert(editor.selection.active, gptMap['regex']);
      });
      vscode.window.showInformationMessage(gptMap['explanation']);
    }
    catch (error) {
      vscode.window.showErrorMessage("Error with request");
    }
    finally{
      statusBarItem.hide();
      statusBarItem.dispose();
    }
  }
  if (!userResponse) {
    // User canceled or provided no input, so we exit early\
    statusBarItem.dispose();
    return;
  }
}

// This method is called when your extension is deactivated
export function deactivate() {}


