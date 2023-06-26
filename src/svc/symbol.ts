import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

export class Symbol {

    async lookupMethod() {
        const javaFile = '';
        if (fs.existsSync(javaFile)) {
            const results = await vscode.commands.executeCommand<[vscode.SymbolInformation, vscode.DocumentSymbol]>(
                'vscode.executeDocumentSymbolProvider',
                vscode.Uri.file(javaFile)
            );

            let exist = false;
            if (results && results.length > 0) {
                for (let el of results[1].children) {
                    const range = new vscode.Range(
                        el.range.start.line,
                        el.range.start.character,
                        el.range.end.line,
                        el.range.end.character
                    );

                    exist = true;
                    await vscode.window.showTextDocument(vscode.Uri.file(javaFile), { selection: range });
                }
            }
            if (!exist) {
                openTextDocument(javaFile);
            }
        } else {
            vscode.window.showErrorMessage('File is not exist');
        }
    }

}

export function openTextDocument(filePath: string) {
    const uri = vscode.Uri.file(filePath);
    vscode.workspace.openTextDocument(uri).then((document) => {
        vscode.window.showTextDocument(document);
    });
}
