const helpsJoinColumns = {
    firstColumn: null,
    secondColumn: null,
    btnHelp50: null,
    ishelp5050: false,
    help_5050: () => {
        let count = 0;
        let index = 0;
        let limitHelp = helpsJoinColumns.firstColumn.length / 2 - asnwerCorrect;
        while (count < limitHelp && index < helpsJoinColumns.firstColumn.length) {
            let isChekFirstColumn = helpsJoinColumns.firstColumn[index].getAttribute('correcta');
            let isChekSecondColumn = helpsJoinColumns.secondColumn[index].getAttribute('correcta');
            //se chequea paraja con pareja gracias a que desde la maqueta estan en orden
            if ((isChekFirstColumn == null || isChekFirstColumn == 'bien') && (isChekSecondColumn == null || isChekSecondColumn == 'bien')) {
                helpsJoinColumns.firstColumn[index].click();
                helpsJoinColumns.secondColumn[index].click();
                count++;
                if (isChekFirstColumn == 'bien' && asnwerCorrect > 0) {
                    asnwerCorrect--;
                }
            }
            index++;
            helpsJoinColumns.ishelp5050 = true;
        }
        ariaLivePolite.innerText = 'Haz utilizado la ayuda 50 50 y tu puntaje fue reducido un 30%.';

    },
    initialize: (context) => {
        helpsJoinColumns.firstColumn = document.querySelectorAll('#sourceElements .treeItem');
        helpsJoinColumns.secondColumn = document.querySelectorAll('#targetElements .treeItem');
        helpsJoinColumns.btnHelp50 = document.querySelector(context + ' .btnHelp50');

        helpsJoinColumns.btnHelp50.addEventListener('click', helpsJoinColumns.help_5050);
    },
}