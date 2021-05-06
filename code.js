function generateStats() {
    var text = $('#teambuilderImport').val();
    var obj = PokemonTeams.importTeams(text);
    var specieses = {};
    var allPokemonCount = 0;
    for (var i = 0; i < obj.length; i++) {
        var format = obj[i];
        for (var j = 0; j < format.team.length; j++) {
            var set = format.team[j];
            if (!specieses[set.species]) specieses[set.species] = 1;
            specieses[set.species]++;
            allPokemonCount++;
        }
    }
    var buf = [];
    for (var species in specieses) {
        var spriteid = species.toLowerCase().replace(/ /g, '-').replace(/[^-a-z0-9]+/g, '');
        if (spriteid.startsWith('gourgeist')) spriteid = 'gourgeist';
        if (spriteid.startsWith('genesect')) spriteid = 'genesect';
        buf.push({spriteurl: '<img src="https://www.smogon.com/forums//media/minisprites/' + spriteid + '.png" alt="" />', species: species, percentage: 100 * specieses[species] / allPokemonCount});
    }
    var sortedBuf = buf.sort(function (b, a) {
        return a.percentage - b.percentage;
    });
    buf = sortedBuf.map(function (x) {
        return x.spriteurl + ' <strong>' + escapeHTML(x.species) + '</strong>: ' + x.percentage.toFixed(3) + '%';
    });
    var withoutImg = sortedBuf.map(function (x) {
        return escapeHTML(x.species) + ': ' + x.percentage.toFixed(3) + '%';
    });
    $('#totalpokemon').html('<small>(' + allPokemonCount + ' Pok&eacute;mon)</small> <button class="copy" onclick="copyText(\'' + withoutImg.join('<br />') + '\')">Copy usage stats</button>');
    $('#output').html(buf.join('<br />'));
}

function copyText(text) {
    var $t = $('<textarea>');
    $('#output').append($t);
    $t.val(text.replace(/<br \/>/g, '\n')).select();
    document.execCommand("copy");
    $t.remove();
    alert('Copied usage stats!');
}

function escapeHTML(str, importable) {
	if (!str) return '';
	str = ('' + str)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;')
		.replace(/\//g, '&#x2f;');
	if (importable) str = str.replace(/\n/g, '\r\n<br />');
	return str;
}
