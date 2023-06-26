import { decode, encode } from 'html-entities';
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

            vscode.commands.registerCommand('codesuite.transformToPascalcase', async () => {
                const text = getSelectionText();
                if (!text) {
                    showInfoMessageWithTimeout('Text is not exist');
                    return;
                }
                const result = transformToPascalcase(text);
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
                const result = transformToJavaCase(text, '    private String ');
                printEditorReplace(result);
            }),

            vscode.commands.registerCommand('codesuite.transformToJavaCaseSmart', async () => {
                const text = getSelectionText();
                if (!text) {
                    showInfoMessageWithTimeout('Text is not exist');
                    return;
                }
                const result = transformToJavaCase(text, '    private String ');
                printEditorReplace(result);
            }),

            vscode.commands.registerCommand('codesuite.transformToInsertCase', async () => {
                const text = getSelectionText();
                if (!text) {
                    showInfoMessageWithTimeout('Text is not exist');
                    return;
                }
                const result = transformToInsertCase(text);
                printEditorReplace(result);
            }),

            vscode.commands.registerCommand('codesuite.transformToEncodeHTML', async () => {
                const text = getSelectionText();
                if (!text) {
                    showInfoMessageWithTimeout('Text is not exist');
                    return;
                }
                const result = encode(text);
                printEditorReplace(result);
            }),

            vscode.commands.registerCommand('codesuite.transformToDecodeHTML', async () => {
                const text = getSelectionText();
                if (!text) {
                    showInfoMessageWithTimeout('Text is not exist');
                    return;
                }
                const result = decode(text);
                printEditorReplace(result);
            }),

        );
    }

}

export function transformToInsertCase(text: string, pos: number = 8, appendLine: boolean = true): string {
    const lines = text.trim().replace('\r', '').split('\n');
    const prefix = ' '.repeat(pos);
    const result1 = lines.filter(line => line.trim() !== '').map(line => prefix + transformToSnakecase(line, true));
    const result2 = lines.filter(line => line.trim() !== '').map(line => prefix + `#\{${transformToCamelcase(line)}\}`);
    const delim = appendLine ? ', \n' : ',';
    const result = `
    (\n${result1.join(delim)}
    )
    VALUES
    (\n${result2.join(delim)}
    )`;
    return result;
}

export function transformToCamelcase(text: string): string {
    const lines = text.trim().replace('\r', '').split('\n');
    const result = lines.filter(line => line !== '').map(line => _.camelCase(line));
    return result.join('\n');
}

export function transformToPascalcase(text: string): string {
    const lines = text.trim().replace('\r', '').split('\n');
    const result = lines.filter(line => line !== '').map(line => _.upperFirst(_.camelCase(line)));
    return result.join('\n');
}

export function transformToSnakecase(text: string, upper: boolean = false): string {
    const lines = text.trim().replace('\r', '').split('\n');
    const result = lines.map(line => upper ? _.snakeCase(line).toUpperCase() : _.snakeCase(line).toLowerCase());
    return result.join('\n');
}

export function transformToJavaCase(text: string, prefix: string, suffix: string = ';\n'): string {
    const lines = text.trim().replace('\r', '').split('\n');
    const result = lines.filter(line => line !== '').map(line => {
        const convertedLine = prefix + _.camelCase(line) + suffix;
        return convertedLine;
    });
    return result.join('\n');
}

export function transformToJavaCaseSmart(text: string, prefix: string, suffix: string = ';\n'): string {
    const lines = text.trim().replace('\r', '').split('\n');
    const result = lines.filter(line => line !== '').map(line => {
        const convertedLine = prefix + line.replace(/(_+)([a-zA-Z0-9])/g, (_, underscores, char) => char.toUpperCase()) + suffix;
        return convertedLine;
    });
    return result.join('\n');
}
