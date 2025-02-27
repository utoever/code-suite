import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { JavaModel, SymbolModelQuickPick } from '../model/types';
import { searchRgFiles } from './search';

export class Symbol {

    async lookupMethods(filePath: string | undefined,) {
        if (!filePath) {
            const editor = vscode.window.activeTextEditor;
            filePath = editor?.document.fileName;
        }
        if (filePath && fs.existsSync(filePath)) {
            const results = await vscode.commands.executeCommand<[vscode.SymbolInformation, vscode.DocumentSymbol]>(
                'vscode.executeDocumentSymbolProvider',
                vscode.Uri.file(filePath)
            );
            return results;
        }
        return [];
    }

    async lookupMethod1(filePath: string) {
        if (fs.existsSync(filePath)) {
            const results = await vscode.commands.executeCommand<[vscode.SymbolInformation, vscode.DocumentSymbol]>(
                'vscode.executeDocumentSymbolProvider',
                vscode.Uri.file(filePath)
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
                    await vscode.window.showTextDocument(vscode.Uri.file(filePath), { selection: range });
                }
            }
            if (!exist) {
                openTextDocument(filePath);
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

export function makeSymbol(symbol: vscode.DocumentSymbol | vscode.SymbolInformation, className?: string | undefined, filePath?: string | undefined) {
    return {
        kind: symbol.kind,
        name: symbol.name,
        className: className,
        location: 'location' in symbol ? symbol.location : undefined,
        range: 'range' in symbol ? symbol.range : undefined,
        filePath: filePath
    };
}


export async function lookupMethods(filePath?: string | undefined, subJavaName?: string) {
    const subclass = subJavaName && subJavaName.endsWith('.java') ? subJavaName.substring(0, subJavaName.length - 5) : subJavaName;
    const symbols: SymbolModelQuickPick<JavaModel>[] = [];
    try {
        if (!filePath) {
            const editor = vscode.window.activeTextEditor;
            filePath = editor?.document.fileName;
        }
        if (filePath && fs.existsSync(filePath)) {
            const results: (vscode.DocumentSymbol | vscode.SymbolInformation)[] = await vscode.commands.executeCommand<[]>(
                'vscode.executeDocumentSymbolProvider',
                vscode.Uri.file(filePath)
            );
            if (results) {
                const model: SymbolModelQuickPick<JavaModel> = {
                    label: `$(symbol-namespace) ` + results[0].name,
                    description: subclass ?? '',
                    model: makeSymbol(results[0], subclass, filePath)
                };
                symbols.push(model);

                if (results[1] && (results[1].kind === vscode.SymbolKind.Class || results[1].kind === vscode.SymbolKind.Interface)) {
                    const model: SymbolModelQuickPick<JavaModel> = {
                        label: `$(symbol-class) ` + results[1].name,
                        description: results[1].name,
                        detail: subclass ?? '',
                        model: makeSymbol(results[1], subclass, filePath)
                    };
                    symbols.push(model);
                }

                if ('children' in results[1]) {
                    (results[1] as vscode.DocumentSymbol).children.forEach((document: any) => {
                        let className: string | undefined;
                        if (document.kind === vscode.SymbolKind.Field) {
                            if (subclass) {
                                className = subclass;
                            } else {
                                const editor = vscode.window.activeTextEditor;
                                const text = editor?.document.getText(document.range);
                                className = lookupClassName(document.name, text!);
                            }
                        }
                        const model: SymbolModelQuickPick<JavaModel> = {
                            label: document.kind === vscode.SymbolKind.Field ? `$(symbol-field) ` + document.name : `$(symbol-method) ` + document.name,
                            description: document.name,
                            detail: subclass ?? '',
                            model: makeSymbol(document, className, filePath)
                        };
                        symbols.push(model);
                    });
                }

                if (!subclass) {
                    const javaFileModels = symbols.filter(symbol => symbol.model?.kind === vscode.SymbolKind.Field)
                        .map(async (model) => {
                            return await searchRgFiles(model.model?.className + '.java');
                        })[0];

                    symbols.push({
                        label: '',
                        kind: vscode.QuickPickItemKind.Separator
                    });
                    if (javaFileModels) {
                        const models = await javaFileModels;
                        for (let javaFileModel of models) {
                            const subSymbols = await lookupMethods(javaFileModel.filePath.fsPath, javaFileModel.className);
                            symbols.push(...subSymbols);
                        }
                    }
                }
            }
        }
    } catch (error: any) {
        console.log(`Error <${error.message}>`);
    }
    return symbols;
}

export function getLineText(lineFromPos: vscode.Position, lineToPos: vscode.Position) {
    const activeEditor = vscode.window.activeTextEditor;
    const lines: string[] = [];
    if (activeEditor) {
        const document = activeEditor.document;
        const excludes = ['private', 'protected', 'public'];

        let lineFrom = lineFromPos.line;
        const lineTo = lineToPos.line;
        while (lineFrom <= lineTo) {
            if (lineFrom >= 0 && lineFrom < document.lineCount) {
                const line: vscode.TextLine = document.lineAt(lineFrom);
                const lineText = line.text.trim().split(' ');
                console.log(` Line Text <${lineText}>`);

                for (let text of lineText) {
                    const first = text.charAt(0);
                    if (text.startsWith('@') || excludes.includes(text) || first >= 'a' && first <= 'z') {
                        continue;
                    }
                    lines.push(text);
                }
            } else {
                console.log('Invalid line number');
            }
            lineFrom += 1;
        }
    } else {
        console.log('No active editor');
    }
    return lines;
}

export function lookupPosition(model: JavaModel, fullText: string) {
    const delim = '(';
    let searchText: string;
    let shiftPos = 1;
    if (model.name.indexOf(delim) > 0) {
        searchText = model.name.split(delim)[0];
    } else if (model.kind === vscode.SymbolKind.Class) {
        searchText = 'public class ' + model.name;
        shiftPos = 'public class '.length;
    } else {
        searchText = model.name;
    }

    let position: vscode.Position = model.range!.start;
    let selection: vscode.Selection | undefined;
    const lines: string[] = fullText.split('\n');
    for (let i: number = 0; i < lines.length; i++) {
        const pos = lines[i].indexOf(searchText);
        if (pos >= 0) {
            const start = new vscode.Position(position.line + i, model.kind === vscode.SymbolKind.Package ? 0 : pos + shiftPos);
            const end = new vscode.Position(position.line + i, pos + searchText.length + shiftPos);
            selection = new vscode.Selection(start, end);
            break;
        }
    }
    return selection ? selection : new vscode.Selection(position, position);
}

export function lookupClassName(searchText: string, fullText: string) {
    let className: string | undefined;

    const lines: string[] = fullText.split('\n');
    for (let i: number = 0; i < lines.length; i++) {
        const pos = lines[i].indexOf(searchText);
        if (pos >= 0) {
            const classArray: string[] = [];
            lines[i].trim().split(' ').filter(it => {
                const name = it.trim();
                if (name.startsWith('@') || ['private', 'protected', 'public', 'transient', 'volatile', 'static', 'final'].includes(name) || name.startsWith(searchText)) {
                } else {
                    classArray.push(name);
                }
            });

            if (classArray && classArray.length === 1) {
                className = classArray[0];
                break;
            }
        }
    }
    return className;
}