
/**
 * Global sockets
 *
 * Check in app/controllers/realtime for specific sockets
 */
module.exports = function(app) {

	/**
	 * Clock synchronization
	 */
	var now = new Date(),
		lastSync = {
			hour: now.getHours(),
			minute: now.getMinutes()
		};

	setInterval(function() {
		var now = new Date(),
			sync = {
				hour: now.getHours(),
				minute: now.getMinutes()
			},
			displayTime = {
				hour: now.getHours() + '',
				minute: now.getMinutes() + ''
			};

		if (displayTime.hour.length == 1) {
			displayTime.hour = '0' + displayTime.hour;
		}

		if (displayTime.minute.length == 1) {
			displayTime.minute = '0' + displayTime.minute;
		}

		if (sync.minute != lastSync.minute) {
			console.log('[System] Clock synchronized at ' + displayTime.hour + ':' + displayTime.minute);

			app.io.sockets.emit('clock:sync', now);
			lastSync = sync;
		}
	}, 1000); // Check clock every second
};
