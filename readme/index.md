---
layout: default
title: readme
---

# Instructions for editing and maintaining the styleguide

This styleguide is built with [Jekyll](https://jekyllrb.com/docs/home/) static site generator and is hosted on [GitHub Pages](https://pages.github.com/). Its content can be edited with [Prose](http://prose.io/), a web-based content authoring platform, and code contributions can be made through the [GitHub repo](https://github.com/ffxstyleguide/styleguide-afr).

## Designers
{: .styleguide-heading}

To get edit access to the styleguide via Prose you need to contact the [repo administrator](https://github.com/ffxisabel). 

### File structure
{: .styleguide-heading}

The styleguide is organised in sections. For each of them there is a folder at root level named after the section name. All section folder names are preceded by an underscore.

Inside each of these folders there is an `index.html` file and several [`markdown`](https://daringfireball.net/projects/markdown/syntax) files. The index.html is the main section page - for example "Colours" - and for each subsection in that page there is a markdown file. The markdown file names all start with a number; this number determines the order of the subsections. Numbering starts at 00.

Each markdown file should start with [front matter](https://jekyllrb.com/docs/frontmatter/), otherwise Jekyll will not process it. For the subsections you need only add a `title` variable set to that subsection's title, and a `menu-item` variable set to `true` if you wish that subsection to be linked to in the site navigation (if this is not the case you can either not add that variable at all or set it to `false` instead). So for a subsection you would like to include in the navigation the front matter should look something like this:

    title:  brand colours
    menu-item: true

### Homepage 

The homepage is generated from the `index.html` file at root level, and its sections can be found in the `_frontpage` folder. Whatever you add to this folder will not be linked to in the main navigation so there is no need to set `menu-item` for these sections. You will however need to set a `title`.

### Adding images in content area
{: .styleguide-heading}

Markdown image syntax is very similar to link syntax except it starts with an exclamation mark like so:

    ![Vertov films oncoming train](../images/vertov.jpg)
    {: .f-right .img-medium}

Contents of the square brackets will become image alt text. Note that path to the `/images/` folder must always be specified relative to the file where the image is being inserted.

A few classes are available for positioning and sizing images:

* `img-medium` sizes an image responsively at 50% of content width for screens over 820px and full size for smaller screens
* `img-small` sizes an image responsively at 25% of content width for screens over 820px, 50% for screens over 384px and full size for smaller screens
* `f-left` floats a non-full size image to the left (text will wrap around its right hand side)
* `f-right` floats a non-full size image to the right (text will wrap around its left hand side)

### Resources
{: .styleguide-heading}

Jekyll uses a particular flavour of markdown called [Kramdown](http://kramdown.gettalong.org/quickref.html).


## Developers
{: .styleguide-heading}

### Installation
{: .styleguide-heading}

Check if you have Ruby installed: open a Terminal window, type "ruby -v" and press enter. You should see something like

    ruby 2.2.2p95 (2015-04-13 revision 50295) [x86_64-darwin14]

If you instead see something like

    -bash: ruby: command not found

you will need to [install Ruby](https://www.ruby-lang.org/en/downloads/).

To install Jekyll, go back to the Terminal and type:

    gem install jekyll

Next, check out the [Styleguide GitHub repository](https://github.com/ffxstyleguide/styleguide-afr) and make sure you're on the `gh-pages` branch. Your styleguide repo should live inside the project folder in Landmark.

Then in the Terminal navigate to the root styleguide folder - this should be `landmark/sites/[your project name]/styeguide` - and type:

    jekyll serve --baseurl '' --watch

You can then make changes and Jekyll will update the site as you save. You can preview your changes locally at http://localhost:4000.

### Structural details

Each section of the styleguide corresponds to a [Jekyll collection](https://jekyllrb.com/docs/collections/). 


### Adding new sections
{: .styleguide-heading}

To add a section you must create a new collection. This is a two step process:

First you must register the collection in the `_config.yml` file at root level.
Within that file you will find something like:

    collections:
        typography:
            output: true

Under `collections` add your section name, indented 4 spaces and followed by a colon. On the line below add `output: true`, indented 8 spaces. Be sure to indent correctly or Jekyll will not process your collection.

Then you need to create the collection folder. Add a new folder at root level and give it the section name preceded by an underscore.

Inside that folder, you will need to add an `index.html` file containing the following code:

{% raw %}
    ---
    layout: section
    title: [your section name here]
    ---

    {% for m in site.[your section name here] %}
        {% if m.title != page.title %}

            {{ m.content }}

        {% endif %}
    {% endfor %
{% endraw %}

This is the loop that displays all the subsections inside the main section.

You can then add in a markdown file for each subsection, numbered 00 - 99 in the order you wish them to display. Add the subsection title in its front matter like so:

    ---
    title: intro
    ---

For all sections except the intro a level 2 heading (h2) should be added with the exact same text as the subsection title. If there is no heading or the text is not the same, in-page links from the navigation bar will not work, as they depend on automatically generated `id`s for these headings. These headings should also be given a class of `styleguide-heading`, using [Kramdown attribute notation](http://kramdown.gettalong.org/syntax.html#block-ials). Example:

    ## fonts
    {: .styleguide-heading}


### Adding project CSS to the styleguide
{: .styleguide-heading}

A custom `styleguide` task has been added to the project's Grunt config. When run it copies desktop, tablet and mobile stylesheets into the styleguide, plus a custom typography stylesheet (styleguide-fonts.css) with all the current fonts being used on the site. 


