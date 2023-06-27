import * as vscode from 'vscode';
import { JavaModel, SymbolModelQuickPick, TransformModelQuickPick, getTransformModel, getTransformModel2 } from './model/types';
import { CodeCase } from './svc/case';
import { lookupMethods, lookupPosition as lookupSelection } from './svc/symbol';
import { showTextDocument } from './utils/editor';

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
			const editor = vscode.window.activeTextEditor;
			const languageId = editor?.document.languageId;
			if (languageId !== 'java') {
				vscode.commands.executeCommand('workbench.action.gotoSymbol');
				return;
			}

			const items = await lookupMethods();
			if (!items || items.length === 0) {
				return;
			}

			const quickPick = vscode.window.createQuickPick<SymbolModelQuickPick<JavaModel>>();
			quickPick.items = items;

			quickPick.onDidChangeActive((selectedItem) => {
				// quickPick.titleColor = new vscode.ThemeColor('quickInput.foreground');
				if (selectedItem && selectedItem.length > 0 && !selectedItem[0].detail) {
					const item = selectedItem[0].model!;
					editor!.revealRange(item.range!, vscode.TextEditorRevealType.Default);
					editor!.selection = new vscode.Selection(item.range!.start, item.range!.end);
				}
			});
			quickPick.onDidAccept(async () => {
				const selectedItem: readonly SymbolModelQuickPick<JavaModel>[] = quickPick.selectedItems;
				if (selectedItem && selectedItem.length > 0) {
					const item = selectedItem[0].model!;
					if (selectedItem[0].detail) {
						await showTextDocument(vscode.Uri.file(item.filePath!));
					}
					const editor = vscode.window.activeTextEditor;
					editor!.revealRange(item.range!, vscode.TextEditorRevealType.Default);
					const text = editor?.document.getText(item.range);
					const selection = lookupSelection(item, text!);
					editor!.selection = selection;
				}
				quickPick.dispose();
			});
			quickPick.show();

			// await vscode.window.showQuickPick(items, {
			// 	placeHolder: vscode.l10n.t("Select to run command")
			// }).then(async (selectedItem) => {
			// 	if (selectedItem && selectedItem.model) {
			// 		const editor = vscode.window.activeTextEditor;
			// 		editor!.revealRange(selectedItem.model.range!, vscode.TextEditorRevealType.Default);
			// 		const text = editor?.document.getText(selectedItem.model?.range);
			// 		const selection = lookupSelection(selectedItem.model, text!);
			// 		editor!.selection = selection;
			// 	}
			// });
		})
	);
}

export function deactivate() {

}
