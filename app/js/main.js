var aufstellung = document.getElementById('aufstellung');

function convertLineup(str) {
	var arr = str.split('x');

	for (var i = 0;  i < arr.length; i++) {
		arr[i] = arr[i].match(/.{1,2}/g);
	}

	console.log(arr);
}

function getURLParameter(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
    results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

aufstellung.innerHTML = convertLineup(getURLParameter('aufstellung'));
