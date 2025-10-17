jQuery(function ($) {
  // ページトップボタン
  var topBtn = $(".js-pagetop");
  topBtn.hide();

  // ページトップボタンの表示設定
  $(window).scroll(function () {
    if ($(this).scrollTop() > 70) {
      // 指定px以上のスクロールでボタンを表示
      topBtn.fadeIn();
    } else {
      // 画面が指定pxより上ならボタンを非表示
      topBtn.fadeOut();
    }
  });

  // ページトップボタンをクリックしたらスクロールして上に戻る
  topBtn.click(function () {
    $("body,html").animate(
      {
        scrollTop: 0,
      },
      300,
      "swing"
    );
    return false;
  });

  // スムーススクロール (絶対パスのリンク先が現在のページであった場合でも作動。ヘッダーの高さ考慮。)
  $(document).on("click", 'a[href*="#"]', function () {
    let time = 400;
    let header = $("header").innerHeight();
    let target = $(this.hash);
    if (!target.length) return;
    let targetY = target.offset().top - header;
    $("html,body").animate({ scrollTop: targetY }, time, "swing");
    return false;
  });

  // ハンバーガーメニュー
  $(".js-hamburger").on("click", function () {
    $(this).toggleClass("is-active");
    $(".js-drawer").toggleClass("is-active");
    // 現在のbodyタグのoverflowスタイルを確認
    if ($("body").css("overflow") === "hidden") {
      // もしoverflowがhiddenなら、bodyのスタイルを元に戻す
      $("body").css({ height: "", overflow: "" });
    } else {
      // そうでなければ、bodyにheight: 100%とoverflow: hiddenを設定し、スクロールを無効にする
      $("body").css({ height: "100%", overflow: "hidden" });
    }
  });

  // Swiper
  const swiper = new Swiper(".swiper", {
    // オプション
    direction: "horizontal", // 水平スライダー
    loop: true, // ループ有効化
    speed: 10000,
    autoplay: {
      delay: 0, // 自動再生の遅延を0ミリ秒に設定（すぐに次のスライドに移動）
      disableOnInteraction: false, // ユーザーがスライドを操作しても自動再生を停止しない
    },
    slidesPerView: 1.69,
    spaceBetween: 20,
    breakpoints: {
      768: {
        slidesPerView: 5.7,
        spaceBetween: 29,
      },
    },
  });

  // アコーディオンメニュー
  function setAccordion() {
    if ($(window).width() <= 767) {
      // イベントを一旦解除して再登録（重複防止）
      $(".js-accordion")
        .off("click")
        .on("click", function () {
          $(".p-header__nav-btn").toggleClass("is-active");
          $(this).next(".p-header__dropmenu").slideToggle();
        });
    } else {
      // PC時はイベント削除＋ドロップメニューを閉じておく
      $(".js-accordion").off("click");
      $(".p-header__nav-btn").removeClass("is-active");
      $(".p-header__dropmenu").removeAttr("style"); // slideToggleの影響をリセット
    }
  }

  // 初回実行
  setAccordion();

  // リサイズ時にも再チェック（頻繁な発火を防ぐために少し遅延）
  let resizeTimer;
  $(window).on("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      setAccordion();
    }, 200);
  });

  // フェードイン
  $(document).ready(function () {
    $(window).scroll(function () {
      const scroll = $(window).scrollTop(); // スクロール量
      const windowHeight = $(window).height(); // 画面の高さ
      const footerTop = $("footer").offset().top; // フッターの上端位置
      const btnHeight = $(".p-fadein-btn").outerHeight(); // ボタンの高さ（被り防止）
      const fadeOutMargin = 50; // 少し手前で消す調整値（任意）

      // ヘッダーの色変更対象をまとめて指定
      const colorChengeLists = $(
        ".p-header, .p-header__logo-text, .p-header__nav-item, .p-header__nav-link"
      );

      // ==============================
      // p-fadein-btn & ヘッダー色制御
      // ==============================
      if (scroll > 50) {
        // ヘッダー：一度スクロールしたら常にactive
        colorChengeLists.addClass("is-active");

        // ボタン：フッター手前でフェードアウト
        if (scroll + windowHeight < footerTop - btnHeight - fadeOutMargin) {
          $(".p-fadein-btn").addClass("is-active");
        } else {
          $(".p-fadein-btn").removeClass("is-active");
        }
      } else {
        // ページ上部に戻ったらすべて解除
        $(".p-fadein-btn").removeClass("is-active");
        colorChengeLists.removeClass("is-active");
      }

      // ==============================
      // p-fadeout-btn の制御（例：別ボタン）
      // ==============================
      if (scroll > 50) {
        $(".p-fadeout-btn").addClass("is-active");
      } else {
        $(".p-fadeout-btn").removeClass("is-active");
      }

      // ==============================
      // フェードイン要素
      // ==============================
      $(".js-fadeIn").each(function () {
        const boxHeight = $(this).offset().top;
        if (scroll + windowHeight - windowHeight * 0.05 > boxHeight) {
          $(this).addClass("is-show");
        }
      });
    });

    // 初期状態でも判定
    $(window).scroll();
  });

  // バリデーションチェック
  $("#submit").on("click", function (event) {
    const values = {
      address: $("#address").val(),
      name: $("#name").val(),
      ruby: $("#ruby").val(),
      tell: $("#tell").val(),
      email: $("#email").val(),
      year: $("#attending-desired-year").val(),
      month: $("#attending-desired-month").val(),
    };
    // 正規表現まとめ
    const regex = {
      address: /^.+$/,
      name: /^[\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF]+\u3000[\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF]+$/,
      ruby: /^[\u30A0-\u30FF]+\u3000[\u30A0-\u30FF]+$/,
      tell: /^0\d{1,4}-\d{1,4}-\d{4}$/,
      email:
        /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/,
    };

    // 必須チェック（ラジオ・チェックボックス）
    const requiredChecks = [
      {
        selector: 'input[name="personaly"]',
        errorText: ".js-text-personaly",
        container: "#personaly",
        message: "【必須】個人情報保護方針に同意をお願いします。",
      },
    ];

    // セレクトタグチェック（年・月）
    const selectChecks = [
      {
        id: "#attending-desired-year",
        errorText: ".js-text-attending-year",
        message: "【必須】受講希望の年を選択してください。",
      },
      {
        id: "#attending-desired-month",
        errorText: ".js-text-attending-month",
        message: "【必須】受講希望の月を選択してください。",
      },
    ];

    // 入力チェック（テキスト）
    const inputChecks = [
      {
        id: "#address",
        value: values.address,
        regex: regex.address,
        errorText: ".js-text-address",
        message: "【必須】住所を入力してください。",
      },
      {
        id: "#name",
        value: values.name,
        regex: regex.name,
        errorText: ".js-text-name",
        message: "【必須】名前を入力してください。",
      },
      {
        id: "#ruby",
        value: values.ruby,
        regex: regex.ruby,
        errorText: ".js-text-ruby",
        message: "【必須】カタカナで入力してください。",
      },
      {
        id: "#tell",
        value: values.tell,
        regex: regex.tell,
        errorText: ".js-text-tell",
        message: "【必須】正しい電話番号の形式で入力ください。",
      },
      {
        id: "#email",
        value: values.email,
        regex: regex.email,
        errorText: ".js-text-email",
        message: "【必須】正しいメールアドレスの形式で入力ください。",
      },
    ];

    // 共通処理: ラジオ・チェックボックス
    requiredChecks.forEach(({ selector, errorText, container, message }) => {
      if ($(selector + ":checked").length) {
        $(errorText).text("");
        $(container).removeClass("error");
      } else {
        event.preventDefault();
        $(errorText).text(message);
        $(container).addClass("error");
      }
    });

    // 共通処理: セレクトタグ
    selectChecks.forEach(({ id, errorText, message }) => {
      const val = $(id).val();
      if (!val) {
        event.preventDefault();
        $(errorText).text(message);
        $(id).addClass("error");
      } else {
        $(errorText).text("");
        $(id).removeClass("error");
      }
    });

    // 共通処理: 入力テキスト
    inputChecks.forEach(({ id, value, regex, errorText, message }) => {
      if (regex.test(value)) {
        $(errorText).text("");
        $(id).removeClass("error");
      } else {
        event.preventDefault();
        $(errorText).text(message);
        $(id).addClass("error");
      }
    });

    // 最初のエラーまでスクロール
    $(".error")[0]?.scrollIntoView({ behavior: "smooth", block: "center" });
  });
});
