// Copyright: (c) 2023, Nectarios Ouzounidis
// GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)

import * as assert from 'assert';
import * as vscode from 'vscode';
import * as sinon from "sinon";
import { main } from '../../extension';
import GptHandler from '../../gptHandler';
import { beforeEach, it } from 'mocha';

suite('main unit tests', () => {
	let gpt: GptHandler;
	let doc: vscode.TextDocument;
	let editor: vscode.TextEditor;

	beforeEach(async () => {
		gpt = new GptHandler('');
		doc = await vscode.workspace.openTextDocument({ content: '' });
		editor = await vscode.window.showTextDocument(doc, undefined, true);
	});

	it('main test succesful request', async () => {

		const showInfoMessage = sinon.spy(vscode.window, 'showInformationMessage');
		const gptStub = sinon.stub(gpt, 'callGpt').resolves('{"regex": "test", "explanation": "Test explanation"}');
		await main(gpt, editor, "test");

		sinon.assert.calledOnce(gptStub);
		assert.equal("test", doc.getText());
		assert(showInfoMessage.calledOnce);
		showInfoMessage.restore();
		gptStub.restore();
	  });

	it('main test error', async () => {
		const showErrorMessageSpy = sinon.spy(vscode.window, 'showErrorMessage');
		const gptStub = sinon.stub(gpt, 'callGpt').throws('Error making reqeust');

		await main(gpt, editor, "test");

		sinon.assert.calledOnce(gptStub);
		assert.equal("", doc.getText());
		assert(showErrorMessageSpy.calledOnce);
		showErrorMessageSpy.restore();
		gptStub.restore();
	});
});
