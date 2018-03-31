import { sayHello } from './greet';

function showHello(divName, name) {
  const elt = document.getElementById(divName);
	elt.innerText = sayHello(name);
	// elt.innerHTML = `say ${name}`;
}

showHello('greeting', 'Hello TypeScript!');
