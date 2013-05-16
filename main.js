var p_timerPalette;
var p_tempObj;

var colorPickerOjb = {

    colorPicker : {
        srcPalette: 'img/pickuper.png',
        html : '<div id="PASTEIDblocks" class="blocks"><div class="block"><div class="rangeName">R</div><div class="innerRange"><canvas id="PASTEIDrangeR" class="range" width="256" height="7"></canvas><div id="PASTEIDsliderR"></div></div><input id="PASTEIDr" class="rangeValue" type="text" /></div><div class="block"><div class="rangeName">G</div><div class="innerRange"><canvas id="PASTEIDrangeG" class="range" width="256" height="7"></canvas><div id="PASTEIDsliderG"></div></div><input id="PASTEIDg" class="rangeValue" type="text" /></div><div class="block"><div class="rangeName">B</div><div class="innerRange"><canvas id="PASTEIDrangeB" class="range" width="256" height="7"></canvas><div id="PASTEIDsliderB"></div></div><input id="PASTEIDb" class="rangeValue" type="text" /></div></div><div id="PASTEIDcolorPreview" class="colorPreview"></div><div id="PASTEIDpaletteBlock" class="paletteBlock"><canvas id="PASTEIDpalette" class="palette" width="198" height="15"></canvas></div>',
        
        r : 0,
        canvasR : undefined,
        lineR : undefined,
        
        g : 0,
        canvasG : undefined,
        lineG : undefined,
        
        b : 0,
        canvasB : undefined,
        lineB : undefined,
        
        colorPreview : undefined,
        
        inputR : undefined,
        inputG : undefined,
        inputB : undefined,
        
        palette : undefined,
        paletteCtx : undefined,
        paletteObj : undefined,
        
        imgPalette : new Image(),
        
        mouse : {x: 0, y: 0, downed: false},
        
        body : undefined,
        
        timerPalette: undefined
    },
    
    create: function(id) {
        this.colorPicker.imgPalette.src = this.colorPicker.srcPalette;
        this.colorPicker.html = this.colorPicker.html.replace(/PASTEID/g, id);
        $('#'+id).html(this.colorPicker.html);
        this.setEvent(id);
    },
    
    setEvent: function(id) {
        obj = this;
        
        this.colorPicker.body = $("body");
        
        this.colorPicker.canvasR = document.getElementById(id+"rangeR");
        this.colorPicker.lineR = this.colorPicker.canvasR.getContext("2d");
        
        this.colorPicker.canvasG = document.getElementById(id+"rangeG");
        this.colorPicker.lineG = this.colorPicker.canvasG.getContext("2d");
        
        this.colorPicker.canvasB = document.getElementById(id+"rangeB");
        this.colorPicker.lineB = this.colorPicker.canvasB.getContext("2d");
        
        this.colorPicker.palette = document.getElementById(id+"palette");
        this.colorPicker.paletteCtx = this.colorPicker.palette.getContext("2d");
        
        this.colorPicker.colorPreview = $('#'+id+'colorPreview');
        
        this.colorPicker.paletteObj = $('#'+id+'palette');
        
        this.loadPalette();
        
        $('#'+id+'r, #'+id+'g, #'+id+'b').bind("contextmenu",function(e){
            return false;
        }).keyup(obj, function() {
            var s = +$(this).val();
            if (isNaN(s)) {
                s = 255;
            };
            s = Math.round(s);
            if (s < 0) {
                s = 0;
            };
            if (s > 255) {
                s = 255;
            };
            $(this).val(s);
            obj.colorPicker.r = obj.colorPicker.inputR.val();
            obj.colorPicker.g = obj.colorPicker.inputG.val();
            obj.colorPicker.b = obj.colorPicker.inputB.val();
            obj.refreshAll(false, true);
        });
        
        this.colorPicker.inputR = $('#'+id+'r');
        this.colorPicker.inputG = $('#'+id+'g');
        this.colorPicker.inputB = $('#'+id+'b');
        
        this.colorPicker.sliderR = $('#'+id+'sliderR').slider({
            obj: this,
            max: 255,
            min: 0,
            slide: function( event, ui ) {
                $('#'+id+'r').val( ui.value );
                obj.colorPicker.r = ui.value;
                obj.drawrCanvasG();
                obj.drawrCanvasB();
                obj.colorPreviewRepaint();
            }
        });
        
        this.colorPicker.sliderG = $('#'+id+'sliderG').slider({
            obj: this,
            max: 255,
            min: 0,
            slide: function( event, ui ) {
                $('#'+id+'g').val( ui.value );
                obj.colorPicker.g = ui.value;
                obj.drawrCanvasR();
                obj.drawrCanvasB();
                obj.colorPreviewRepaint();
            }
        });
        
        this.colorPicker.sliderB = $('#'+id+'sliderB').slider({
            obj: this,
            max: 255,
            min: 0,
            slide: function( event, ui ) {
                $('#'+id+'b').val( ui.value );
                obj.colorPicker.b = ui.value;
                obj.drawrCanvasR();
                obj.drawrCanvasG();
                obj.colorPreviewRepaint();
            }
        });
        
        this.refreshAll(true, true);
        
        this.colorPicker.paletteObj.mousemove(obj, function (e) {
            obj.colorPicker.mouse.x = e.clientX - obj.colorPicker.paletteObj.offset().left + obj.colorPicker.body.scrollLeft();
            obj.colorPicker.mouse.y = e.clientY - obj.colorPicker.paletteObj.offset().top + obj.colorPicker.body.scrollTop();
            if (obj.colorPicker.mouse.downed) {
                var pixel = obj.colorPicker.paletteCtx.getImageData(obj.colorPicker.mouse.x, obj.colorPicker.mouse.y, 1, 1);
                obj.colorPicker.r = pixel.data[0];
                obj.colorPicker.g = pixel.data[1];
                obj.colorPicker.b = pixel.data[2];
                obj.refreshAll(true, true);
            }
        }).mousedown(obj, function(e) {
            obj.colorPicker.mouse.downed = true;
            var pixel = obj.colorPicker.paletteCtx.getImageData(obj.colorPicker.mouse.x, obj.colorPicker.mouse.y, 1, 1);
            obj.colorPicker.r = pixel.data[0];
            obj.colorPicker.g = pixel.data[1];
            obj.colorPicker.b = pixel.data[2];
            obj.refreshAll(true, true);
        }).mouseup(obj, function() {
            obj.colorPicker.mouse.downed = false;
        });
        
        p_tempObj = this;
        p_timerPalette = setInterval(function() {
            var pixel = p_tempObj.colorPicker.paletteCtx.getImageData(5, 5, 1, 1);
            var r = pixel.data[0];
            var g = pixel.data[1];
            var b = pixel.data[2];
            var a = pixel.data[3];
            
            if (r!=0 || g!=0 || b!=0 || a!=0) {
                clearTimeout(p_timerPalette);
                p_tempObj = undefined;
            } else {
                p_tempObj.loadPalette();
            }
        }, 200);
    },
    
    slider: {
        getValue: function(obj) {
            return obj.slider("option", "value");
        },
        
        setValue: function(obj, value) {
            obj.slider("option", "value", value);
        }
    },
    
    colorHex: function(cR, cG, cB) {
        var cR = Number(cR).toString(16);
        cR = "00".substr(0, 2 - cR.length) + cR;
        var cG = Number(cG).toString(16);
        cG = "00".substr(0, 2 - cG.length) + cG;
        var cB = Number(cB).toString(16);
        cB = "00".substr(0, 2 - cB.length) + cB;
        
        return '#' + cR.toString(16) + cG.toString(16) + cB.toString(16);
    },
    
    refreshAll: function(refreshInput, refreshSlider) {
        this.colorPreviewRepaint();
        this.drawrCanvasR();
        this.drawrCanvasG();
        this.drawrCanvasB();
        
        if (refreshInput) {
            this.colorPicker.inputR.val(this.colorPicker.r);
            this.colorPicker.inputG.val(this.colorPicker.g);
            this.colorPicker.inputB.val(this.colorPicker.b);
        }
        
        if (refreshSlider) {
            this.slider.setValue(this.colorPicker.sliderR, this.colorPicker.r);
            this.slider.setValue(this.colorPicker.sliderG, this.colorPicker.g);
            this.slider.setValue(this.colorPicker.sliderB, this.colorPicker.b);
        }
    },
    
    drawrCanvasR: function() {
        for (var i=0; i<256; i++) {
            this.colorPicker.lineR.beginPath();
            this.colorPicker.lineR.strokeStyle = this.colorHex(i, this.colorPicker.g, this.colorPicker.b);
            this.colorPicker.lineR.moveTo(i,0);
            this.colorPicker.lineR.lineTo(i,6);
            this.colorPicker.lineR.stroke();
        }
    },
    
    drawrCanvasG: function() {
        for (var i=0; i<256; i++) {
            this.colorPicker.lineG.beginPath();
            this.colorPicker.lineG.strokeStyle = this.colorHex(this.colorPicker.r, i, this.colorPicker.b);
            this.colorPicker.lineG.moveTo(i,0);
            this.colorPicker.lineG.lineTo(i,6);
            this.colorPicker.lineG.stroke();
        }
    },
    
    drawrCanvasB: function() {
        for (var i=0; i<256; i++) {
            this.colorPicker.lineB.beginPath();
            this.colorPicker.lineB.strokeStyle = this.colorHex(this.colorPicker.r, this.colorPicker.g, i);
            this.colorPicker.lineB.moveTo(i,0);
            this.colorPicker.lineB.lineTo(i,6);
            this.colorPicker.lineB.stroke();
        }
    },
    
    colorPreviewRepaint: function() {
        this.colorPicker.colorPreview.css('background-color', this.colorHex(this.colorPicker.r, this.colorPicker.g, this.colorPicker.b));
    },
    
    loadPalette: function() {
        //this.colorPicker.imgPalette.src = this.colorPicker.srcPalette;
        obj = this;
        this.colorPicker.imgPalette.onload = function() {
            obj.colorPicker.paletteCtx.drawImage(obj.colorPicker.imgPalette, 0, 0);
        }(obj);
    },
    
    createColorPicker: function() {
       var key, clone = {};
       for(key in this) if(this.hasOwnProperty(key)) clone[key] = this[key];
       return clone;
    }
    
}



$(document).ready(function() {
    newPicker = colorPickerOjb.createColorPicker();
    newPicker.create('cl');
})