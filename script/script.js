console.log("Literary Structure Analysis");



$('#search_by').submit(function(e){
e.preventDefault();
search_val = $( "input:first" ).val();

    searchBy(search_val)
    //console.log(e, );
})

function searchBy(search_val){
    console.log(search_val);
}

var margin = {t:50,r:50,b:50,l:50};
var width = document.getElementById('plot').clientWidth - margin.r - margin.l,
    height = document.getElementById('plot').clientHeight - margin.t - margin.b;

var plot1 = d3.select('#plot')
    .append('svg')
    .attr('width',width+margin.r+margin.l)
    .attr('height',height + margin.t + margin.b)
    .append('g')
    .attr('class','plotty1')
    .attr('transform','translate('+margin.l+','+margin.t+')');

var plot2 = d3.select('#plot2')
    .append('svg')
    .attr('width',width+margin.r+margin.l)
    .attr('height',height + margin.t + margin.b)
    .append('g')
    .attr('class','plotty2')
    .attr('transform','translate('+margin.l+','+margin.t+')');

var scaleX = d3.scale.linear().range([0,height]);


//Start importing data
queue()
    .defer(d3.text,'data/alice_wonderland_carroll.txt')
    .defer(d3.text,'data/looking_glass_carroll.txt')
    .await(dataLoaded)
    

function draw(wonderland, lookingGlass) {


}




function dataLoaded(error, wonderland, lookingGlass){

    //choose book by button -- will program later
    var book_select = wonderland;
    //choose search word by submission -- will program later
    var search_word = "Alice"

    //console.log(wonderland);
    //console.log(lookingGlass);

    //make an array of all words, in chronological order (no punctuation && single white spaces only)
    var No_Punct = book_select.replace(/[^\w\s]|_/gi, "")
                                    .replace(/\s+/gi, " ");
    var Just_Words = No_Punct.split(' ');
    console.log(Just_Words); //array consists of 26000+ words


    //set up for-loop to determine if search word and word in array matches
    for( i = 0; i < Just_Words.length; i++) {

        //conditional statement that draws line when match occurs
        if(search_word == Just_Words[i]) {

            //draw line

        }
    }



    //-----SET UP OBJECT TO HOLD DATA
    var this_book = {name: "Alice in Wonderland",
                    content: book_select
                    }

    //-----BREAKDOWN INTO CHARACTERS, then build back up
    //-----could not make this work
    //console.log(book1.name);

    //console.log(this_book.content);
    var formatted = this_book.content.replace(/\*+/g,"").replace(/\s{2,}/g, "\n")
    //console.log(formatted); //this returns no asterisk or extra space

    var individual = formatted.split('');
    //console.log(individual); // this returns every character in array form


    book1 = {};
    book1.name = this_book.name;
    book1.content = individual;
    book1.content.name = "chapters"
    book1.content.content = individual.join('')
    //console.log(book1);



    //----NESTED ARRAY
    //----Text split by (B)ook, (C)hapter, (P)aragraph, (S)entence, and (W)ord
    //----Access: B == formatted; C == chapters


    //-----MAKING "BOOK" LEVEL OF OBJECT
    
    //removed asterisk picures, then remove formatting so all paragraphs have one line break
    var formatted = wonderland.replace(/\*+/g,"")
                                .replace(/\s{2,}/g, "\n")
    //console.log(formatted);

    // SET UP OBJECT TO HOLD
    book_A = {};
    //book_A.name = "Alice in Wonderland";
    book_A.type = "Book"
    //book_A.author = "Lewis Carroll"
    book_A.text = formatted; //this is a string of the whole book
    book_A.content = {};
    //book_A.value = formatted.length;



    //-----MAKING CHAPTER LEVEL OF OBJECT
    //split by "chapter ??? until next period"
    var chapters = formatted.split(/chapter.+\./gi)
                    chapters.shift();
    //console.log(chapters);

    function split_by_chapter(c) {
        c.split(/chapter.+\./gi);
    };

    //formatted.forEach(split_by_chapter);

    //console.log(formatted);

    book_A.content.type = "Chapter";
    book_A.content.text = chapters;
    book_A.content.content = {};

    //console.log(book_A);

    //returns chapter 2
    //console.log(book_A.content.text[1]);



    //-----MAKING PARAGRAPH LEVEL OF OBJECT

    //split each item of array
    var paragraphs = chapters.forEach( function (p){ p.split(/\n/g) })
    //console.log(paragraphs);

    //split whole text into one "return" for each paragraph
    //var paragraph_fix = wonderland.replace(/\↵+/gi, '↵');
    //console.log (paragraph_fix);


    //make array with each chapter as a separate element
    var chapter_book = wonderland.split(/chapter/gi)
    chapter_book.shift();

    //--prints 12 chapters w/ punctuation
    //console.log(chapter_book);


    // var nest = d3.nest()
    //             .key(function(b) {
    //                 var chapters = b.split(/chapter/gi)
    //                                 .shift();

    //                 return b.chapters
    //             })
    //             .entries(wonderland)
    //             .key(function(c) {

    //             })
    //             .key(function(p) {

    //             })
    //             .key(function(s) {

    //             })

    //console.log(nest);



    //--- Nested Data attempt 2 ------------------------//




    //button functionality
    //switch between two datasets or books when button is clicked
    d3.selectAll('.btn').on('click',function(){
           var type = d3.select(this).attr('id');
            if(type=='Wonderland'){
                draw(wonderland);
            }else{
                draw(lookingGlass);
            }
        });

}

function draw(book){ }
    //console.log(book);
    //console.log(name);

    //data --> 102 element array with all item, year and value
    //creates objects with objects within grouped by date of flight
    // var nestedData = d3.nest()
    //     .key(function(d){
    //         //return d.year
    //         return d.item
    //     })
    //     .entries(data)

    // console.log(nestedData);

    
    // nestedData.forEach(function(t){
        
    //     console.log(t.key);
       
          
    //     plot.append('path')
    //         .attr('class', function(){
    //             if(t.key=='Tea'){
    //                 return 'data-line tea-data-line'
    //             } else {
    //                 return 'data-line coffee-data-line'
    //             }
    //         })
    //         .datum(t.values)
    //         .attr('d', line)

    //     plot.selectAll('d')
    //         .data(t.values)
    //         .enter()
    //         .append('circle')
    //         .attr('class',function(){
    //             if(t.key=='Tea'){
    //                 return 'data-point tea-data-point'
    //             } else {
    //                 return 'data-point coffee-data-point'
    //             }
    //         })
    //         .attr('r',3)
    //         .attr('cx', function(d){return scaleX(d.year);})
    //         .attr('cy', function(d){return scaleY(d.value);})
    //         .call(attachTooltip) 
        


        /*plot.selectAll('drink-line')
        .data(data)
        .enter()
        .append('circle')
        .attr('class','drink-line')
        .attr('cx',function(d){return scaleX(d.year)})
        .attr('cy',function(d){return scaleY(d.value)})
        .attr('r',4)
        .style('fill-opacity',.6);*/

        /*var plotLine = d3.selectAll('path') //yields a selection of 0 <path> elements
            .data(nestedData) //joins to an array of two objects
            .enter()
            .append('path') //creates two new <path> elements as the enter set
            .attr('class', function(input){return input.key}) //each element will have class of either "coffee" or "tea"

        plotLine
            .attr('d', function(item){
                return line(item);
            })
            .attr('stroke-width', '2px')
            .attr('stroke', 'blue');

        /*values is the way to find the array nested in the object identified by key
        t.averageFare = d3.mean(t.values, function(flight) {
                return flight.price
        })

        console.log('avg fare for '+t.key+ ' is '+t.averageFare);*/
    

    /*//SORT nestedData

    nestedData.sort(function(a,b){
        return b.date-a.date;
    })*/

  


    //Do the easy stuff first
    /*plot.selectAll('flight')
        .data(data)
        .enter()
        .append('circle')
        .attr('class','flight')
        .attr('cx',function(d){return scaleX(d.year)})
        .attr('cy',function(d){return scaleY(d.value)})
        .attr('r',4)
        .style('fill-opacity',.6);*/

    /*var timeSeries = 
        d3.selectAll('path') //yields a selection of 0 <path> elements
        .data(data) //joins to an array of two objects
        .enter()
        .append('path') //creates two new <path> elements as the enter set
        .attr('class', function(item){return item.key}) //each element will have class of either "coffee" or "tea"*/



// function attachTooltip(selection){
//     selection
//         .on('mouseenter',function(d){
//             var tooltip = d3.select('.custom-tooltip');
            
//             tooltip
//                 .transition()
//                 .duration(100)
//                 .style('opacity',1);

//             tooltip.select('#item').html(d.item);
//             tooltip.select('#year').html(d.year);
//             tooltip.select('#value').html(d.value);
//         })
//         .on('mousemove',function(){
//             var xy = d3.mouse(canvas.node());
            
//             var tooltip = d3.select('.custom-tooltip');
            
//             tooltip
//                 .style('left',xy[0]+15+'px')
//                 .style('top',(xy[1]+15)+'px');
//         })
//         .on('mouseleave',function(){
//             var tooltip = d3.select('.custom-tooltip')
//                 .transition()
//                 .duration(500)
//                 .style('opacity',0);
//         })
// }


