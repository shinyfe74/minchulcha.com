$(document).ready(function(){
    $.when(
        $.getJSON("contents/publications_international.json"),
        $.getJSON("contents/publications_domestic.json"),
        $.getJSON("contents/publications_dissertation.json")
    ).done(function(international, domestic, dissertation) {
        var data = $.extend({}, international[0], domestic[0], dissertation[0]);
        $.each(data, function(type, entries) {
            if (!Array.isArray(entries)) return; // 잘못된 데이터 구조 방지

            var $pubType = $("<h1/>").addClass("pub-type pl-2").text(type);
            var $section = $("<div/>").addClass("section pub-section mt-3").append($pubType);
            $("#main").append($section);

            var $ul = $("<ul/>").addClass("publication");
            $section.append($ul);

            $.each(entries, function(entryIndex, entry) {
                if (entry.Year) {
                    var $yearHeader = $("<h2/>").addClass("year-header pub-title mt-3").text("[" + entry.Year + "]");
                    $ul.append($yearHeader);
                }
                if (entry.Publication) {
                    $.each(entry.Publication, function(index, paper) {
                        var paperId = type.replace(/[^a-zA-Z0-9]+/g, '_') + "_" + entryIndex + "_" + index;
                        var abstractBoxId = "abstract_" + paperId;
                        var $item = $("<li/>").attr("id", paperId);

                        var icon = '';
                        switch (paper.type) {
                            case 'Paper':
                                icon = '📜 ';
                                break;
                            case 'Conference':
                                icon = '🎙️ ';
                                break;
                            case 'Dissertation':
                                icon = '🎓 ';
                                break;
                            default:
                                icon = '';
                        }

                        if (paper.url) {
                            if (paper.materials && paper.materials.length > 0) {
                                $("<h4/>").addClass("pub-title")
                                    .html(icon + " <a href='" + paper.materials[0].url + "' target='_blank'>" + paper.title + "</a>  <a href='" + paper.materials[0].url + "' target='_blank' class='pub_down'>[download]</a>")
                                    .appendTo($item);
                            } else {
                                $("<h4/>").addClass("pub-title")
                                    .html(icon + paper.title + " <a href='" + paper.url + "' target='_blank' class='pub_down'>[paper]</a>")
                                    .appendTo($item);
                            }
                        } else {
                            $("<div/>").addClass("pub-title").text(icon + paper.title).appendTo($item);
                        }

                        var authors = paper.authors.map(function(name) {
                            return name.includes("Min Chul Cha") ? `<span class='author'>${name}</span>` : name;
                        }).join(", ");
                        $("<div/>").addClass("authors").html(authors).appendTo($item);

                        $("<span/>").addClass("venue").text(paper.venue + " ").appendTo($item);
                        $("<span/>").addClass("year").text("(" + paper.year + ") ").appendTo($item);

                        if (paper.toappear) {
                            $("<span/>").addClass("toappear").text(paper.toappear).appendTo($item);
                        }
                        if (paper.award) {
                            $("<span/>").addClass("award").text(paper.award).appendTo($item);
                        }

                        if (paper.materials) {
                            paper.materials.forEach(function(m) {
                                $("<span/>").addClass("material")
                                    .html(`| <a href='${m.url}' target='_blank' class='pub_down'>${m.type}</a> `)
                                    .appendTo($item);
                            });
                        }

                        // Abstract toggle button & collapsible box (activated when paper.abstract is present)
                        if (typeof paper.abstract === "string" && paper.abstract.trim() !== "") {
                            var $abstractBtn = $("<button/>")
                                .attr("type", "button")
                                .addClass("pub_down pub_abstract_btn")
                                .attr("aria-expanded", "false")
                                .attr("aria-controls", abstractBoxId)
                                .attr("data-target", abstractBoxId)
                                .html('[abstract <i class="fa fa-caret-down"></i>]');

                            $("<span/>").addClass("material")
                                .html("| ")
                                .append($abstractBtn)
                                .appendTo($item);

                            // Collapsible Abstract Box (Initially closed)
                            var $abstractBox = $("<div/>")
                                .addClass("pub-abstract-box")
                                .attr("id", abstractBoxId);

                            var $abstractHeader = $("<div/>").addClass("pub-abstract-header");
                            $("<span/>").addClass("pub-abstract-label")
                                .html('<i class="fa fa-file-text-o"></i> Abstract')
                                .appendTo($abstractHeader);

                            var $closeBtn = $("<button/>")
                                .addClass("pub-abstract-close")
                                .attr("type", "button")
                                .attr("title", "Close abstract")
                                .html("&times;")
                                .appendTo($abstractHeader);

                            $abstractHeader.appendTo($abstractBox);

                            $("<p/>").addClass("pub-abstract-text").text(paper.abstract.trim()).appendTo($abstractBox);

                            if (paper.abstract_source) {
                                $("<a/>").addClass("pub-abstract-source")
                                    .attr("href", paper.abstract_source)
                                    .attr("target", "_blank")
                                    .attr("rel", "noopener noreferrer")
                                    .text("Abstract source")
                                    .appendTo($abstractBox);
                            }

                            // Keywords tags if available
                            if (Array.isArray(paper.keyword) && paper.keyword.length > 0) {
                                var $keywordsRow = $("<div/>").addClass("pub-abstract-keywords");
                                $("<span/>").addClass("pub-abstract-keywords-title").text("Keywords:").appendTo($keywordsRow);
                                paper.keyword.forEach(function(kw) {
                                    $("<span/>").addClass("pub-keyword-tag").text(kw).appendTo($keywordsRow);
                                });
                                $keywordsRow.appendTo($abstractBox);
                            }

                            // Click events for toggle
                            $abstractBtn.on("click", function(e) {
                                e.preventDefault();
                                var isCurrentlyHidden = $abstractBtn.attr("aria-expanded") !== "true";
                                if (isCurrentlyHidden) {
                                    $abstractBox.stop(true, true).slideDown(220);
                                    $abstractBtn.addClass("active")
                                        .attr("aria-expanded", "true")
                                        .html('[abstract <i class="fa fa-caret-up"></i>]');
                                } else {
                                    $abstractBox.stop(true, true).slideUp(200);
                                    $abstractBtn.removeClass("active")
                                        .attr("aria-expanded", "false")
                                        .html('[abstract <i class="fa fa-caret-down"></i>]');
                                }
                            });

                            $closeBtn.on("click", function(e) {
                                e.preventDefault();
                                $abstractBox.stop(true, true).slideUp(200);
                                $abstractBtn.removeClass("active")
                                    .attr("aria-expanded", "false")
                                    .html('[abstract <i class="fa fa-caret-down"></i>]');
                                $abstractBtn.trigger("focus");
                            });

                            $item.append($abstractBox);
                        }

                        $ul.append($item);
                    });
                }
            });
        });

        // Handle URL hash scrolling
        if (window.location.hash) {
            var hash = window.location.hash.substring(1);
            var $target = $(document.getElementById(hash));
            if ($target.length) {
                $target.addClass("anchored");
                $(document).scrollTop($target.offset().top);
            }
        }
    }).fail(function() {
        $("<p/>").attr("role", "alert")
            .text("Unable to load publications. Please refresh the page to try again.")
            .appendTo("#main");
    });
});
