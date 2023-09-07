import * as assert from 'assert';
// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as sinon from "sinon";
import { main } from '../../extension';
import GptHandler from '../../gptHandler';

suite('Extension Test Suite', () => {
	test('should handle user input and API response', async () => {
		let gpt = new GptHandler('');
		const doc = await vscode.workspace.openTextDocument({ content: 'h' });
		const editor = await vscode.window.showTextDocument(doc);
		console.log(editor.selection.active);
		// Show the document in a TextEditor
		let gptStub = sinon.stub(gpt, 'callGpt').resolves('{"regex": "test", "explanation": "Test explanation"}');
		const showInputBoxStub = sinon.stub(vscode.window, 'showInputBox').resolves('User input');

		await main(gpt, editor);

		sinon.assert.calledOnce(showInputBoxStub);
		sinon.assert.calledOnce(gptStub);
		assert.equal("test", doc.getText());
		showInputBoxStub.restore();
		gptStub.restore();
	  });
});
