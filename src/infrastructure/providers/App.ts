import dotenv from 'dotenv';
import path from 'path';

import FastifyApp from './FastifyApp';
import Database from './Database';

class App {
  public clearConsole (): void {
    process.stdout.write('\x1B[2J\x1B[0f');
  }

  public async loadDatabase(): Promise<void> {
    console.log('Database :: Booting @ Master...');
    await Database.init();
  }

	public loadConfiguration (): void {
    console.log('Configuration :: Booting @ Master...');
		dotenv.config({ path: path.join(__dirname, '../../.env') });
	}

  public loadServer (): void {
    console.log('Server :: Booting @ Master...');
    FastifyApp.init();
  }

}

export default new App;