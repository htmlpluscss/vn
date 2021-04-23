( () => {

	const yaCounterId = 70306213,
		goals = [

			{
				selector: '.goal-1',
				event: 'click',
				yandex: {
					target: '1'
				}
			},
			{
				selector: '.goal-2',
				event: 'click',
				yandex: {
					target: '2'
				}
			},
			{
				selector: '.goal-3',
				event: 'click',
				yandex: {
					target: '3'
				}
			},
			{
				selector: '.goal-4',
				event: 'click',
				yandex: {
					target: '4'
				}
			},
			{
				selector: '.goal-5',
				event: 'click',
				yandex: {
					target: '5'
				}
			},
			{
				selector: '.goal-6',
				event: 'click',
				yandex: {
					target: '6'
				}
			},
			{
				selector: '.goal-7',
				event: 'click',
				yandex: {
					target: '7'
				}
			},
			{
				selector: '.goal-8',
				event: 'click',
				yandex: {
					target: '8'
				}
			},
			{
				selector: '.goal-9',
				event: 'click',
				yandex: {
					target: '9'
				}
			},
			{
				selector: '.goal-10',
				event: 'click',
				yandex: {
					target: '10'
				}
			},
			{
				selector: '.goal-11',
				event: 'click',
				yandex: {
					target: '11'
				}
			},
			{
				selector: '.goal-12',
				event: 'click',
				yandex: {
					target: '12'
				}
			},
			{
				selector: '.goal-13',
				event: 'click',
				yandex: {
					target: '13'
				}
			},
			{
				selector: '.goal-14',
				event: 'click',
				yandex: {
					target: '14'
				}
			},
			{
				selector: '.goal-15',
				event: 'click',
				yandex: {
					target: '15'
				}
			}

		];


	goals.forEach( goal => {

		if (goal.page && goal.page !== location.pathname)
			return;

		if (goal.skipPages && goal.skipPages.indexOf(location.pathname) !== -1)
			return;

		const elements = document.querySelectorAll(goal.selector);

		Array.from(elements, element => {

			element.addEventListener(goal.event, () => {

				console.log(goal.yandex.target);

				if (goal.yandex && window.ym) {

					ym(yaCounterId, 'reachGoal', goal.yandex.target);

				}

			});

		});

	});

})();