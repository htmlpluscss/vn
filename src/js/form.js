( forms => {

	if(!forms.length) {

		return;

	}

	VN.readySubscribe = data => {

		console.log(data);

		const form = document.querySelector('.form-subscribe.is-send');

		form.classList.remove('is-send');

		form.querySelector('.form-subscribe__result').textContent = data.msg;

		form.classList.add('is-done');

		form.querySelector('.form-subscribe__submit').disabled = false;

		if(data.result === "success"){

		}

		if(data.result === "error"){

			setTimeout( () => form.classList.remove('is-done'), 5000);

		}

	};

	const getQueryString = formData => {

		let pairs = [];

		for (let [key, value] of formData.entries()) {

			pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));

		}

		return pairs.join('&');

	}

	Array.from(forms, form => {

		form.addEventListener('submit', event => {

			event.preventDefault();

			let url = form.getAttribute('action');

			url = url.replace("/post?u=", "/post-json?u=");
			url = url + '&c=VN.readySubscribe';
			url = url + '&' + getQueryString(new FormData(form));

			form.classList.add('is-send');
			form.querySelector('.form-subscribe__submit').disabled = true;

			const script = document.createElement('script');

			script.async = true;
			script.src = url

			document.head.appendChild(script);

		});

	});

})(document.querySelectorAll('.form-subscribe'));


// mailer

( forms => {

	if(!forms.length) {

		return;

	}

	//reCaptcha v3

	let reCaptchaOFF = true;
	const PUBLIC_KEY = '6LdEIvkZAAAAAKkOVmnhwgc0hpKueZkUglPfuow2';

	const loadReCaptcha = () => {

		if(reCaptchaOFF) {

			reCaptchaOFF = false;

			const script = document.createElement('script');

			script.async = true;
			script.src = 'https://www.google.com/recaptcha/api.js?render=' + PUBLIC_KEY;

			document.head.appendChild(script);

		}

	};

	Array.from(forms, form => {

		form.addEventListener('input', () => loadReCaptcha());

		form.addEventListener('reset', () => form.classList.remove('is-done'));

		form.addEventListener('submit', event => {

			event.preventDefault();

			const formBtnSubmit = form.querySelector('.form__submit'),
				  formData = new FormData(form),
				  xhr = new XMLHttpRequest(),
				  action = form.getAttribute('action');

			xhr.open("POST", action);

			if(formBtnSubmit) {

				formBtnSubmit.disabled = true;

			}

			xhr.onreadystatechange = () => {

				if (xhr.readyState !== 4){

					return;

				}

				if (xhr.status !== 200) {

					alert('ошибка ' + xhr.status);

				}
				else {

					form.classList.add('is-done');

				}

				if(formBtnSubmit) {

					formBtnSubmit.disabled = false;

				}

			}

xhr.send(formData);
return;
			// reCaptcha

			if (typeof(grecaptcha) == 'undefined') {

				formData.append('g_recaptcha_response', 'error');
				xhr.send(formData);

				alert('Ошибка отправки! Google reCaptcha не загрузилась, пожалуйста сообщите администратору.');

			} else {

				grecaptcha.ready( () => {

					grecaptcha.execute(PUBLIC_KEY).then( token => {

						formData.append('g_recaptcha_response', token);
						xhr.send(formData);

					});

				});

			}

		});

	});

})(document.querySelectorAll('.form-mailer'));