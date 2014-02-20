
$(function() {
	/**
	 * Offline - manage offline states
	 */
	Offline.options = {
		checkOnLoad: false,
		interceptRequests: true,
		reconnect: { initialDelay: 10 },
		requests: true,
		checks: {
			active: 'xhr',
			xhr: { url: '/check-connection' }
		}
	};

	/**
	 * Moment - dates manipulation
	 */
	moment.lang('fr');
});
