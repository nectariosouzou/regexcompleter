// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import axios from 'axios';
import OpenAI from 'openai';
import { rejects } from 'assert';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "regexcompleter" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerTextEditorCommand('regexcompleter.helloWorld', async (editor, edit) => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		const userResponse = await vscode.window.showInputBox({
  			placeHolder: 'Type in an explanation for a regex extension...'
		});
		if (userResponse) {
			try {
				let gptResponse = await callChatGPT("Return json object, nothing else, with field regex, and explanation. One just being the described regex as a string and the other being an explanation of how the regex works."+userResponse);
				const jsonReply = JSON.parse(gptResponse);
				editor.edit(editBuilder => {
					editBuilder.insert(editor.selection.active, jsonReply['regex']);
				});
				vscode.window.showInformationMessage(jsonReply['explanation']);
			}
			catch(error) {
				console.error("Error calling ChatGPT:", error);
			}
		}
		else {
			console.log("HFHFHFHFHD");
		}
	});

	context.subscriptions.push(disposable);
}

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const OPENAI_API_KEY = "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"; // Make sure to replace this with your actual API key

async function callChatGPT(message: string): Promise<string> {

	const openai = new OpenAI({
		apiKey: OPENAI_API_KEY,
	});
	try {
		const chatCompletion = await openai.chat.completions.create({
			messages: [{ role: "user", content: message }],
			model: "gpt-3.5-turbo",
		});
		const reply = chatCompletion.choices[0].message.content;
		if (reply) {
			return reply;
		}
	}
	catch (error) {
		throw new Error("PPOOOOOP");
	}
	throw new Error("PPOOOOOP");
}

// This method is called when your extension is deactivated
export function deactivate() {}
