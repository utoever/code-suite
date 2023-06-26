import _ from 'lodash';
import * as vscode from 'vscode';
import { showInfoMessageWithTimeout } from '../ui/ui';

import { getSelectionText, printEditorReplace } from '../utils/editor';

export class CodeCase {

    constructor(protected context: vscode.ExtensionContext) {
        context.subscriptions.push(
            vscode.commands.registerCommand('codesuite.transformToCamelcase', async () => {
                const text = getSelectionText();
                if (!text) {
                    showInfoMessageWithTimeout('Text is not exist');
                    return;
                }
                const result = transformToCamelcase(text);
                printEditorReplace(result);
            }),

            vscode.commands.registerCommand('codesuite.transformToSnakecase', async () => {
                const text = getSelectionText();
                if (!text) {
                    showInfoMessageWithTimeout('Text is not exist');
                    return;
                }
                const result = transformToSnakecase(text);
                printEditorReplace(result);
            }),

            vscode.commands.registerCommand('codesuite.transformToJavaCase', async () => {
                const text = getSelectionText();
                if (!text) {
                    showInfoMessageWithTimeout('Text is not exist');
                    return;
                }
                const result = transformToJavaCase(text.split('\n'), '    private String ');
                printEditorReplace(result);
            }),

            vscode.commands.registerCommand('codesuite.transformToJavaCase2', async () => {
                const text = getSelectionText();
                if (!text) {
                    showInfoMessageWithTimeout('Text is not exist');
                    return;
                }
                const result = transformToJavaCase(text.split('\n'), '    private String ');
                printEditorReplace(result);
            }),
        );
    }

}

export function transformToCamelcase(text: string): string {
    const lines = text.trim().replace('\r', '').split('\n');
    const convertedLines = lines.map(line => _.camelCase(line));
    return convertedLines.filter(line => line !== '').join('\n');
}

export function transformToSnakecase(text: string): string {
    const lines = text.trim().replace('\r', '').split('\n');
    const convertedLines = lines.map(line => _.snakeCase(line));
    return convertedLines.filter(line => line !== '').join('\n');
}

export function transformToPascalcase(text: string): string {
    return _.capitalize(_.camelCase(text));
}

export function transformToJavaCase(lines: string[], prefix: string, suffix: string = ';\n'): string {
    const convertedLines = lines.map(line => {
        const convertedLine = prefix + line.replace(/(_+)([a-zA-Z0-9])/g, (_, underscores, char) => char.toUpperCase()) + suffix;
        return convertedLine;
    });
    return convertedLines.filter(line => line !== '').join('\n');
}

export function transformToJavaCaseSmart(text: string, prefix: string, suffix: string = ';\n'): string {
    const lines = text.trim().replace('\r', '').split('\n');
    const convertedLines = lines.filter(line => line !== '').map(line => {
        const convertedLine = prefix + line.replace(/(_+)([a-zA-Z0-9])/g, (_, underscores, char) => char.toUpperCase()) + suffix;
        return convertedLine;
    });
    return convertedLines.filter(line => line !== '').join('\n');
}
