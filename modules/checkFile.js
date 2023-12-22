import fs from 'node:fs/promises';

export const checkFileExist = async (path) => {
  try {
    await fs.access(path);
  } catch (error) {
    console.log('An error occurred: ', error);
    console.error(`File ${path} not found!`)
    return false;
  }

  return true;
};

export const createFileIfMissing = async (path) => {
  try {
    await fs.access(path);
  } catch (error) {
    console.log('An error occurred: ', error);
    await fs.writeFile(path, JSON.stringify([]));
    console.log(`File ${path} was created!`)
    return true;
  }
}
