var request = new XMLHttpRequest();
request.open("GET", "https://nik0spapp.github.io/demos/wmil-sa/examples_demo.json", false);
request.send(null)
var examples = JSON.parse(request.responseText); 

texts = examples['texts'];
weights = examples['weights'];
predicted_labels = examples['predicted'];
actual_labels = examples['actual'];
words = examples['words']
word_weights = examples['word_weights']

Math.seed = function(s) {
    return function() {
        s = Math.sin(s) * 10000; return s - Math.floor(s);
    };
};

var random1 = Math.seed(1234); 
 
function get_random_comment()
{ 
     size = texts.length;
     min = 0;
     max = size; 
     random_id = Math.round(Math.random() * (max - min)) + min;
     return random_id;
}

function show_comment(id)
{
   check_nav(id);
   $('#footer').hide();
   $('#loading').show();
   $('.opt').hide();
   display_comment(id);
   $('#current').html(id);

   setTimeout(function() {
     $('#loading').hide();
     $('#footer').show();
   }, 100);
   
}

function show_wordcloud()
{
    pos = []
    neg = []
     $.each(words, function( idx, word ) {
            red = '255,51,0';
            green = '0,204,0';
            color = red 
            w = parseFloat(Math.round(word_weights[idx] * 100) / 100).toFixed(6);
            
            if(word_weights[idx]*1.0 > 0){
                opacity = (word_weights[idx]/Math.max.apply(Math, word_weights));
                color = green;
                op = parseFloat(Math.round(opacity * 100 * 100) / 100).toFixed(2);
                pos.push("<span style='padding-left:5px;padding-right:5px;font-size:"+((10+op/4))+"px;background-color:rgba("+color+","+opacity+");' title='("+op+"%)'>" + word + "</span> ");
            }
            else{
                color = red;
                opacity = (word_weights[idx]/Math.min.apply(Math, word_weights));
                op = parseFloat(Math.round(opacity * 100 * 100) / 100).toFixed(2);
                neg.push("<span style='padding-left:5px;padding-right:5px;font-size:"+((10+op/4))+"px;background-color:rgba("+color+","+opacity+");' title='("+op+"%)'>" + word + "</span> ");
            }

     });
     $('#positive').html(pos.slice(0,1000).join(''));
     $('#negative').html(neg.reverse().slice(0,1000).join(''));
}

function display_comment(id)
{
    text = texts[id].join(' ');
    sentences = texts[id];  
    text = text.replace(/^"|"$/g,"");
    text = text.replace(/""/g,"\"");
    $('#text').html(text);
    pred = parseFloat(Math.round(predicted_labels[id]*5 * 100) / 100).toFixed(1);
    actual = parseFloat(Math.round(actual_labels[id]*5 * 100) / 100).toFixed(1);
    $('#predicted').html(pred);
    $('#actual').html(actual);
    $.each(sentences, function( index, sentence ) {
        weight = parseFloat(Math.round(weights[id][index] * 100 * 100) / 100).toFixed(1); 
        $('#rec'+(index+1)).parent().show();

        sentence = sentence.replace(/^"|"$/g,"");
        sentence = sentence.replace(/""/g,"\"");
        cur_words = sentence.match(/\w+/g) ;
        if(cur_words != null)
            $.each(cur_words, function( windex, word ) {
               if(words.indexOf(word.toLowerCase()) > -1 )
                {   red = '255,51,0';
                    green = '0,204,0';
                    color = red
                    if(word == 'amp')
                        word = '&amp;'
                    idx = words.indexOf(word.toLowerCase());
                    w = parseFloat(Math.round(word_weights[idx] * 100) / 100).toFixed(6);
                    
                    if(word_weights[idx]*1.0 > 0){
                        opacity = (word_weights[idx]/Math.max.apply(Math, word_weights));
                        color = green;
                    }
                    else{
                        color = red;
                        opacity = (word_weights[idx]/Math.min.apply(Math, word_weights));
                    }
                    op = parseFloat(Math.round(opacity * 100 * 100) / 100).toFixed(2);
                    if( ['d','s','t','m'].indexOf(word) == -1)
                    {
                        var re = new RegExp(word+"(?![a-zA-Z():-=?])","g"); 
                        sentence = sentence.replace(re, "<span style='background-color:rgba("+color+","+opacity+");' title='("+op+"%)'>" + word + "</span>")
                    }
                    else
                    {
                        var re = new RegExp("'"+word,"g"); 
                        sentence = sentence.replace(re, "'<span style='background-color:rgba("+color+","+opacity+");' title='("+op+"%)'>" + word + "</span>")
                    }
                } 
            });

        $('#rec'+(index+1)).html((index+1)+". <b>"+sentence+"</b>");
        $('#rec'+(index+1)+"_id").html(index); 
        $('#rec'+(index+1)+"_percent").html(weight); 
        $('#rec'+(index+1)+"_progress").width(weight+'%'); 
        $('#rec'+(index+1)).parent().removeClass("selected");
    }); 
}

function check_nav(id)
{
    if(id == 0) 
        $('#prev').css('opacity',0.2); 
    else
        $('#prev').css('opacity',1) 

    if(id == (texts.length - 1)) 
        $('#next').css('opacity',0.2) 
    else
        $('#next').css('opacity',1) 

    $('#cur').html( (id + 1) );
    $('#len').html( texts.length ); 
}

$(window).load(function ()
{
    random_id = get_random_comment();
    show_comment(random_id);    
    show_wordcloud();

    $('#random').click(function(){
        random_id = get_random_comment();
        show_comment(random_id);    
    });

    $('#next').click(function(){ 
        id = parseInt($('#current').html());  
        if(texts.length > (id + 1))
        {    
            show_comment(id*1.0 + 1.0)
        }
    });
    $('#prev').click(function(){
        id = $('#current').html(); 
        if(-1 < (id - 1))
        {    
            show_comment(id*1.0 - 1.0)
        }   
    });
    $('#show_words').click(function(){
        $('#words').toggle();
    }); 
});
