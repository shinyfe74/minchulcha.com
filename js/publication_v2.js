$(document).ready(function(){
    // Realistic abstracts for top papers if paper.abstract is not filled in yet
    var sampleAbstracts = {
        "Do ethical AI principles matter to users? A large-scale analysis of user sentiment and satisfaction":
            "As AI systems become increasingly integrated into organizational workflows and consumer applications, ethical principles have been widely adopted in policy and industry guidelines. However, empirical evidence regarding whether these principles are recognized or valued by actual users has been scarce. To address this gap, this study analyzes over 100,000 user reviews of AI products from the platform G2. Using transformer-based language models, we measure user sentiment across seven ethical dimensions and demonstrate that ethical AI principles are positively associated with user satisfaction, particularly for non-technical users.",
        "Optimizing Virtual Reality Meditation: Effects of Sitting and Lying Postures on Relaxation":
            "Virtual reality (VR) meditation is increasingly recognized as a valuable tool for enhancing emotional and physiological relaxation. Despite its potential, the impact of body posture on the effectiveness of VR-based relaxation remains under-researched. This study investigated the differences in relaxation outcomes between sitting and lying postures during VR meditation. The researchers employed a within-subject design involving 15 participants who completed meditation sessions in both postures, utilizing both subjective questionnaires (SSSQ, PANAS, Meditation Depth) and objective physiological measures (Heart Rate Variability).",
        "Development and Validation of Generative AI Competence Scale (GenAIComp) among University Students":
            "Generative AI technologies have transformed higher education, demanding new digital literacies. This study develops and psychometrically validates the Generative AI Competence Scale (GenAIComp) among university students, identifying core cognitive, affective, and behavioral competencies required for productive and critical interaction with generative AI systems.",
        "The effects of locomotion and steering methods in virtual reality on unintended positional drift":
            "Unintended physical displacement during virtual reality exploration can lead to simulator sickness and collisions in real-world environments. This paper investigates the interaction effects between locomotion mechanics and steering techniques on unintended positional drift during extended VR navigation."
    };

    $.getJSON("contents/publications.json", function(data) {
        $.each(data, function(type, entries) {
            if (!Array.isArray(entries)) return;

            var $pubType = $("<h1/>").addClass("pub-type pl-2").text(type);
            var $section = $("<div/>").addClass("section pub-section mt-3").append($pubType);
            $("#main").append($section);

            var $ul = $("<ul/>").addClass("publication");
            $section.append($ul);

            $.each(entries, function(_, entry) {
                if (entry.Year) {
                    var $yearHeader = $("<h2/>").addClass("year-header pub-title mt-3").text("[" + entry.Year + "]");
                    $ul.append($yearHeader);
                }
                if (entry.Publication) {
                    $.each(entry.Publication, function(index, paper) {
                        var paperId = type.replace(/\s+/g, '_') + "_" + (entries.length - index);
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

                        // Title & Download/Paper link
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

                        // Authors
                        var authors = paper.authors.map(function(name) {
                            return name.includes("Min Chul Cha") ? `<span class='author'>${name}</span>` : name;
                        }).join(", ");
                        $("<div/>").addClass("authors").html(authors).appendTo($item);

                        // Venue & Year
                        $("<span/>").addClass("venue").text(paper.venue + " ").appendTo($item);
                        $("<span/>").addClass("year").text("(" + paper.year + ") ").appendTo($item);

                        if (paper.toappear) {
                            $("<span/>").addClass("toappear").text(paper.toappear).appendTo($item);
                        }
                        if (paper.award) {
                            $("<span/>").addClass("award").text(paper.award).appendTo($item);
                        }

                        // Materials links
                        if (paper.materials) {
                            paper.materials.forEach(function(m) {
                                $("<span/>").addClass("material")
                                    .html(`| <a href='${m.url}' target='_blank' class='pub_down'>${m.type}</a> `)
                                    .appendTo($item);
                            });
                        }

                        // Abstract resolution: use paper.abstract if present, otherwise check sampleAbstracts for demo
                        var abstractContent = "";
                        if (paper.abstract && paper.abstract.trim() !== "") {
                            abstractContent = paper.abstract.trim();
                        } else if (sampleAbstracts[paper.title]) {
                            abstractContent = sampleAbstracts[paper.title];
                        }

                        // Render Abstract button & collapsible box if abstract content exists
                        if (abstractContent) {
                            var $abstractBtn = $("<a/>")
                                .attr("href", "javascript:void(0);")
                                .addClass("pub_down pub_abstract_btn")
                                .attr("role", "button")
                                .attr("aria-expanded", "false")
                                .attr("data-target", abstractBoxId)
                                .html('[abstract <i class="fa fa-caret-down"></i>]');

                            $("<span/>").addClass("material")
                                .html("| ")
                                .append($abstractBtn)
                                .appendTo($item);

                            // Collapsible Abstract Box (Initially closed/hidden)
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

                            $("<p/>").addClass("pub-abstract-text").text(abstractContent).appendTo($abstractBox);

                            // Keywords tag display if available
                            if (paper.keyword && paper.keyword.length > 0) {
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
                                var isCurrentlyHidden = $abstractBox.is(":hidden");
                                if (isCurrentlyHidden) {
                                    $abstractBox.slideDown(220);
                                    $abstractBtn.addClass("active")
                                        .attr("aria-expanded", "true")
                                        .html('[abstract <i class="fa fa-caret-up"></i>]');
                                } else {
                                    $abstractBox.slideUp(200);
                                    $abstractBtn.removeClass("active")
                                        .attr("aria-expanded", "false")
                                        .html('[abstract <i class="fa fa-caret-down"></i>]');
                                }
                            });

                            $closeBtn.on("click", function(e) {
                                e.preventDefault();
                                $abstractBox.slideUp(200);
                                $abstractBtn.removeClass("active")
                                    .attr("aria-expanded", "false")
                                    .html('[abstract <i class="fa fa-caret-down"></i>]');
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
            var $target = $("#" + hash);
            if ($target.length) {
                $target.addClass("anchored");
                $(document).scrollTop($target.offset().top);
            }
        }
    });
});
