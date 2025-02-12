// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import ollama from 'ollama';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "pakfro-ext" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('pakfro-ext.helloWorld', () => {

		// The code you place here will be executed every time your command is executed

		// create a panel to talk to locally running LLM
		const panel = vscode.window.createWebviewPanel(
			'aiChat',
			'AI Chat',
			vscode.ViewColumn.One,
			{enableScripts: true}
		);

		panel.webview.html = getWebviewContent();
		panel.webview.onDidReceiveMessage(async (message: any) => {
			if (message.command === 'chat') {
				const userPrompt = message.text;
				let responseText = '';
				
				try {
					const streamResponse = await ollama.chat({
						model: 'dolphin-mistral:7b-v2-q8_0',
						messages: [{ role: 'user', content: userPrompt }],
						stream:true
					});

					for await (const part of streamResponse) {
						responseText+= part.message.content;
						panel.webview.postMessage({ command: 'chatResponse', text: responseText});
					}
				} catch (err) {

				}
			}
		});

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from pakfro-ext!');
	});

	context.subscriptions.push(disposable);
}

function getWebviewContent(): string {
	return /*html*/ `
	`;
}

// This method is called when your extension is deactivated
export function deactivate() {}
