$(document).ready(function () {
    var ls = localStorage;
    if (ls.getItem('teambuilder')) {
        $('#teambuilderImport').val(ls.getItem('teambuilder'));
        generateStats();
    }
    // Screw IE9 users
    $('#teambuilderImport').on('input', function () {
        ls.setItem('teambuilder', $('#teambuilderImport').val());
    });
});
