import fs from 'node:fs/promises';

export const checkFile = async (path, createIfMissing) => {
  if (createIfMissing) {
    try {
      await fs.access(path);
    } catch (error) {
      await fs.writeFile(path, JSON.stringify([]));
      console.log(`File ${path} was created!`)
      return true;
    }
  }

  try {
    await fs.access(path);
  } catch (error) {
    console.error(`File ${path} not found!`)
    return false;
  }

  return true;
};