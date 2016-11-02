---
layout: default
title: readme
---

# Instructions for editing and maintaining the styleguide

This styleguide is built with [Jekyll](https://jekyllrb.com/docs/home/) static site generator. The best way to edit it is to install and run it locally, then commit and push your changes to the Landmark Bitbucket repository.

## Installation
{: .styleguide-heading}

Check if you have Ruby installed: open a Terminal window, type "ruby -v" and press enter. You should see something like

    ruby 2.2.2p95 (2015-04-13 revision 50295) [x86_64-darwin14]

If you instead see something like

    -bash: ruby: command not found

you will need to [install Ruby](https://www.ruby-lang.org/en/downloads/).

To install Jekyll, go back to the Terminal and type:

    gem install jekyll

Next, check out the [Landmark Bitbucket repository](https://bitbucket.org/fairfax/xdb-landmark) and pull down the [styleguide branch](https://bitbucket.org/fairfax/xdb-landmark/branch/feature/LANDMARK-styleguide). More details on cloning a git repository [here](https://confluence.atlassian.com/bitbucket/clone-a-repository-223217891.html).

Then in the Terminal navigate to the root styleguide folder - this should be in `landmark/sites/[your project name]` - and type:

    jekyll build --watch

You can then edit the markdown files and Jekyll will update the site as you save.

## File structure
{: .styleguide-heading}

The styleguide is organised in sections and each section corresponds to a [Jekyll collection](https://jekyllrb.com/docs/collections/). For each of them there is a folder at root level named after the section name. All folder names are preceded by an underscore; that is how Jekyll identifies collections.

Inside each of these folders there is an `index.html` file and several [`markdown`](https://daringfireball.net/projects/markdown/syntax) files. The index.html is the main section page - for example "Colours" - and for each subsection in that page there is a markdown file. The markdown file names all start with a number; this number determines the order of the subsections. Numbering starts at 00.

Each markdown file should start with [front matter](https://jekyllrb.com/docs/frontmatter/), otherwise Jekyll will not process it. For the subsections you need only add a title.

Each markdown file in a section folder will be added to the left hand side navigation bar under that section, UNLESS its title is "intro" OR equal to the section name.

The homepage is generated from the `index.md` file at root level.

## Adding new sections
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


## Adding images in content area
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

## Adding project CSS to the styleguide
{: .styleguide-heading}

The CSS from the project is fed directly into the styleguide. Inside the project's `sass` folder there is a `styleguide` folder containing two files: `styleguide.scss` lists all the partials that need to be included both from base landmark level and project level, and `_styleguide-settings.scss` is where all the styles for the styleguide itself are located.

These files get compiled whenever any project `.scss` file is updated via the same `grunt` task that updates the project CSS and the compiled `styleguide.css` is sent to the css folder within the styleguide itself.

## Resources
{: .styleguide-heading}

Jekyll uses a particular flavour of markdown called [Kramdown](http://kramdown.gettalong.org/quickref.html).
