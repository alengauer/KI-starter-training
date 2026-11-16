// Mailversand (F06): Adapter-Interface und Implementierung „Datei-Postfach“.
// Jede Mail wird als JSON-Datei im Postfach-Verzeichnis abgelegt und in der Konsole ausgegeben.

import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

export type Mail = { to: string; subject: string; text: string };

export interface Mailer {
  send(mail: Mail): Promise<void>;
}

export function createFileMailer(outboxDir: string, log: (message: string) => void = console.log): Mailer {
  return {
    async send(mail) {
      await mkdir(outboxDir, { recursive: true });
      await writeFile(join(outboxDir, `${Date.now()}-${randomUUID()}.json`), JSON.stringify(mail, null, 2));
      log(`E-Mail an ${mail.to} – ${mail.subject}\n${mail.text}`);
    },
  };
}
