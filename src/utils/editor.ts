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
        const currentPosition = editor.selection.start;
        editor.edit((editBuilder) => {
            editBuilder.replace(currentPosition, output);
        });
    } else {
        vscode.window.showErrorMessage("There is not editor");
    }
}
