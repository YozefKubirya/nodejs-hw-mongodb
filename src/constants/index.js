import * as path from 'node:path';

export const SMTP = {
   SMTP_HOST: 'SMTP_HOST',
   SMTP_PORT: 'SMTP_PORT',
   SMTP_USER: 'SMTP_USER',
   SMTP_PASSWORD: 'SMTP_PASSWORD',
   SMTP_FROM: 'SMTP_FROM',
 };

export const TEMPS_UPLOADS_DIR = path.resolve('temps');

export const UPLOADS_DIR = path.resolve('uploads');

export const SWAGGER_PATH = path.join(process.cwd(), 'docs', 'swagger.json');
