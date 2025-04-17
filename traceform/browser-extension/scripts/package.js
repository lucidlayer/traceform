const fs = require('fs-extra');
const path = require('path');
const archiver = require('archiver');
const { execSync } = require('child_process');

const packageJsonPath = path.join(__dirname, '..', 'package.json');
const distPath = path.join(__dirname, '..', 'dist');
const zipDir = path.join(__dirname, '..', 'zip');
const zipNameTemplate = 'traceform-browser-extension-v{version}.zip';

async function main() {
  try {
    // 1. Read current version and bump patch version
    console.log('Reading package.json...');
    const packageJson = await fs.readJson(packageJsonPath);
    const currentVersion = packageJson.version;
    const versionParts = currentVersion.split('.');
    versionParts[2] = parseInt(versionParts[2], 10) + 1; // Increment patch
    const newVersion = versionParts.join('.');
    console.log(`Current version: ${currentVersion}, New version: ${newVersion}`);

    // 2. Run the build script
    console.log('Running build script (npm run build)...');
    execSync('npm run build', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
    console.log('Build completed.');

    // 3. Ensure zip directory exists
    await fs.ensureDir(zipDir);

    // 4. Create the zip file
    const zipName = zipNameTemplate.replace('{version}', newVersion);
    const zipPath = path.join(zipDir, zipName);
    console.log(`Creating zip file: ${zipPath}`);

    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', {
      zlib: { level: 9 } // Sets the compression level.
    });

    // Listen for all archive data to be written
    // 'close' event is fired only when a file descriptor is involved
    output.on('close', () => {
      console.log(`Zip file created successfully: ${archive.pointer()} total bytes`);
    });

    // This event is fired when the data source is drained no matter what was the data source.
    // It is not part of this library but rather from the NodeJS Stream API.
    // @see https://nodejs.org/api/stream.html#stream_event_end
    output.on('end', () => {
      console.log('Data has been drained');
    });

    // Good practice to catch warnings (ie stat failures and other non-blocking errors)
    archive.on('warning', (err) => {
      if (err.code === 'ENOENT') {
        console.warn('Archiver warning (ENOENT):', err);
      } else {
        throw err;
      }
    });

    // Good practice to catch this error explicitly
    archive.on('error', (err) => {
      throw err;
    });

    // Pipe archive data to the file
    archive.pipe(output);

    // Add all files from the 'dist' directory
    archive.directory(distPath, false);

    // Finalize the archive (ie we are done appending files but streams have to finish yet)
    // 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand
    await archive.finalize();

    // 5. Update package.json with the new version
    console.log('Updating package.json version...');
    packageJson.version = newVersion;
    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
    console.log('package.json updated.');

    console.log(`\nPackaging complete for version ${newVersion}!`);
    console.log(`Zip file located at: ${zipPath}`);

  } catch (error) {
    console.error('Packaging failed:', error);
    process.exit(1);
  }
}

main();
