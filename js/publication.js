
$(document).ready(function(){
    $.getJSON( "contents/publications.json", function( data ) {
        $.each( data, function( type, papers ) {
            var $pubType = $("<h1/>").addClass("pub-type pl-2").append(type);
            $("<div/>").addClass("section pub-section mt-3").append($pubType).appendTo("#main");
            $("<ul/>").addClass("publication").appendTo("#main");
            $.each(papers, function(index, paper){
                var paperId = type[0] + (papers.length - index);
                var $anchor = $("<a/>").attr("name", paperId);
                var $item = $("<li/>").attr("id", paperId);
                $anchor.appendTo($item);
                if (paper.url != "")
                    $("<h4/>").addClass("pub-title").append(paper.title+"<a href='" + paper.url + "'target='_parent'>" + " [download]" + "</a>").appendTo($item);
                else
                    $("<div/>").addClass("pub-title").append(paper.title).appendTo($item);
                var authors = [];
                $.each(paper.authors, function(akey, aval){
                    if (aval == "Minchul Cha" || "Min Chul Cha"){
                        authors.push("<span class='author'>" + aval + "</span>");
                    } else {
                        authors.push(aval);
                    }
                });
                $("<div/>").addClass("authors").append(authors.join(", ")).appendTo($item);
                $("<span/>").addClass("venue").append(paper.venue + " ").appendTo($item);
                $("<span/>").addClass("year").append("("+paper.year + ") ").appendTo($item);
                if (paper.toappear){
                    $("<span/>").addClass("toappear").append(paper.toappear).appendTo($item);
                }
                if (paper.award){
                    $("<span/>").addClass("award").append(paper.award).appendTo($item);
                }
                if (paper.materials){
                    $.each(paper.materials, function(mkey, mval){
                        $("<span/>").addClass("material").append("| <a href='" + mval.url + "'target='_blank'>" + mval.type + " </a>").appendTo($item);
                    });
                }
                $(".publication").last().append($item);
            });
        });

        // process pound sign now.
        if(window.location.hash) {
            var hash = window.location.hash.substring(1); // Puts hash in variable, and removes the # character
            $("#" + hash)
                .addClass("anchored");
            console.log(hash, $("#" + hash).offset().top);
            $(document).scrollTop($("#" + hash).offset().top);
        }
    });
});
