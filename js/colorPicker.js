function createColorPickerOjb(id, selectTab, r, g, b, onChange) {
    
    var colorPickerOjb = {
    
        colorPicker : {
            html : '<div id="PASTEIDallPckrObj" class="allPckrObj"><div id="PASTEIDtab1" numTab="1" class="CLPtab CLPtabFirst">Цвет</div><div id="PASTEIDtab2" numTab="2" class="CLPtab">Образцы</div><div id="PASTEIDpicker" class="CLPpicker"><div id="PASTEIDblocks" class="CLPblocks"><div class="CLPblock"><div class="CLPrangeName">R</div><div class="CLPinnerRange"><canvas id="PASTEIDrangeR" class="CLPrange" width="256" height="7"></canvas><div id="PASTEIDsliderR"></div></div><input id="PASTEIDr" class="CLPrangeValue" type="text" /></div><div class="CLPblock"><div class="CLPrangeName">G</div><div class="CLPinnerRange"><canvas id="PASTEIDrangeG" class="CLPrange" width="256" height="7"></canvas><div id="PASTEIDsliderG"></div></div><input id="PASTEIDg" class="CLPrangeValue" type="text" /></div><div class="CLPblock"><div class="CLPrangeName">B</div><div class="CLPinnerRange"><canvas id="PASTEIDrangeB" class="CLPrange" width="256" height="7"></canvas><div id="PASTEIDsliderB"></div></div><input id="PASTEIDb" class="CLPrangeValue" type="text" /></div></div><div id="PASTEIDcolorPreview" class="CLPcolorPreview"></div><div id="PASTEIDpaletteBlock" class="CLPpaletteBlock"><canvas id="PASTEIDpalette" class="CLPpalette" width="198" height="15"></canvas></div></div><div id="PASTEIDcompleteColor" class="CLPcompleteColor"></div></div>',
            
            color : [[255,0,0],[255,0,0],[0,255,0],[0,255,255],[0,0,255],[255,0,255],[160,0,240],[255,255,255],[229,229,229],[217,217,217],[204,204,204],[191,191,191],[179,179,179],[166,166,166],[153,153,153],[140,140,140],[128,128,128],[240,66,59],[255,241,35],[0,165,85],[0,175,242],[65,80,157],[245,78,151],[115,115,115],[102,102,102],[89,89,89],[76,76,76],[64,64,64],[51,51,51],[38,38,38],[26,26,26],[14,14,14],[0,0,0],[249,137,113],[252,158,119],[255,185,126],[255,246,140],[186,218,143],[148,205,144],[117,195,145],[109,197,191],[96,201,247],[116,157,213],[122,137,197],[126,122,185],[151,126,186],[182,131,186],[249,143,187],[249,140,148],[245,103,82],[248,128,85],[253,160,89],[255,244,97],[157,204,107],[111,190,112],[67,180,114],[53,183,169],[0,187,244],[79,133,198],[89,113,181],[95,98,169],[123,100,169],[158,103,169],[247,111,169],[246,107,120],[240,66,59],[244,98,58],[249,133,55],[255,241,35],[123,191,73],[62,176,81],[0,165,85],[0,170,147],[0,175,242],[36,113,184],[36,113,184],[56,94,168],[65,80,157],[97,80,155],[134,80,154],[245,78,151],[242,71,97],[135,40,25],[136,57,25],[138,76,23],[145,133,0],[63,106,38],[23,99,42],[0,94,44],[0,95,79],[0,96,129],[19,62,103],[33,52,97],[40,44,92],[59,45,91],[80,46,91],[143,47,87],[137,41,51],[99,22,0],[99,37,0],[99,51,0],[99,92,0],[34,73,9],[0,68,16],[0,65,19],[0,64,49],[0,63,86],[0,39,72],[16,31,69],[24,24,66],[40,25,65],[58,26,64],[106,27,58],[101,23,26],[183,157,130],[130,109,94],[91,77,70],[63,56,54],[41,42,42],[180,133,90],[143,101,67],[114,77,50],[91,60,38],[70,46,29]],
            
            id : '',
            
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
            colorPreview2 : undefined,
            
            inputR : undefined,
            inputG : undefined,
            inputB : undefined,
            
            palette : undefined,
            paletteCtx : undefined,
            paletteObj : undefined,
            
            mouse : {x: 0, y: 0, downed: false},
            
            body : undefined,
            
            timerPalette: undefined,
            
            completeColor : undefined,
            
            picker : undefined,
            
            tab1 : undefined,
            tab2 : undefined,
            
            funcChange : undefined
        },
        
        setEvent: function(id, selectTab) {
            var obj = this;
            
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
            
            this.colorPicker.completeColor = $('#'+id+'completeColor');
            
            this.colorPicker.picker = $('#'+id+'picker');
            
            this.colorPicker.tab1 = $('#'+id+'tab1');
            this.colorPicker.tab2 = $('#'+id+'tab2');
            
            this.colorPicker.lineR.fillStyle = "#FFFFFF";
            this.colorPicker.lineG.fillStyle = "#FFFFFF";
            this.colorPicker.lineB.fillStyle = "#FFFFFF";
            
            var tmpstr = '';
            for (var i=0, j=this.colorPicker.color.length; i<j; i++) {
                tmpstr += '<div class="CLPcompleteColorButton" num="'+i+'" style="background-color: rgb('+this.colorPicker.color[i][0]+','+this.colorPicker.color[i][1]+','+this.colorPicker.color[i][2]+')"></div>';
            }
            tmpstr += '<div id="'+id+'colorPreview2" class="CLPcolorPreview2"></div>';
            
            this.colorPicker.completeColor.html(tmpstr).children().click(obj, function () {
                obj.colorPicker.r = obj.colorPicker.color[$(this).attr('num')][0];
                obj.colorPicker.g = obj.colorPicker.color[$(this).attr('num')][1];
                obj.colorPicker.b = obj.colorPicker.color[$(this).attr('num')][2];
                obj.refreshAll(true, true);
                obj.colorPreviewRepaint();
                obj.onChangeColor();
            })
            
            this.colorPicker.colorPreview2 = $('#'+id+'colorPreview2');
            
            this.loadPalette();
            
            this.selectTab(selectTab);
            
            $('#'+id+'tab1, #'+id+'tab2').click(obj, function() {
                numTab = $(this).attr('numTab');
                obj.selectTab(numTab);
            })
            
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
                    obj.onChangeColor();
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
                    obj.onChangeColor();
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
                    obj.onChangeColor();
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
                    obj.onChangeColor();
                }
            }).mousedown(obj, function(e) {
                obj.colorPicker.mouse.downed = true;
                var pixel = obj.colorPicker.paletteCtx.getImageData(obj.colorPicker.mouse.x, obj.colorPicker.mouse.y, 1, 1);
                obj.colorPicker.r = pixel.data[0];
                obj.colorPicker.g = pixel.data[1];
                obj.colorPicker.b = pixel.data[2];
                obj.refreshAll(true, true);
                obj.onChangeColor();
            }).mouseup(obj, function() {
                obj.colorPicker.mouse.downed = false;
            });
        },
        
        selectTab: function(numTab) {
            if (numTab == 1) {
                this.colorPicker.completeColor.addClass('CLPhide');
                this.colorPicker.picker.removeClass('CLPhide');
                this.colorPicker.tab1.addClass('CLPselectTab');
                this.colorPicker.tab2.removeClass('CLPselectTab');
            } else if (numTab == 2) {
                this.colorPicker.picker.addClass('CLPhide');
                this.colorPicker.completeColor.removeClass('CLPhide');
                this.colorPicker.tab2.addClass('CLPselectTab');
                this.colorPicker.tab1.removeClass('CLPselectTab');
            }
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
            this.colorPicker.lineR.clearRect(0, 0, 256, 7);
            for (var i=0; i<=256; i++) {
                this.colorPicker.lineR.beginPath();
                this.colorPicker.lineR.strokeStyle = this.colorHex(i, this.colorPicker.g, this.colorPicker.b);
                this.colorPicker.lineR.moveTo(i,0);
                this.colorPicker.lineR.lineTo(i,7);
                this.colorPicker.lineR.stroke();
            }
        },
        
        drawrCanvasG: function() {
            this.colorPicker.lineG.clearRect(0, 0, 256, 7);
            for (var i=0; i<=256; i++) {
                this.colorPicker.lineG.beginPath();
                this.colorPicker.lineG.strokeStyle = this.colorHex(this.colorPicker.r, i, this.colorPicker.b);
                this.colorPicker.lineG.moveTo(i,0);
                this.colorPicker.lineG.lineTo(i,7);
                this.colorPicker.lineG.stroke();
            }
        },
        
        drawrCanvasB: function() {
            this.colorPicker.lineB.clearRect(0, 0, 256, 7);
            for (var i=0; i<=256; i++) {
                this.colorPicker.lineB.beginPath();
                this.colorPicker.lineB.strokeStyle = this.colorHex(this.colorPicker.r, this.colorPicker.g, i);
                this.colorPicker.lineB.moveTo(i,0);
                this.colorPicker.lineB.lineTo(i,7);
                this.colorPicker.lineB.stroke();
            }
        },
        
        colorPreviewRepaint: function() {
            this.colorPicker.colorPreview.css('background-color', this.colorHex(this.colorPicker.r, this.colorPicker.g, this.colorPicker.b));
            this.colorPicker.colorPreview2.css('background-color', this.colorHex(this.colorPicker.r, this.colorPicker.g, this.colorPicker.b));
        },
        
        loadPalette: function() {
            this.colorPicker.paletteCtx.fillStyle = 'white';
            this.colorPicker.paletteCtx.fillRect(0, 0, 198, 15);
            this.colorPicker.paletteCtx.fillStyle = 'black';
            this.colorPicker.paletteCtx.fillRect(190, 7, 8, 8);
            
            var gr = this.colorPicker.paletteCtx.createLinearGradient(0,0,190,0);
            gr.addColorStop(0.0, 'rgb(255,0,0)');
            gr.addColorStop(0.166, 'rgb(255,255,0)');
            gr.addColorStop(0.332, 'rgb(0,255,0)');
            gr.addColorStop(0.498, 'rgb(0,255,255)');
            gr.addColorStop(0.664, 'rgb(0,0,255)');
            gr.addColorStop(0.83, 'rgb(255,0,255)');
            gr.addColorStop(1.0, 'rgb(255,0,0)');
            this.colorPicker.paletteCtx.fillStyle = gr;
            this.colorPicker.paletteCtx.fillRect(0, 0, 190, 15);
            
            gr = this.colorPicker.paletteCtx.createLinearGradient(0,0,0,15);
            gr.addColorStop(0.0, 'rgba(255,255,255,1)');
            gr.addColorStop(0.5, 'rgba(192,192,192,0)');
            gr.addColorStop(1.0, 'rgba(0,0,0,0.9)');
            this.colorPicker.paletteCtx.fillStyle = gr;
            this.colorPicker.paletteCtx.fillRect(0, 0, 190, 15);
        },
        
        hexToRgb: function(hex) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        },
        
        isInt: function(n) {
            return typeof n === 'number' && parseFloat(n) == parseInt(n, 10) && !isNaN(n);
        },
        
        onChangeColor: function() {
            if (this.colorPicker.funcChange) {
                this.colorPicker.funcChange();
                return true;
            }
            return false;
        },
        
        
        /*
         *  PUBLIC PROPERTY
         */
        getHEX: function() {
            return this.colorHex(this.colorPicker.r, this.colorPicker.g, this.colorPicker.b);
        },
        
        getRGB: function() {
            return [this.colorPicker.r, this.colorPicker.g, this.colorPicker.b];
        },
        
        setHEX: function(hex) {
            var rgb = this.hexToRgb(hex);
            if (rgb) {
                this.colorPicker.r = rgb.r;
                this.colorPicker.g = rgb.g;
                this.colorPicker.b = rgb.b;
                this.refreshAll(true, true);
                return true;
            } else {
                return false;
            }
        },
        
        setRGB: function(r, g, b) {
            if ( this.isInt(r) && this.isInt(g) && this.isInt(b) ) {
                this.colorPicker.r = r;
                this.colorPicker.g = g;
                this.colorPicker.b = b;
                this.refreshAll(true, true);
                return true;
            } else {
                return false;
            }
        },
        
        create: function(id, selectTab, r, g, b, onChange) {
            this.colorPicker.r = r;
            this.colorPicker.g = g;
            this.colorPicker.b = b;
            this.colorPicker.html = this.colorPicker.html.replace(/PASTEID/g, id);
            $('#'+id).html(this.colorPicker.html);
            this.setEvent(id, selectTab);
            this.colorPicker.funcChange = onChange;
        }
    }
    
    this.getHEX = function() {
        return colorPickerOjb.getHEX();
    }
    
    this.getRGB = function() {
        return colorPickerOjb.getRGB();
    }
    
    this.setHEX = function(hex) {
        return colorPickerOjb.setHEX(hex);
    }
    
    this.setRGB = function(r, g, b) {
        return colorPickerOjb.setRGB(r, g, b);
    }
    
    colorPickerOjb.create(id, selectTab, r, g, b, onChange);
}