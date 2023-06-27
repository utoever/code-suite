import * as cp from 'child_process';
import * as path from 'path';
import { Uri, workspace } from 'vscode';

export async function searchRgFiles(filename: string): Promise<JavaFileModel[]> {
    let files: JavaFileModel[] = [];
    try {
        const cwds = workspace.workspaceFolders ? workspace.workspaceFolders.map(f => f.uri.fsPath) : [process.cwd()];
        const q = process.platform === 'win32' ? '"' : '\'';
        const rgs = cwds.map(cwd => {
            const command = `rg --files -g ${q}${filename}${q}`;
            const options = { cwd };
            const stdout = cp.execSync(command, options).toString();
            if (stdout) {
                const procFiles = stdout.trim().split('\n').map(relative => new JavaFileModel(filename, Uri.file(path.join(cwd, relative))));
                if (procFiles) {
                    files.push(...procFiles);
                }
            }
        });
    } catch (error: any) {
        console.log(`Error <${error.message}>`);
    }
    return files;
}

export class JavaFileModel {

    public get className(): string {
        return this._className;
    }

    public get filePath(): Uri {
        return this._filePath;
    }

    constructor(private readonly _className: string, private readonly _filePath: Uri) { }

}
