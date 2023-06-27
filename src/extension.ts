import * as vscode from 'vscode';
import { TransformModelQuickPick, getTransformModel, getTransformModel2 } from './model/types';
import { CodeCase } from './svc/case';
import { lookupMethods, lookupPosition as lookupSelection } from './svc/symbol';

export function activate(context: vscode.ExtensionContext) {

	const codeCase = new CodeCase(context);

	context.subscriptions.push(
		vscode.commands.registerCommand('codesuite.transformTo', async () => {
			const items: TransformModelQuickPick<string>[] = getTransformModel().map((model) => ({ ...model }));

			await vscode.window.showQuickPick(items, {
				placeHolder: vscode.l10n.t("Select to run command")
			}).then(async (selectedItem) => {
				if (selectedItem) {
					vscode.commands.executeCommand(selectedItem.cmd);
				}
			});
		}),

		vscode.commands.registerCommand('codesuite.transformTo2', async () => {
			const items: TransformModelQuickPick<string>[] = getTransformModel2().map((model) => ({ ...model }));

			await vscode.window.showQuickPick(items, {
				placeHolder: vscode.l10n.t("Select to run command")
			}).then(async (selectedItem) => {
				if (selectedItem) {
					vscode.commands.executeCommand(selectedItem.cmd);
				}
			});
		}),

		vscode.commands.registerCommand('codesuite.lookupSymbols', async () => {
			const items = await lookupMethods();
			if (!items || items.length === 0) {
				return;
			}

			await vscode.window.showQuickPick(items, {
				placeHolder: vscode.l10n.t("Select to run command")
			}).then(async (selectedItem) => {
				if (selectedItem && selectedItem.model) {
					const editor = vscode.window.activeTextEditor;
					editor!.revealRange(selectedItem.model.range!, vscode.TextEditorRevealType.Default);
					const text = editor?.document.getText(selectedItem.model?.range);
					const selection = lookupSelection(selectedItem.model, text!);
					editor!.selection = selection;
				}
			});
		})
	);
}

export function deactivate() {

}
