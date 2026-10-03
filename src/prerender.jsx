import { renderToString } from 'react-dom/server';
import { readFileSync, writeFileSync, cpSync, mkdirSync } from 'node:fs';
import App from './App';

const template = readFileSync('dist/index.html', 'utf8');
const html = renderToString(<App/>);
writeFileSync('dist/index.html', template.replace('<!--app-html-->', html));
mkdirSync('dist/api', { recursive: true });
cpSync('server/enquiry.php', 'dist/api/enquiry.php');
cpSync('server/index.php', 'dist/index.php');
cpSync('server/.htaccess', 'dist/.htaccess');
cpSync('server/.user.ini', 'dist/.user.ini');
console.log('Prerendered React landing page and copied PHP entry points.');
