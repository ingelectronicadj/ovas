$(document).ready(function() {
    $('.block').draggable({
        containment: '#blockTray',
        stack: '.block',
        snap: true,
        snapMode: 'outer',
        snapTolerance: 13,
    });

    $('#blockTray').on('mousedown', function() {
        $('#instruction').fadeOut('slow');
    });

    // Make blocks rotate 90 deg on each click
    var angle = 90;

    $('.block').click(function() {
        $(this).css({
            '-webkit-transform': 'rotate(' + angle + 'deg)',
            '-moz-transform': 'rotate(' + angle + 'deg)',
            '-o-transform': 'rotate(' + angle + 'deg)',
            '-ms-transform': 'rotate(' + angle + 'deg)',
        });
        angle += 90;
    });
});
