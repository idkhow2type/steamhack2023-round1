import AdmZip from 'adm-zip';

export default async function modifyFilesInZip(
    zipBuffer: Buffer,
    callback: (content: string) => Promise<string> | string
): Promise<AdmZip> {
    const oldZip = new AdmZip(zipBuffer);
    const newZip = new AdmZip();
    const entries = oldZip.getEntries().filter((entry) => !entry.isDirectory);

    const entryPromises = entries.map((entry: AdmZip.IZipEntry) => {
        return new Promise<void>((resolve, reject) => {
            entry.getDataAsync(async (data) => {
                let modifiedData: Buffer;
                try {
                    modifiedData = Buffer.from(await callback(data.toString()));
                } catch (error) {
                    modifiedData = data;
                }
                newZip.addFile(entry.entryName, modifiedData);

                resolve();
            });
        });
    });

    await Promise.all(entryPromises);
    
    return newZip;
}
