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
            description: 'transformToCamelcase',
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
            label: '$(file-binary) InsertCase',
            cmd: 'codesuite.transformToInsertCase',
            description: 'transformToInsertCase',
            detail: 'SQL'
        },
        {
            label: '$(file-code) JavaCase',
            cmd: 'codesuite.transformToJavaCase',
            description: 'transformToJavaCase',
            detail: 'Java'
        },
        {
            label: '$(file-code) JavaCase_Smart',
            cmd: 'codesuite.transformToJavaCaseSmart',
            description: 'transformToJavaCaseSmart',
            detail: 'Java'
        },
    ];
    return models;
}

export function getTransformModel2() {
    const models: TransformModel[] = [
        {
            label: '$(file-media) EncodeHtml',
            cmd: 'codesuite.transformToEncodeHtml',
            description: 'transformToEncodeHtml',
            detail: 'HTML'
        },
        {
            label: '$(file-media) DecodeHTML',
            cmd: 'codesuite.transformToDecodeHTML',
            description: 'transformToDecodeHTML',
            detail: 'HTML'
        },
    ];
    return models;
}


export interface TransformModelQuickPick<T> extends vscode.QuickPickItem {
    cmd: T
}
