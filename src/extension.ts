import * as vscode from 'vscode';
import { TransformModelQuickPick, getTransformModel, getTransformModel2 } from './model/types';
import { CodeCase } from './svc/case';

export function activate(context: vscode.ExtensionContext) {

	const codeCase = new CodeCase(context);

	context.subscriptions.push(
		vscode.commands.registerCommand('codesuite.transformTo', async () => {
			const items: TransformModelQuickPick<string>[] = getTransformModel().map((model) => ({ ...model }));

			await vscode.window.showQuickPick(items, {
				placeHolder: vscode.l10n.t("Select to run commaand")
			}).then(async (selectedItem) => {
				if (selectedItem) {
					vscode.commands.executeCommand(selectedItem.cmd);
				}
			});
		}),

		vscode.commands.registerCommand('codesuite.transformTo2', async () => {
			const items: TransformModelQuickPick<string>[] = getTransformModel2().map((model) => ({ ...model }));

			await vscode.window.showQuickPick(items, {
				placeHolder: vscode.l10n.t("Select to run commaand")
			}).then(async (selectedItem) => {
				if (selectedItem) {
					vscode.commands.executeCommand(selectedItem.cmd);
				}
			});
		})
	);
}

export function deactivate() {

}
