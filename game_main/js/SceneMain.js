/*
 * メインシーン
 */
phina.define("SceneMain", {
  // 継承
  superClass: "DisplayScene",
  // コンストラクタ
  init: function(param) {
    console.log("SceneMainクラスinit");
    // 親クラス初期化
    this.superInit();
    // 背景スプライト
    this.mainwindow = Sprite("mainwindow").addChildTo(this);
    this.mainwindow.setPosition(this.gridX.center(), this.gridY.center());
    // メイン画面設定
    GameMain = this;
    // スプライトグループ
    this.background = DisplayElement().addChildTo(this);
    this.characterGroup = DisplayElement().addChildTo(this);
    this.buttonGroup = DisplayElement().addChildTo(this);
    // Xボタン描画
    this.drawXButton();
    // スタートボタン描画
    this.drawStartButton();
    // 正解数カウント
    this.correct_cnt = 0;
  },
  // 画面更新
  update: function(app) {
    // プレイヤー更新
    if (app.frame % UPDATE_FRAME == 0) {
      //console.log("update_frame：" + app.frame);
    };
  },
  // Xボタン描画
  drawXButton: function() {
    //console.log("SceneMainクラスdrawXButton");
    let xbutton = SpriteButtonX(
      "000", SCREEN_WIDTH - BUTTON_SIZE / 2, BUTTON_SIZE / 2
    ).addChildTo(this.background);
    //console.log(this.xbutton.x + "/" + this.xbutton.y);
    // Xボタン押下時の処理
    xbutton.sprite.setInteractive(true);
    xbutton.sprite.onpointstart = function() {
      console.log("xbutton.onpointstart");
      this.exit("Exit");
    }.bind(this);
  },
  // スタートボタン描画
  drawStartButton: function() {
    //console.log("SceneMainクラスdrawStartButton");
    let startbutton = SpriteButtonStart(
      "000", SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2
    ).addChildTo(this.buttonGroup);
    // スタートボタン押下時の処理
    startbutton.sprite.setInteractive(true);
    startbutton.sprite.onpointstart = function() {
      console.log("startButton.onpointstart");
      startbutton.removeSprite();
      // 枠とキャラクターの描画
      this.drawCharactor();
    }.bind(this);
  },
  // ゴールボタン描画
  drawGoalButton: function() {
    //console.log("SceneMainクラスdrawGoalStartButton");
    let goalbutton = SpriteButtonGoal(
      "000", SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2
    ).addChildTo(this.buttonGroup);
    // ゴールボタン押下時の処理
    goalbutton.sprite.setInteractive(true);
    goalbutton.sprite.onpointstart = function() {
      console.log("goalButton.onpointstart");
      goalbutton.removeSprite();
      // 枠とキャラクターの描画
      this.drawCharactor();
    }.bind(this);
  },
  // 枠とキャラクターの描画
  drawCharactor: function() {
    //console.log("SceneMainクラスdrawCharactor");
    this.characterGroup.children.length = 0;
    let sprite_sheet_name = [];
    sprite_sheet_name[0] = SPRITE_SHEET + "_shape";
    sprite_sheet_name[1] = SPRITE_SHEET;
    let keys = Object.keys(ASSETS.spritesheet[SPRITE_SHEET].animations);
    shuffleArray(keys);
    let index = 0;
    for (let i = 0; i < 2; i++) {
      for (let array_no = 0; array_no < CHARACTER_TOTALNUM; array_no++) {
        let animations = zeroPadding(keys[array_no], 3);
        // 枠（i=0）・キャラクター（i=1）
        let obj = SpriteCharacter(
          sprite_sheet_name[i], animations, SCREEN_WIDTH/2, SCREEN_HEIGHT/2, index
        ).addChildTo(this.characterGroup);
        let cnt = 0;
        do {
          obj.moveRandom();
          if (cnt++ > RELOCATION_TIMES) {
            console.log("cnt = ", RELOCATION_TIMES);
            break;
          }
        } while (obj.initHitCheck());
        // クリックした際の処理（キャラクターのみ）
        listSemaphore[index] = 0;
        if (i>0) {
          obj.sprite.setInteractive(true);
          // クリック開始側の処理
          obj.sprite.on('pointstart', function(e) {
            getSemaphore(obj);
          });
          obj.sprite.on('pointstay', function(e) {
            getSemaphore(obj);
          });
          obj.sprite.on('pointover', function(e) {
            getSemaphore(obj);
          });
          obj.sprite.on('pointmove', function(e) {
            //console.log("obj.index / listSemaphore[obj.index]", obj.index, listSemaphore[obj.index]);
            getSemaphore(obj);
            // ドラッグ処理はレイヤーが一番手前のspriteのみ
            if (listSemaphore[obj.index] == 1) {
              obj.sprite.x += e.pointer.dx;
              obj.sprite.y += e.pointer.dy;
              if (obj.matchCheck()) {
                this.correct_cnt++;
                console.log("this.correct_cnt", this.correct_cnt);
                if (this.correct_cnt == CHARACTER_TOTALNUM) {
                  this.correct_cnt = 0;
                  this.drawGoalButton();
                }
              }
            }
          }.bind(this));
          // クリック終了側の処理
          obj.sprite.on('pointend', function(e) {
            releaseSemaphore(obj);
          });
          obj.sprite.on('pointout', function(e) {
            releaseSemaphore(obj);
          });

        }
        index++;
      }
    }
  },
  // プレイヤーオブジェクト消去
  erasePlayers: function() {
    //console.log("SceneMainクラスerasePlayers");
    //this.buttonGroup.children.length = 0;
  }
});
