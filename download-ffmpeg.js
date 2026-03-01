// FFmpegファイルをローカルにダウンロードするセットアップスクリプト
const https = require('https');
const fs = require('fs');
const path = require('path');

const files = [
  {
    url: 'https://unpkg.com/@ffmpeg/ffmpeg@0.11.6/dist/ffmpeg.min.js',
    dest: 'public/ffmpeg/ffmpeg.min.js'
  },
  {
    url: 'https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js',
    dest: 'public/ffmpeg/ffmpeg-core.js'
  },
  {
    url: 'https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.wasm',
    dest: 'public/ffmpeg/ffmpeg-core.wasm'
  },
  {
    url: 'https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.worker.js',
    dest: 'public/ffmpeg/ffmpeg-core.worker.js'
  }
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const get = (u) => {
      https.get(u, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          return get(res.headers.location);
        }
        res.pipe(file);
        file.on('finish', () => { file.close(); console.log('✓ ' + dest); resolve(); });
      }).on('error', reject);
    };
    get(url);
  });
}

(async () => {
  for (const f of files) {
    fs.mkdirSync(path.dirname(f.dest), { recursive: true });
    await download(f.url, f.dest);
  }
  console.log('\n完了！node server.js で起動してください。');
})();
