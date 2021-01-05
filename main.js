class DrumKit{
    constructor(){
        this.playBtn = document.querySelector(`.play`)
        this.pads = document.querySelectorAll('.pad');
        this.currentKick = './allSounds/kick-classic.wav';
        this.currentSnare = './allSounds/snare-acoustic01.wav';
        this.currentHihat = './allSounds/hihat-acoustic01.wav';
        this.kickAudio = document.querySelector(".kick-sound");
        this.snareAudio = document.querySelector(".snare-sound");
        this.hihatAudio = document.querySelector(".hihat-sound");
        this.index = 0; // per avere traccia del punto in cui si trova il loop.
        this.bpm = 150;
        this.isPlaying = null;
        this.selects = document.querySelectorAll('select');
        this.muteBts = document.querySelectorAll('.mute');
        this.tempoSlider = document.querySelector('.tempo-slider');
    }
    activePad(){
        this.classList.toggle('active'); // aggiunge la classe active ai pad selezionati.
    }
    // Qui dobbiamo realizare un metodo che ci permetta di selezionare tramite i select all'interno dell'html, il tipo di sound.
    changeSound(e){
        const selectionName = e.target.name;
        console.log(selectionName);
        const selectionValue = e.target.value;
        console.log(selectionValue);
        switch(selectionName){
            case "kick-select":
                this.kickAudio.src = selectionValue;
                break;
            case "snare-select":
                this.snareAudio.src = selectionValue;
                break;
            case "hihat-select":
                this.hihatAudio.src = selectionValue;
                break;
        }
    }
    repeat(){
        let step = this.index % 8; // quando arriva ad 7, torna a 0.
        const activeBars = document.querySelectorAll(`.b${step}`)
        // Loop pad
        activeBars.forEach(bar =>{
            bar.style.animation = `playTrack 0.3s alternate ease-in-out 2`;
        //  ora dobbiamo controllare che contengano la classe active per attivera il sound.
            if(bar.classList.contains('active')){
                if(bar.classList.contains('kick-pad')){
                    this.kickAudio.currentTime = 0;
                    this.kickAudio.play();
                }
                if(bar.classList.contains('snare-pad')){
                    this.snareAudio.currentTime = 0;
                    this.snareAudio.play();
                }
                if(bar.classList.contains('hihat-pad')){
                    this.hihatAudio.currentTime = 0;
                    this.hihatAudio.play();
                }
            }
        })
        this.index++;
    }
    start(){
        const interval = (60/this.bpm) * 1000; // mi serve per stabilire in base ai bpm,l'intervallo con il qualle looperò la mia traccia.
        // verifichiamo se sta suonando.
        if(!this.isPlaying){
            this.isPlaying = setInterval(() => {
                this.repeat();
            }, interval);
        } else{
            // Eliminiamo l'intervallo
            clearInterval(this.isPlaying);
            this.isPlaying = null;
        }
    }
    updateBtn(){
        if(!this.isPlaying){
            this.playBtn.innerText = "Stop";
            this.playBtn.classList.add('active');
        }else{
            this.playBtn.innerText = "Play";
            this.playBtn.classList.remove('active');
        }
    }
    mute(e){
        // Grazie al data track aggiunto nell'html, possiamo stabilire quale tasto mute è stato selezionato.
        const muteIndex = e.target.getAttribute("data-track");
        e.target.classList.toggle("active");
        // Ora verifichiamo, se il nostro target, contiene il tag active, allora tramite uno switch case, verifichiamo quale, e portiamo il volume a 0.
        if(e.target.classList.contains('active')){
            switch(muteIndex){
                case "0":
                    this.kickAudio.volume = 0;
                    break;
                case "1":
                    this.snareAudio.volume = 0;
                    break;
                case "2":
                    this.hihatAudio.volume = 0;
                    break;
            } // Ora dobbiamo aggiungere ovviamente il caso in cui, non siano selezionati e quindi settare il volume a 1.
        } else{
            switch(muteIndex){
                case "0":
                    this.kickAudio.volume = 1;
                    break;
                case "1":
                    this.snareAudio.volume = 1;
                    break;
                case "2":
                    this.hihatAudio.volume = 1;
                    break;
            }
        }
    }
    changeTempo(e){
        const tempoText = document.querySelector('.tempo-nr');
        this.bpm = e.target.value;
        tempoText.innerText = e.target.value;
    }
    // Cambiando il tempo, se la traccia non è in play, non cambierà nulla, ma se la traccia sta suonando, allora ripartirà con il valore settato.
    updateTempo(){
        clearInterval(this.isPlaying);
        this.isPlaying = null;
        const playBtn = document.querySelector('.play');
        if(playBtn.classList.contains('active')){
            this.start();
        }
    }

}

const drumKit = new DrumKit();

/* EVENTI */

drumKit.pads.forEach(pad =>{
    pad.addEventListener('click', drumKit.activePad)
    pad.addEventListener('animationend', function(){
        this.style.animation = "";
    })
})
drumKit.playBtn.addEventListener('click', function(){
    drumKit.updateBtn();
    drumKit.start();

});


drumKit.selects.forEach(select => {
    select.addEventListener('change', function (e) {
        drumKit.changeSound(e);
      });
});

drumKit.muteBts.forEach(btn =>{
    btn.addEventListener('click', function(e){
        drumKit.mute(e);
    });
})

drumKit.tempoSlider.addEventListener('input', function(e){
    drumKit.changeTempo(e);
})
drumKit.tempoSlider.addEventListener('change', function(e){
    drumKit.updateTempo(e);
})