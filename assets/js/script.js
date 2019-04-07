//                  CLASSES
class Question {
    constructor(text, img, answers, round) {
        this.text = text;
        this.answers = answers;
        this.score = score;
        this.round = round;
        this.isAsked = false;
    }
}

class QuestionService {
    constructor() {
        this.questionList = [];
        this.round = 1;
        this.questionCountForRound = 1;
        this.rounds = [
            { 1: 10 },
            { 2: 15 }
        ]

    }
    setQuestionCountForRound(count) {
        this.questionCountForRound = count;
    }
    
    getRandomQuestion() {
        let index = Math.floor(Math.random() * (this.questionList.length));
        while (this.questionList[index].isAsked) {
            if (this.questionList.length < this.questionCountForRound) {
                return;
            }
            index = Math.floor(Math.random() * (this.questionList.length));
        }
        this.questionList[index].isAsked = true;
        this.questionCountForRound++;
        return this.questionList[index]
    }

    fillAnswersAndQuestion(question) {
        var variantTexts = $(".variant-text");
        var variants = $(".variant");
        $(".variant-text").html("")
        $(".question-text").html(question.text)
        for (let j = 0, i = 0; j < question.answers.length; j++ , i++) {
            for (let k in question.answers[j]) {
                $(variantTexts[i]).html(k)
            }
            $(variants[i]).css({
                "background": "#fff"
            })
        }
    }
}


//                  CLASSES

var userExpected = false;
var question;
var questionsService = new QuestionService();
var url = "./questions.json";
var timer = $(".timer");
var timeIndex;
var questionCount = 1;
var answerIndex=null;
var score;

var correctAnswer;
$(".question-image").attr("src", "./assets/images/favico.png")


function won() {
    $(".result-is-correct").html("Correct!")
    $(".result-is-correct").css({
        "color": "green"
    });
    $(".description").hide();
    if(userExpected)
     correctAnswersCount++;
    popupInfo();
    $(".your-total-score").html(score + question.score)

}
var correctAnswersCount = 0;
var wrongAnswersCount = 0;
var unanswersCount = 0;

function lost() {
    $(".result-is-correct").html("Nope!")
    $(".result-is-correct").css({
        "color": "blue"
    });
    $(".description").show()
    $(".result-text").html(getCorrectAnswer());
    if (userExpected)
        wrongAnswersCount++;
    popupInfo();
    $(".your-total-score").html(score)
}


function popupInfo() {
    $(".result-img").show()
    $(".time-remaining").html($(".timer").html())
    $(".timer").html("30")
    score = parseInt($(".your-total-score").html())
    $(".overlay").css({
        "visibility": "visible",
        "opacity": 1
    })

    $(".correct-answer-subtitle").hide()
    $(".wrong-answer-subtitle").hide()
    $(".unanswered-subtitle").hide()
    $(".start-over").hide()


    getGif();
    clearInterval(timeIndex);
    return;
}
function unanswered(){
    $(".result-is-correct").html("Unanswered question!")
    $(".result-is-correct").css({
        "color": "yellow"
    });
    $(".description").show()
    $(".result-text").html(getCorrectAnswer());
    if (!userExpected&&answerIndex==null)
        unanswersCount++;
    popupInfo();
    $(".your-total-score").html(score)
}

function endGame() {
    $(".result-img").hide();
    $(".overlay").css({
        "visibility": "visible",
        "opacity": 1
    })
    $(".time-remaining").html($(".timer").html())
    $(".description").hide()

    $(".correct-answer-subtitle").show()
    $(".wrong-answer-subtitle").show()
    $(".unanswered-subtitle").show()
    $(".start-over").show()


    $(".correct-answers").html(correctAnswersCount)
    $(".wrong-answers").html(wrongAnswersCount)
    $(".unanswered").html(unanswersCount)

    $(".result-is-correct").html("All done, here how you did!")
    $(".result-is-correct").css({
        "color": "blue"
    });
    $(".result-text").hide();
    $(".your-total-score").html(score)
}

$(document).on("click", ".start-over", function () {
    reset();

})
function reset() {
    score = 0;
    questionCount=0;
    audio.pause();

    audio = new Audio("./assets/musics/start.mp3");
     audio.play();
     clearInterval(timeIndex)
    $(".question-header-title-num").html(questionCount)
    $(".your-total-score").html(score)

    $(".overlay").css({
        "visibility": "hidden",
        "opacity": 0
    })
    $(".correct-answer-subtitle").hide()
    $(".wrong-answer-subtitle").hide()
    $(".unanswered-subtitle").hide()
    $(".start-over").hide()

    $(".result-text").show();
    $(".result-text").html("");
    questionsService.setQuestionCountForRound(-1);
    for (let i in questionsService.questionList) {
        questionsService.questionList[i].isAsked = false;
    }

    getNext();

}
function outOfTime() {
    $(".result-is-correct").html("Out Of Time!")
    $(".result-is-correct").css({
        "color": "red"
    });
    unanswersCount++;

    popupInfo();

}


function getCorrectAnswer() {
    for (let i in question.answers) {
        for (let j in question.answers[i]) {
            if (question.answers[i][j]) {
                return j;
            }
        }
    }
    return null;
}

function getCorrectAnswerIndex() {
    for (let i in question.answers) {
        for (let j in question.answers[i]) {
            if (question.answers[i][j]) {
                return i;
            }
        }
    }
}

function timerDecrement() {
    let timerText;
    timeIndex = setInterval(function () {
        timeText = parseInt($(".timer").html())
        if (timeText > 0) {
            $(".timer").html(timeText - 1);
        } else {       
                correctAnswer = getCorrectAnswer();
                $(".result-text").html(correctAnswer);
                outOfTime();
                getNext();
        }

    }, 1000)
}
var queryUrl = "http://api.giphy.com/v1/gifs/search";
function getGif() {
    correctAnswer = getCorrectAnswer();
    
    $.ajax({
        url: queryUrl,
        method: 'GET',
        data: {
            q: correctAnswer,
            api_key: "KYdQSedGXNiYL4PhZ7QI2qkw8ALEKNAS",
            limit: 1
        }
    }).done(function (response) {
        $(".result-img").attr("src", response.data[0].images.original.url);
    })
}

$.getJSON(url).then(function (data) {
    clearInterval(timeIndex);
    for (let i in data) {
        questionsService.questionList.push(data[i]);
    }
    question = questionsService.getRandomQuestion();
    questionsService.fillAnswersAndQuestion(question);
    $(".question-header-title-num").html(questionCount)
    timerDecrement();

})



//                  EVENTS
var audio = null;
$(document).ready(function () {

    audio = new Audio("./assets/musics/start.mp3");
     audio.play();

})
function getNext() {
    $(".time-remaining").html($(".timer").html())
    $(".timer").html("30")
    $(".overlay").css({
        "opacity": 0,
        "visibility": "hidden"
    })
    questionCount++;
    $(".question-header-title-num").html(questionCount)
    userExpected = false;
    answerIndex=null
    question = questionsService.getRandomQuestion()
    if (question != null) {
        questionsService.fillAnswersAndQuestion(question)
        timerDecrement()
    } else {
        endGame();

    }

}

//  EVENTS for buttons

$(document).on("click", ".submit-btn", function () {

    let correctAns = parseInt(getCorrectAnswerIndex()) + 1;
    if (correctAns === answerIndex&userExpected) {
        won();
    } else if(answerIndex==null) {
        unanswered();
       
    }else {
        lost();
    }
})




$(document).on("click", ".close", function () {
    getNext();
})





//                  EVENTS for variants

$(document).on("click", ".variant", function () {
 
    let variants = $('.variant');
    answerIndex = parseInt($(this).html());
    if ($(this).data("clicked") == false) {
        for (let i = 0; i < variants.length; i++) {
            if ($(variants[i]).data("clicked") === true) {
                $(variants[i]).css({
                    "background": "#fff"
                })
                $(variants[i]).data("clicked", false);
            }
        }
        userExpected = true;
        $(this).css({
            "background": "red"
        })

        $(this).data("clicked", true)

    } else {
        $(this).css({
            "background": "#fff"
        })
        $(this).data("clicked", false)
        userExpected = false;

    }
})





$(document).on("mouseout", ".variant", function () {
    if ($(this).data("hover") === true && $(this).data("clicked") === false) {
        $(this).data("hover", false);
        $(this).css({
            "background": "#fff"
        })
    } else if ($(this).data("clicked") === true) {
        $(this).css({
            "background": "red"
        })
    }

})

$(document).on("mouseover", ".variant", function () {
    $(this).css({
        "background": "#9DE4AB"
    })

    $(this).data("hover", true);

})




