function troquel(context, arr_objs) {
    this.arr_objs = arr_objs;
    this.index = 0;
    this.context = document.querySelector(context);
    this.text = this.context.querySelector('.textSlide');
    this.img = this.context.querySelector('.imgSlide');
    this.context.querySelector('.btnBack').addEventListener('click', () => {
        this.onChange(false);
    });
    this.context.querySelector('.btnNext').addEventListener('click', () => {
        this.onChange(true);
    });
}

troquel.prototype.onChange = function(isNext) {
    if (isNext && this.index < this.arr_objs.length - 1) {
        this.index++;
    } else if (this.index > 0 && !isNext) {
        this.index--;
    }
    this.text.innerHTML = this.arr_objs[this.index].text;
    this.img.src = 'assets/images/' + this.arr_objs[this.index].img;
    this.img.alt = this.arr_objs[this.index].alt;
    ariaLivePolite.innerText = this.arr_objs[this.index].text;
};
