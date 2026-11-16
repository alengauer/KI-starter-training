import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createFileMailer, type Mail } from './mailer.ts';

const MAIL: Mail = { to: 'max@example.de', subject: 'Betreff', text: 'Hallo Max,\nText' };

describe('F06 Datei-Postfach', () => {
  let dir: string;

  beforeEach(async () => {
    dir = await mkdtemp(join(tmpdir(), 'sneakerstudio-mailer-'));
  });

  afterEach(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it('legt die Mail als JSON-Datei im Postfach ab und legt das Verzeichnis bei Bedarf an', async () => {
    const outbox = join(dir, 'outbox');
    await createFileMailer(outbox, vi.fn()).send(MAIL);

    const files = await readdir(outbox);
    expect(files).toHaveLength(1);
    expect(JSON.parse(await readFile(join(outbox, files[0] ?? ''), 'utf8'))).toEqual(MAIL);
  });

  it('legt jede Mail in einer eigenen Datei ab', async () => {
    const mailer = createFileMailer(dir, vi.fn());
    await mailer.send(MAIL);
    await mailer.send({ ...MAIL, to: 'erika@example.de' });

    expect(await readdir(dir)).toHaveLength(2);
  });

  it('gibt die Mail in der Konsole aus', async () => {
    const log = vi.fn();
    await createFileMailer(dir, log).send(MAIL);

    expect(log).toHaveBeenCalledWith(expect.stringContaining('max@example.de'));
    expect(log).toHaveBeenCalledWith(expect.stringContaining('Hallo Max,\nText'));
  });
});
