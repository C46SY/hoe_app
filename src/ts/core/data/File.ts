import { BaseDirectory, create, mkdir, remove, readTextFile, writeTextFile, exists } from '@tauri-apps/plugin-fs';

export class File {
    private static baseDir = BaseDirectory.Resource;

    /**
     * 创建文件夹
     * @param path 文件夹路径
     * @param recursive 是否递归创建父目录
     */
    static async createFolder(path: string, recursive: boolean = true): Promise<void> {
        await mkdir(path, {
            baseDir: this.baseDir,
            recursive: recursive
        });
    }

    /**
     * 删除文件夹
     * @param path 文件夹路径
     * @param recursive 是否递归删除
     */
    static async deleteFolder(path: string, recursive: boolean = true): Promise<void> {
        await remove(path, {
            baseDir: this.baseDir,
            recursive: recursive
        });
    }

    /**
     * 判断文件夹是否存在
     * @param path 文件夹路径
     */
    static async folderExists(path: string): Promise<boolean> {
        return await exists(path, {
            baseDir: this.baseDir
        });
    }

    /**
     * 判断文件是否存在
     * @param path 文件路径
     */
    static async fileExists(path: string): Promise<boolean> {
        return await exists(path, {
            baseDir: this.baseDir
        });
    }

    /**
     * 创建文件
     * @param path 文件路径
     */
    static async createFile(path: string): Promise<void> {
        await create(path, {
            baseDir: this.baseDir
        });
    }

    /**
     * 写入文件
     * @param path 文件路径
     * @param content 文件内容
     */
    static async writeFile(path: string, content: string): Promise<void> {
        await writeTextFile(path, content, {
            baseDir: this.baseDir
        });
    }

    /**
     * 读取文件
     * @param path 文件路径
     */
    static async readFile(path: string): Promise<string> {
        return await readTextFile(path, {
            baseDir: this.baseDir
        });
    }

    /**
     * 删除文件
     * @param path 文件路径
     */
    static async deleteFile(path: string): Promise<void> {
        await remove(path, {
            baseDir: this.baseDir,
            recursive: false
        });
    }
}

