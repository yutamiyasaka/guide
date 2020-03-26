//ページレイアウト用javascript
let pageLayout = function(){
    let isPC;

    //ページ内リンク
    const pgLink = function(){

        //スムーススクロール
        let smoothScroll = function(target){
            let toY;
            let nowY = window.pageYOffset;
            const divisor = 8;                  //変化係数
            const range = (divisor / 2) + 1;

            //ターゲットの座標
            const targetRect = target.getBoundingClientRect();
            const targetY = targetRect.top + nowY;

            //スクロール終了まで繰り返す処理
            (function () {
                let thisFunc = arguments.callee;
                toY = nowY + Math.round((targetY - nowY) / divisor);
                window.scrollTo(0, toY);
                nowY = toY;

                if (document.body.clientHeight - window.innerHeight < toY) {
                    //最下部にスクロールしても対象まで届かない場合は下限までスクロールして強制終了
                    window.scrollTo(0, document.body.clientHeight);
                    return;
                }
                if (toY >= targetY + range || toY <= targetY - range) {
                    //+-rangeの範囲内へ近くまで繰り返す
                    window.setTimeout(thisFunc, 10);
                } else {
                    //+-range の範囲内にくれば正確な値へ移動して終了。
                    window.scrollTo(0, targetY);
                }
            })();
        };

        // アンカータグにクリックイベントを登録
        const links = document.querySelectorAll('a[href*="#"]');

        for(let count = 0 ; links.length > count ; count ++ ){
            links[count].addEventListener('click', function (evt) {

                const href = evt.currentTarget.getAttribute('href');
                const splitHref = href.split('#');
                const targetID = splitHref[1];
                const target = document.getElementById(targetID);

                if (target) {
                    smoothScroll(target);
                }
            });
        };

    }

    //アコーディオン
    const toggleBox = function(evt){
        let elm = evt.target;

        for(;true;){
            if(elm.classList.contains('l-topics-card')){
                elm.classList.toggle('is-act');
                break;
            }else if(elm.tagName == 'body'){
                break;
            }
            elm = elm.parentNode;
        }
    }

    /*
    //sec4 animation
    const sec4Evt = function(){
        const imgs = document.querySelectorAll('.l-sec4-tree img');
        let laterImageVal = 0;
        let laterImage;

        for(let count = 0 ; imgs.length > count ; count ++ ){
            let elm = imgs[count];
            let delayTime = getStyleSheetValue(elm,'transition-delay').replace('s','');
            if(laterImageVal <= delayTime){
                laterImageVal = delayTime;
                laterImage = elm;
            }
        }

        laterImage.addEventListener('transitionend', function(){
            makeLeaf();
        });

        //指定範囲の値をランダムに返す
        const randRange = function(min, max){
            return Math.floor(Math.random() * (max - min + 1) + min);
        }

        //中央よりランダム数の生成
        const randPos = function(min, max){
            const valueA = randRange(min,max) / 2;
            const valueB = randRange(min,max) / 2;
            return (valueA + valueB);
        }

        // 葉の色を生成
        const generateRandomColor = function() {
            let rCol = randRange(100,230);
            let gCol = randRange(220,240);
            let bCol = randRange(60,120);
            let alpha = randRange(4,9) * 0.1;

            return 'rgba(' + rCol + ',' + gCol + ',' + bCol + ',' + alpha + ')'
        }

        //葉を消すためのアルファ値を減産した色の生成
        const preColor = function(color,alpha){
            let splitColor = color.split(',');
            if(splitColor.length == 1){
                return generateRandomColor();
            }else{
                return splitColor[0] + ',' + splitColor[1] + ',' +  splitColor[2] + ',' + alpha + ')';
            }
        }


        window.requestAnimFrame = (function () {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
        })();


        function getStyleSheetValue(element, property) {
            if (!element || !property) {
            return null;
            }

            const style = window.getComputedStyle(element);
            const value = style.getPropertyValue(property);

            return value;
        }

        const makeLeaf = function() {
            const canvas = document.querySelector('#canvas');
            const ctx = canvas.getContext('2d');

            let center = {};    // Canvas中央
            let dots = [];      // パーティクル配列
            let density = 370;  //パーティクルの数
            let colors = generateRandomColor();
            let baseSize = 4;   // 大きさ
            let baseSpeed = 10; // スピード

            const MAX_LIFE = 2;

            const Dot = function () {
                this.life = MAX_LIFE;
                this.maxSize = Math.floor( Math.random() * 6 ) + baseSize; //大きさ
                this.size = 0;
                this.color = generateRandomColor(); //色
                this.speed = this.size / baseSpeed; // 大きさによって速度変更
                this.pos = {   // 位置
                    x: randPos(30,320),
                    y: randPos(30,220)
                };
                const rot = Math.random() * 360;  // ランダムな角度
                const angle = rot * Math.PI / 180;

            };
            Dot.prototype = {
                update: function() {
                    this.draw();

                    this.life = this.life - 0.001*randRange(1,6);
                    this.color = preColor(this.color,this.life);


                    this.size = this.size <= this.maxSize ? this.size + 0.3 : this.maxSize;

                    if(this.life <= 0){
                        newIns(this);
                    }

                },

                draw: function() {
                    ctx.fillStyle = this.color;
                    ctx.beginPath();
                    ctx.arc(this.pos.x, this.pos.y, this.size, 0, 2 * Math.PI, false);
                    ctx.fill();
                }
            };

            const newIns = function(elm){
                const num = dots.indexOf(elm);
                dots.splice(num,1);
            }

            const update = function() {
                requestAnimFrame(update);
                // 描画をクリア
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

                for (var i = 0; i < dots.length -1; i++) {
                    dots[i].update();
                }
            }

            const init = function() {
                // canvas中央をセット
                center.x = canvas.width / 2;
                center.y = canvas.height / 2;

                setInterval(function(){
                    if(dots.length <= density){
                        dots.push(new Dot());
                        if(dots.length == 1){
                            update();
                        }
                    }
                },50);

            }
            init();
        }

    }
    */

    //sec5 animation
    const sec5Evt = function(){
        document.querySelector('.l-sec5-imgBox-open-button').addEventListener('webkitAnimationEnd', function(evt) {
            const elm = document.querySelector('.l-sec5-imgBox-open-button');
            if( elm.classList.contains('is-sec5-4') == true ){
                let box = document.querySelector('.l-sec5-imgBox');
                elm.classList.remove('is-sec5-4');
                elm.classList.add('is-sec5-5');
                box.classList.remove('is-imgHidden');
                box.classList.add('is-animation');
            }
            if( elm.classList.contains('is-sec5-3') == true ){
                elm.classList.remove('is-sec5-3');
                elm.classList.add('is-sec5-4');
            }
            if( elm.classList.contains('is-sec5-2') == true ){
                elm.classList.remove('is-sec5-2');
                elm.classList.add('is-sec5-3');
            }
            elm.classList.add('is-sec5-2');
        }, false);

    }



    //トップページ画面を下へスクロールにて、scroll down画像の非表示
    const scrollDownEdit = function(){

        let isScrollDownView = false;
        let scrolldownNode;

        if(window.pageYOffset <= 1000){
            const scrollParentNode = document.querySelector('.l-topPg');
            scrolldownNode = document.createElement('div');
            scrolldownNode.classList.add('l-scrolldown');

            let img1 = document.createElement('img');
            img1.setAttribute('src' , 'img/ico-srdwn1.png');
            img1.setAttribute('width' , '68');
            img1.setAttribute('height' , '9');

            let img2 = document.createElement('img');
            img2.setAttribute('src' , 'img/ico-srdwn2.png');
            img2.setAttribute('width' , '68');
            img2.setAttribute('height' , '27');

            let img3 = document.createElement('img');
            img3.setAttribute('src' , 'img/ico-srdwn2.png');
            img3.setAttribute('width' , '68');
            img3.setAttribute('height' , '27');

            let img4 = document.createElement('img');
            img4.setAttribute('src' , 'img/ico-srdwn2.png');
            img4.setAttribute('width' , '68');
            img4.setAttribute('height' , '27');

            scrolldownNode.appendChild(img1);
            scrolldownNode.appendChild(img2);
            scrolldownNode.appendChild(img3);
            scrolldownNode.appendChild(img4);

            scrollParentNode.appendChild(scrolldownNode);

            isScrollDownView = true;
        }

        window.addEventListener('scroll', function(){
            const scrollTop = window.pageYOffset;
            if(scrollTop > 100 && isScrollDownView){
                scrolldownNode.classList.add('is-none');
                isScrollDownView = false;
            }

            add_class_in_scrolling(document.getElementsByClassName('l-sec2')[0]);
            if(isLogined == false){
                add_class_in_scrolling(document.getElementsByClassName('l-sec3')[0]);
            }
            // add_class_in_scrolling(document.getElementsByClassName('l-sec4')[0]);
            add_class_in_scrolling(document.getElementsByClassName('l-sec5')[0]);

        }, false);



    	// スクロールで要素が表示された時にclassを付与する
    	function add_class_in_scrolling(target) {
    		const tolerance = 200;
    	    const winScroll = window.pageYOffset;
    	    const winHeight = window.innerHeight;
    	    const scrollPos = winScroll + winHeight + tolerance;
    		const rect = target.getBoundingClientRect();
    		const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    		const elmOffsetTop = rect.top + scrollTop;

    	    if(elmOffsetTop < scrollPos) {
    	    	target.classList.add('is-show');
    	    }
    	}

    }

    //index 検索窓
    const search = function(){
        document.querySelector("#btnSearchBtm").addEventListener("click",function(evt){
            srchSubmit(document.querySelector('#mainInputBtm').value);
        });

        document.querySelector("#btnSearchBtm_side").addEventListener("click",function(evt){
            srchSubmit(document.querySelector('#mainInputBtm_side').value);
        });

        document.querySelector('#form-searchBox').addEventListener('submit',function(evt){
            evt.preventDefault();
            srchSubmit(document.querySelector('#mainInputBtm').value);
        });

        document.querySelector('#searchBoxFix').addEventListener('submit',function(evt){
            evt.preventDefault();
            srchSubmit(document.querySelector('#mainInputBtm_side').value);
        });

        function srchSubmit(query){
            let url = 'https://search.goo.ne.jp/web.jsp?MT=' + query + '&mode=0&sbd=goo001&IE=UTF-8&OE=UTF-8&from=s_b_top_web&PT=TOP';
            location.href = url;
        }
    }



    //トピックページレイアウト
    const topicLayout = function(){

    	let cards = document.querySelectorAll('.l-topics-card');

        for(let count = 0 ; cards.length > count ; count ++ ){
            cards[count].addEventListener('click', toggleBox, false);
        }
    }


    //追従する検索ボタンのイベント
    const searchBtnEvt = function(){
        const searchOpenBtn = document.querySelector(".l-sideSearch-minBtn");
        const searchCloseBtn = document.querySelector(".l-sideSearch-closeBtn");
        const sideSearchBox = document.querySelector(".l-sideSearch");
        const flug = "is-opneSideSearch";

        searchOpenBtn.addEventListener('click',function(evt){
            evt.preventDefault();
            sideSearchBox.classList.add(flug);
        });

        searchCloseBtn.addEventListener('click',function(evt){
            evt.preventDefault();
            sideSearchBox.classList.remove(flug);
        })
    }




    window.onload = function() {

        isPC = window.innerWidth <= 980 ? false : true;

        const bkBtn = document.querySelector(".l-bkBtn");
        if(bkBtn != null){
            bkBtn.addEventListener('click',function(evt){
                evt.preventDefault();
                history.back();
            });
        }

        if(document.body.classList.contains('l-topPg')){
            if(isPC){document.querySelector('body').classList.add('is-pc');}
            scrollDownEdit();
            // sec4Evt();
            sec5Evt();
            if(isLogined){document.querySelector('.l-sec3').parentNode.parentNode.removeChild(document.querySelector('.l-sec3').parentNode);}

            pgLink();
            search();
            searchBtnEvt();

        }else if(document.body.classList.contains('l-crawler')){
            pgLink();
        }else if(document.body.classList.contains('l-topics')){
            topicLayout();
        }

    };
}
pageLayout();