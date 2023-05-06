enchant();

window.onload = function () {
    const game = new Game(400, 500); //画面サイズを400*500にする。（このサイズだとスマホでも快適なのでおススメ）

    /////////////////////////////////////////////////
    //ゲーム開始前に必要な画像・音を読み込む部分

    const imgUrls = [];
    imgUrls.push("");
    for (let i = 1; i <= 13; i++) {
        const imgUrl = `image/image${i}.png`;
        imgUrls.push(imgUrl);
    }
    game.preload(imgUrls);

    //読み込み終わり
    /////////////////////////////////////////////////

    game.onload = function () {
        //ロードが終わった後にこの関数が呼び出されるので、この関数内にゲームのプログラムを書こう

        /////////////////////////////////////////////////
        //グローバルで値が変更しうる変数群
        let score = 0; //スコア
        let meteors = []; //隕石スプライトを管理する配列
        let left = 0;
        let right = 0;
        let acc = 0;
        let height = 0;

        //グローバル変数終わり
        /////////////////////////////////////////////////

        // mainSceneを画面にセットする関数
        const setMainScene = function () {
            const mainScene = new Scene(); //シーン作成
            game.pushScene(mainScene); //mainSceneシーンオブジェクトを画面に設置
            mainScene.backgroundColor = "grey"; //mainSceneシーンの背景は黒くした
            const backImg = new Sprite(400, 500);			//画像サイズ
	    	backImg.moveTo(0, 0);							//位置
		    backImg.image = game.assets[imgUrls[11]];	//読み込む画像の相対パスを指定。　事前にgame.preloadしてないと呼び出せない
		    mainScene.addChild(backImg);	

            // グローバル変数の初期化
            score = 0; // スコアの初期化を行う
            meteors = []; //登場している隕石配列を空にする
            left = 0;
            right = 0;
            acc = 0;
            height = 0;
            leftfiresize = 0.5;
            rightfiresize = 0.5;

            //テキスト
            const scoreText = new Label(); //テキストはLabelクラス
            scoreText.font = "20px Meiryo"; //フォントはメイリオ 20px 変えたかったらググってくれ
            scoreText.color = "rgba(255,255,255,1)"; //色　RGB+透明度　今回は白
            scoreText.width = 400; //横幅指定　今回画面サイズ400pxなので、width:400pxだと折り返して二行目表示してくれる
            scoreText.moveTo(0, 30); //移動位置指定
            mainScene.addChild(scoreText); //mainSceneシーンにこの画像を埋め込む

            scoreText.text = "現在の高度：" + height + "km"; //テキストに文字表示 scoreは変数なので、ここの数字が増える

		    

            ///////////////////////////////////////////////////
            //メインループ　ここに主要な処理をまとめて書こう
            mainScene.time = 0; //mainScene内で使用するカウント用変数
            mainScene.onenterframe = function () {
                scoreText.text = "現在の高度：" + height + "km"; //テキストに文字表示 scoreは変数なので、ここの数字が増える
                this.time++; //毎フレームカウントを１増やす
                if (this.time >= 20 ) {
                    //カウントが６０-scoreを超えたら
                    this.time = 0;

                    const meteor = new Sprite(64, 64); //隕石を配置
                    meteor.image = game.assets[imgUrls[5]]; //隕石画像
                    meteor.y = -64; //出現Y座標
                    meteor.x = Math.random() * 336; //出現X座標
                    meteor.tl.scaleTo(0.5+meteor.x%4/3,0.5+meteor.x%4/3,0); //ランダムにサイズを変更
                    meteor.id = new Date().getTime().toString(16) + Math.random().toString(16); // bombに乱数と時刻を用いたユニークな固有idを代入する(uuidといいます)
                    mainScene.addChild(meteor); //mainSceneシーンに追加
                    meteor.number = meteors.length; //自分がmeteorsのどこにいるか覚えておく(削除するときに使う)
                    meteors.push(meteor); //meteors（隕石管理用配列）に格納
                    meteor.onenterframe = function () {
                        //隕石の動作
                        this.y += (3 + 10*meteor.x%5); //下に降りる
                        if (this.y >= 500) {
                        //画面下に入ったら
                        meteor.parentNode.removeChild(meteor); //隕石をmainSceneから外す
                        meteors = meteors.filter((m) => m.id !== meteor.id); // meteorsという配列に今回削除したmeteorを消した配列を再代入する
                        //    game.popScene(); //mainSceneシーンを外して
                        //    setEndScene(); // endSceneを呼び出す
                        }
                        if (this.frame == 15) this.frame = 0;
                        //フレームを動かす処理
                        else this.frame++; //もし3フレーム以内なら次のフレームを表示
                    };
                }
                height ++;
            };

            ///////////////////////////////////////////////////


            
            //下オーラ
            const underfire = new Sprite(100, 100); //自機のサイズのspriteを宣言（数字は縦横サイズ）
            underfire.image = game.assets[imgUrls[9]]; //下オーラ画像
            underfire.moveTo(150, 400); //自機の位置
            mainScene.addChild(underfire); //mainSceneシーンに貼る

            //左オーラ
            const leftfire = new Sprite(100, 50); //自機のサイズのspriteを宣言（数字は縦横サイズ）
            leftfire.image = game.assets[imgUrls[12]]; //下オーラ画像
            leftfire.moveTo(150, 350); //自機の位置
            mainScene.addChild(leftfire); //mainSceneシーンに貼る

            //右オーラ
            const rightfire = new Sprite(100, 50); //自機のサイズのspriteを宣言（数字は縦横サイズ）
            rightfire.image = game.assets[imgUrls[13]]; //下オーラ画像
            rightfire.moveTo(150, 350); //自機の位置
            mainScene.addChild(rightfire); //mainSceneシーンに貼る

            //自機
            const okina = new Sprite(100, 100); //自機のサイズのspriteを宣言（数字は縦横サイズ）
            okina.image = game.assets[imgUrls[3]]; //自機画像
            okina.moveTo(150, 300); //自機の位置
            mainScene.addChild(okina); //mainSceneシーンに貼る
            //okina.time = 0; //Sin波で自機を左右に移動させるので、カウントが必要

            


            okina.onenterframe = function () {

                //左ボタン
    	    	const leftbutton = new Sprite(60, 60);			//画像サイズ
	        	leftbutton.moveTo(40, 420);						//ボタンの位置
	        	leftbutton.image = game.assets[imgUrls[7]];	//読み込む画像の相対パスを指定
	    	    mainScene.addChild(leftbutton);					//mainSceneにこの画像を貼り付ける
                //右ボタン
	        	const rightbutton = new Sprite(60, 60);			//画像サイズ
	        	rightbutton.moveTo(300, 420);						//ボタンの位置
	        	rightbutton.image = game.assets[imgUrls[8]];	//読み込む画像の相対パスを指定
	        	mainScene.addChild(rightbutton);					//mainSceneにこの画像を貼り付ける

                leftfire.tl.scaleTo(leftfiresize,leftfiresize,0);
                rightfire.tl.scaleTo(rightfiresize,rightfiresize,0);

            //　左右移動
                leftbutton.ontouchstart = function() {
                   left = 1;
                };
                leftbutton.ontouchend = function() {
                    left = 0;
                };
                rightbutton.ontouchstart = function() {
                    right = 1;
                };
                rightbutton.ontouchend = function() {
                    right = 0;
                };

                if (left == 1){
                    if (this.x <= 290) {
                        acc += 0.7;                        
						leftfiresize = 1;						
                    }else{
                        acc = 0;                        
                    };
                }else{
                    if (leftfiresize > 0.5){
                        leftfiresize -= 0.2;
                    }
                }
                if (right == 1){
                    if (this.x >= 10) {
                        acc -= 0.7;
                        //if(rightfiresize < 1){
						rightfiresize = 1;
						//};
                    }else{
                        acc = 0;                        
                    };
                }else{
                    if(rightfiresize > 0.5){
                        rightfiresize -= 0.2;
                    }
                }
                

                if(this.x <= 300 && this.x >= 0){
                    this.x += acc; 
                }else{
                    acc = 0;
                    if(this.x > 300){
                        this.x = 300;
                    }else{
                        this.x = 0;
                    };				
                };

                underfire.x = this.x;
                leftfire.x = this.x - 75;
                rightfire.x = this.x + 75;

                //　移動ここまで

                if (this.frame == 7) {
                    this.frame = 0;
                    underfire.frame = 0;
                    leftfire.frame = 0;
                    rightfire.frame = 0;
                        //フレームを動かす処理
                } else {
                    this.frame++; //もし3フレーム以内なら次のフレームを表示
                    underfire.frame++;
                    leftfire.frame++;
                    rightfire.frame++;
                };

                for (const meteor of meteors) {
                    // 隠岐奈と全隕石で円衝突の当たり判定を行う
                    // 円衝突は、二円の中心の距離が一定以下かどうかで判定する
                    // 隠岐奈、隕石は正方形、この正方形の内接円で当たり判定を行う
                    const hitDistance = this.width / 2 + meteor.width*(0.5+meteor.x%4/3) / 2; // ２円の半径を足した値を衝突チェックに使用する
                    const bombCenter = { x: this.x + 50, y: this.y + 50 }; // 隠岐奈の中心点
                    const meteorCenter = { x: meteor.x + 32, y: meteor.y + 32 }; // 隕石の中心点
                    const distance = Math.sqrt((bombCenter.x - meteorCenter.x) ** 2 + (bombCenter.y - meteorCenter.y) ** 2); // 二点の距離を三平方の定理から求めている
                    if (distance < hitDistance - 40) {
                        // 当たり判定  二点の距離が二円の半径の和より短ければその円は衝突している
                        const effect = new Sprite(16, 16); //爆発エフェクト
                        effect.moveTo(this.x, this.y); //隠岐奈と同じ位置に爆発エフェクトを設置
                        mainScene.addChild(effect); //mainSceneシーンに表示
                        effect.image = game.assets[imgUrls[6]]; //爆発画像
                        effect.onenterframe = function () {
                            // 爆発は毎フレームで画像を切り替えるの絵処理している
                            if (this.frame >= 5) this.parentNode.removeChild(this);
                            // 最後フレームまで表示したら画面から消滅する
                            else this.frame++; //そうでなかったら、フレームを１増やす
                        };
                        game.popScene(); //mainSceneシーンを外して
                        setEndScene(); // endSceneを呼び出す
                        
                        meteor.parentNode.removeChild(meteor); //隕石をmainSceneから外す
                        this.parentNode.removeChild(this); //thisは隠岐奈なので、隠岐奈を消す
                        underfire.parentNode.removeChild(underfire); //thisは隠岐奈なので、隠岐奈を消す
                        meteors = meteors.filter((m) => m.id !== meteor.id); // meteorsという配列に今回削除したmeteorを消した配列を再代入する
                        return;
                    }
                }


            };

            game.pushScene(mainScene); //mainSceneを画面に貼り付ける
        };

            

        // endSceneを画面にセットする関数
        const setEndScene = function () {
            ////////////////////////////////////////////////////////////////
            //結果画面
            const endScene = new Scene(); //endScene定義
            endScene.backgroundColor = "blue"; // 背景は青
            const gameoverImg = new Sprite(400, 500);			//画像サイズ
	    	gameoverImg.moveTo(0, 0);							//位置
		    gameoverImg.image = game.assets[imgUrls[10]];	//読み込む画像の相対パスを指定。　事前にgame.preloadしてないと呼び出せない
		    endScene.addChild(gameoverImg);						//endSceneにこの画像を貼り付ける
            endScene.onenterframe = function () {
                gameoverText.text = "今回の到達高度：" + height + "km";
            };

            //GAMEOVERというテキスト
            const gameoverText = new Label(); //テキストはLabelクラス
            gameoverText.font = "20px Meiryo"; //フォントはメイリオ 20px 変えたかったらググってくれ
            gameoverText.color = "rgba(255,255,255,1)"; //色　RGB+透明度　今回は白
            gameoverText.width = 400; //横幅指定　今回画面サイズ400pxなので、width:400pxだと折り返して二行目表示してくれる
            gameoverText.moveTo(0, 30); //移動位置指定
            endScene.addChild(gameoverText); //S_ENDシーンにこの画像を埋め込む

            //リトライボタン
            const retryBtn = new Sprite(140, 40); //画像サイズをここに書く。使う予定の画像サイズはプロパティで見ておくこと
            retryBtn.moveTo(30, 440); //コインボタンの位置
            retryBtn.image = game.assets[imgUrls[2]]; //読み込む画像の相対パスを指定。　事前にgame.preloadしてないと呼び出せない
            endScene.addChild(retryBtn); //mainSceneにこのコイン画像を貼り付ける

            retryBtn.ontouchend = function () {
                //retryBtnをタッチした（タッチして離した）時にこの中の内容を実行する
                game.popScene(); //現在セットしているシーンを外す
                setMainScene(); //メインシーンに移行する
            };

            //ツイートボタン
            const tweetBtn = new Sprite(140, 40); //画像サイズをここに書く。使う予定の画像サイズはプロパティで見ておくこと
            tweetBtn.moveTo(230, 440); //コインボタンの位置
            tweetBtn.image = game.assets[imgUrls[1]]; //読み込む画像の相対パスを指定。　事前にgame.preloadしてないと呼び出せない
            endScene.addChild(tweetBtn); //mainSceneにこのコイン画像を貼り付ける

            tweetBtn.ontouchend = function () {
                //tweetBtnボタンをタッチした（タッチして離した）時にこの中の内容を実行する
                //ツイートＡＰＩに送信
                //結果ツイート時にURLを貼るため、このゲームのURLをここに記入
                const url = encodeURI("https://twitter.com/hothukurou"); //きちんとURLがツイート画面に反映されるようにエンコードする
                window.open("http://twitter.com/intent/tweet?text=今回の到達高度は" + height + "km&hashtags=ロケット隠岐奈&url=" + url); //ハッシュタグにahogeタグ付くようにした。
            };

            game.pushScene(endScene); // endSceneを画面に貼り付ける
        };

        // ゲーム最初はmainSceneを表示させたいので、setMainScene関数を呼び出す
        setMainScene();
    };
    game.start();
};
