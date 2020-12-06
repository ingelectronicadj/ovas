(function($){
    $.fn.gamePenalty = function(questions, options, answers){
        let time = 90,
            score = 0,
            go = false,
            num = 0,
            layer = $(".c-game-cont-layer"),
            url = 'https://bbdigitaldemo.com/00.material_apoyo/games/penalty/',
            modal = $(".c-game-cont-modal");

        $.preloadImages = function() {
            for(var i = 0; i<arguments.length; i++){
                jQuery("<img>").attr("src", arguments[i]);
            }
            $.preloadImages(url+"gol.svg",url+"penalty_0_right.svg",url+"penalty_1_right.svg",url+"penalty_0.svg");
        }
        $('.c-game-cont-notice').click(function(){
            $(this).slideUp(300);
            startTimer();
        });
        $('.option').click(function(){
            validar(this)
        });
        function timer(){
            if(!go)
                return;
            time--;
            if(time <= 0){
                stopTimer()
                modal.fadeOut(200);
                end()
            }
            $(".c-game-cont-bottom-board-time").text(time);
            setTimeout(timer, 1000);
        };
        function stopTimer(){
            go = false;
        };
        function startTimer(){
            go = true;
            timer();
        };
        function resetClass(){
            $(".c-game").removeClass('good-1');
            $(".c-game").removeClass('init');
            $(".c-game").removeClass('bad-1');
            $(".c-game").removeClass('good-2');
            $(".c-game").removeClass('bad-2');
            $(".c-game").removeClass('good-0');
            $(".c-game").removeClass('bad-0');
            layer.removeClass('active');
        };
        function board(goal){
            layer.slideDown(200);
        };
        function goal(){
            score ++
            $(".c-game-cont-bottom-board-score").text(score);
        };
        function question(num){
            resetClass();
            let listOptions = '', letter= ['A.', 'B.','C.'];
            for (var index in options[num]){
                listOptions += ` <li class="option" data='${index}'>${letter[index]} ${options[num][index]}</li>`;
            }

            $('.c-game-cont-modal-window-question').html(questions[num])
            $('.c-game-cont-modal-window-options').html(listOptions)

            modal.fadeIn(200);
            layer.fadeOut(200);

            $('.option').click(function(){
            validar(this)
            });
        };
        function end(){
            layer.attr('src',url+'finish.svg')
            setTimeout(board, 200);
        };
        function animar(type){
            var cla = Math.floor(Math.random()*2);
            if(type == 'good'){
                return $(".c-game").addClass('good-'+cla);
            }else{
                return $(".c-game").addClass('bad-'+cla);
            }
        };
        function validar(e){
            num ++;
            var data = $(e).attr('data');
            if(data == answers[num-1]){
                modal.fadeOut(200);
                resetClass();
                animar('good')
                //$(".c-game").addClass('good');
                layer.attr('src',url+'gol.svg')
                setTimeout(board, 1200);
                goal();

            }else{
                modal.fadeOut(200);
                resetClass();
                //- $(".c-game").addClass('bad');
                animar('bad')
                layer.attr('src',url+'no-gol.svg')
                setTimeout(board, 1200);
            }
            if(num <= answers.length-1){
                setTimeout(function(){question(num)}, 2500);
            }else{
                stopTimer()
                setTimeout(function(){end()}, 2500);
            }
        };
    };
}(jQuery));
