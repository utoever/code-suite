import * as cp from 'child_process';
import * as path from 'path';
import { Uri, workspace } from 'vscode';

export async function searchRgFiles(filename: string) {
    let files: Uri[] = [];
    try {
        const cwds = workspace.workspaceFolders ? workspace.workspaceFolders.map(f => f.uri.fsPath) : [process.cwd()];
        const q = process.platform === 'win32' ? '"' : '\'';
        const rgs = cwds.map(cwd => {
            // const rg = cp.execSync(`rg --files -g ${q}${filename}${q}`, { cwd }, (err, stdout) => {
            //     const i = rgs.indexOf(rg);
            //     if (i !== -1 && !err) {
            //         const procFiles = stdout.trim().split('\n').map(relative => Uri.file(path.join(cwd, relative)));
            //         if (procFiles) {
            //             files.push(...procFiles);
            //         }
            //     }
            // });
            const command = `rg --files -g ${q}${filename}${q}`;
            const options = { cwd };
            const stdout = cp.execSync(command, options).toString();
            if (stdout) {
                const procFiles = stdout.trim().split('\n').map(relative => Uri.file(path.join(cwd, relative)));
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
