class NativeEvent {
	public cluster (_cluster): void {
		// Catch cluster listening event...
		_cluster.on('listening', (worker) => {
			console.log(`Server :: Cluster with ProcessID '${worker.process.pid}' Connected!`)
    });

		// Catch cluster once it is back online event...
		_cluster.on('online', (worker) => {
			console.log(`Server :: Cluster with ProcessID '${worker.process.pid}' has responded after it was forked! `)
    });

		// Catch cluster disconnect event...
		_cluster.on('disconnect', (worker) => {
			console.log(`Server :: Cluster with ProcessID '${worker.process.pid}' Disconnected!`)
    });

		// Catch cluster exit event...
		_cluster.on('exit', (worker, code, signal) => {
			console.log(`Server :: Cluster with ProcessID '${worker.process.pid}' is Dead with Code '${code}, and signal: '${signal}'`);
			// Ensuring a new cluster will start if an old one dies
			_cluster.fork();
		});
	}

	public process (): void {
		// Catch the Process's uncaught-exception
		process.on('uncaughtException', (exception) => {
			console.log('caught wb');
			console.log(exception.stack)
    });

		// Catch the Process's warning event
		process.on('warning', (warning) => {
		  console.log(warning.stack)
    });
	}
}

export default new NativeEvent;