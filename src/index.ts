import * as os from 'os';
import cluster from 'cluster';

import App from './infrastructure/providers/App';
import NativeEvent from './infrastructure/exceptions/NativeEvent';

(async () => {
	// code goes here
	if (cluster.isMaster) {
		/**
		 * Catches the process events
		 */
		NativeEvent.process();
	
		/**
		 * Clear the console before the app runs
		 */
		App.clearConsole();
	
		/**
		 * Load Configuration
		 */
		App.loadConfiguration();
	
		/**
		 * Find the number of available CPUS
		 */
		const CPUS: any = os.cpus();
	
		/**
		 * Fork the process, the number of times we have CPUs available
		 */
		// CPUS.forEach(() => cluster.fork());
		cluster.fork();
	
		/**
		 * Catches the cluster events
		 */
		NativeEvent.cluster(cluster);
	
	} else {
		/**
		 * Run the Database pool
		 */
		await App.loadDatabase();
	
		/**
		 * Run the Server on Clusters
		 */
		App.loadServer();
	}
	
})();