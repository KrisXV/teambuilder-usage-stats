function generateStats() {
    var text = $('#teambuilderImport').val();
    var error = false;
    if (!text.trim().length) {
        error = ['noTeams'];
    }
    var teams = PokemonTeams.importTeams(text);
    var speciesNames = {};
    var allPokemonCount = 0;
    var allTeams = teams.length;
    for (var i = 0; i < teams.length; i++) {
        if (error !== false) break;
        var format = teams[i];
        if (!format.team.length) {
            allTeams--;
            continue;
        }
        for (var j = 0; j < format.team.length; j++) {
            var set = format.team[j];
            var species = Dex.species.get(set.species);
            if (!species.exists) {
                error = ['nonexistentPokemon', set];
                break;
            }
            var name = species.name;
            if (!speciesNames[name]) speciesNames[name] = 0;
            speciesNames[name]++;
            allPokemonCount++;
        }
    }
    if (error[0] && error[0] === 'nonexistentPokemon') {
        var buf = ['<p class="error">Error: Invalid Pok&eacute;mon set detected:'];
            if (error[1]) {
                // this is a Pokemon set
                buf.push('<br /><br />' + PokemonSets.exportSet(error[1]).split('\n').join('<br />'))
            }
            buf.push('</p>')
            $('#output').html(buf.join(''));
            return;
    }
    if (error[0] && error[0] === 'noTeams') {
        $('#output').html('<p class="error">Error: No teams provided.</p>');
        return;
    }
    var buf = [];
    for (var species in speciesNames) {
        buf.push({
            spritetag: '<span style="' + PokemonIcons.getPokemon(species).style + '"></span>',
            species: species,
            percentage: (100 * speciesNames[species] / allPokemonCount).toFixed(3),
            appearances: (100 * speciesNames[species] / allTeams).toFixed(3),
        });
    }
    var sortedBuf = buf.sort(function (b, a) {
        return a.percentage - b.percentage;
    });
    var bufStr = ['<table id="usage"><tr><th>Pok&eacute;mon</th><th>% of all Pok&eacute;mon (' + allPokemonCount + ')</th><th>% of all teams (' + allTeams + ')</th></tr>'];
    bufStr = bufStr.concat(sortedBuf.map(function (x) {
        return '<tr><td>' + x.spritetag + '<strong>' + escapeHTML(x.species) + '</strong></td><td>' + x.percentage + '%</td><td>' + x.appearances + '%</td></tr>';
    }));
    bufStr.push('</table>');
    var withoutImg = sortedBuf.map(function (x) {
        return escapeHTML(x.species) + ': ' + x.percentage + '% | ' + x.appearances + '%';
    });
    withoutImg.unshift('Legend: [Pok\u00e9mon: % of all Pok\u00e9mon (' + allPokemonCount + ') | % of all teams (' + allTeams + ')]');
    $('#copybttn').html('<button class="copy" onclick="copyText(\'' + withoutImg.join('\\n') + '\')">Copy usage stats</button>');
    $('#output').html(bufStr.join(''));
}

function copyText(text) {
    var $t = $('<textarea>');
    $('#output').append($t);
    $t.val(text.replace(/\\n/g, '\n')).select();
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
