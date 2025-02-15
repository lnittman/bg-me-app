const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Use absolute paths
const rootDir = path.resolve(__dirname, '..');
const inputFile = path.join(rootDir, 'public/videos/hero.mp4');
const outputDir = path.join(rootDir, 'public/videos');
const optimizedFile = path.join(outputDir, 'hero-optimized.mp4');
const reversedFile = path.join(outputDir, 'hero-reversed.mp4');
const loopFile = path.join(outputDir, 'hero-loop.mp4');
const concatFile = path.join(__dirname, 'concat.txt');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Get file size in MB
function getFileSize(file) {
  const stats = fs.statSync(file);
  return (stats.size / (1024 * 1024)).toFixed(2);
}

// Execute command as promise with better error handling
function execPromise(command) {
  return new Promise((resolve, reject) => {
    console.log(`Executing command: ${command}`);
    const process = exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${error.message}`);
        console.error(`stderr: ${stderr}`);
        reject(error);
        return;
      }
      if (stderr) {
        console.warn(`Command warnings: ${stderr}`);
      }
      resolve(stdout);
    });

    // Log progress
    process.stderr.on('data', (data) => {
      console.log(data.toString());
    });
  });
}

async function processVideo() {
  try {
    if (!fs.existsSync(inputFile)) {
      throw new Error(`Input file not found: ${inputFile}`);
    }
    
    console.log(`Original video size: ${getFileSize(inputFile)}MB`);
    console.log(`Working directory: ${process.cwd()}`);
    
    // Step 1: Optimize original video
    console.log('Optimizing video...');
    await execPromise(`ffmpeg -i "${inputFile}" -vcodec libx264 -crf 28 "${optimizedFile}"`);
    console.log(`Optimized video size: ${getFileSize(optimizedFile)}MB (${Math.round((1 - getFileSize(optimizedFile)/getFileSize(inputFile)) * 100)}% reduction)`);
    
    // Step 2: Create reversed version
    console.log('Creating reversed version...');
    await execPromise(`ffmpeg -i "${optimizedFile}" -vf reverse -af areverse "${reversedFile}"`);
    
    // Step 3: Create concat file
    console.log('Creating concat file...');
    const concatContent = `file '${optimizedFile.replace(/'/g, "'\\''")}'
file '${reversedFile.replace(/'/g, "'\\''")}'`;
    fs.writeFileSync(concatFile, concatContent);
    
    // Step 4: Create final loop video
    console.log('Creating final loop video...');
    await execPromise(`ffmpeg -f concat -safe 0 -i "${concatFile}" -c copy "${loopFile}"`);
    
    // Clean up temporary files
    console.log('Cleaning up temporary files...');
    if (fs.existsSync(optimizedFile)) fs.unlinkSync(optimizedFile);
    if (fs.existsSync(reversedFile)) fs.unlinkSync(reversedFile);
    if (fs.existsSync(concatFile)) fs.unlinkSync(concatFile);
    
    console.log('Video processing complete!');
    console.log(`Final video size: ${getFileSize(loopFile)}MB`);
  } catch (error) {
    console.error('Error processing video:', error);
    // Clean up any leftover files
    try {
      if (fs.existsSync(optimizedFile)) fs.unlinkSync(optimizedFile);
      if (fs.existsSync(reversedFile)) fs.unlinkSync(reversedFile);
      if (fs.existsSync(concatFile)) fs.unlinkSync(concatFile);
    } catch (cleanupError) {
      console.error('Error during cleanup:', cleanupError);
    }
    process.exit(1);
  }
}

processVideo(); 