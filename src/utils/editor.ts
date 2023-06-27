import * as vscode from 'vscode';

export function getSelectionText() {
    const editor = vscode.window.activeTextEditor;
    let content: string = '';
    if (editor) {
        const selection: vscode.Selection = editor.selection;
        if (selection.isEmpty) {
            content = editor.document.getText();
        } else {
            content = editor.document.getText(selection);
        }
        // } else {
        //     vscode.window.showErrorMessage('Editor is not open');
    }
    return content;
}

export function getEditorFilePath() {
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor) {
        const document = activeEditor.document;
        // const filePath = document.uri.fsPath;
        // console.log('File Path:', filePath);
        return document.fileName;
    }
    return '';
}

export async function printEditor(output: string) {
    if (!output) {
        return;
    }
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        const currentPosition = editor.selection.start;
        editor.edit((editBuilder) => {
            editBuilder.insert(currentPosition, output);
        });
    } else {
        vscode.window.showErrorMessage("There is not editor");
    }
}

export async function printEditorReplace(output: string) {
    if (!output) {
        return;
    }

    const editor = vscode.window.activeTextEditor;
    if (editor) {
        const start = editor.selection.start;
        const end = editor.selection.end;
        if (start.compareTo(end) === 0) {
            const startPos = new vscode.Position(0, 0); // Assuming line 0, column 0
            const endPos = editor.document.lineAt(editor.document.lineCount - 1).range.end;
            const selectionRange = new vscode.Range(startPos, endPos);

            editor.selection = new vscode.Selection(selectionRange.start, selectionRange.end);
            editor.edit((editBuilder) => {
                editBuilder.replace(editor.selection, output);
            });
        } else {
            editor.edit((editBuilder) => {
                editBuilder.replace(start, output);
            });
        }
    } else {
        vscode.window.showErrorMessage("There is not editor");
    }
}

export function showTextDocument(uri: vscode.Uri, option?: vscode.TextDocumentShowOptions) {
    return vscode.window.showTextDocument(uri, option);
}
