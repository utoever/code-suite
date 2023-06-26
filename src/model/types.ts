import * as vscode from 'vscode';

export interface TransformModel {

    label: string
    cmd: string
    description: string
    detail: string

}

export function getTransformModel() {
    const models: TransformModel[] = [
        {
            label: 'CamelCase',
            // cmd: 'editor.action.transformToCamelcase',
            cmd: 'codesuite.transformToCamelcase',
            description: '',
            detail: ''
        },
        {
            label: 'Pascalcase',
            cmd: 'codesuite.transformToPascalcase',
            description: 'transformToPascalcase',
            detail: ''
        },
        {
            label: 'Snakecase',
            cmd: 'codesuite.transformToSnakecase',
            description: 'transformToSnakecase',
            detail: ''
        },
        {
            label: 'JavaCase',
            cmd: 'codesuite.transformToJavaCase',
            description: 'transformToJavaCase',
            detail: 'Java'
        },
    ];
    return models;
}

export interface TransformModelQuickPick<T> extends vscode.QuickPickItem {
    cmd: T
}
