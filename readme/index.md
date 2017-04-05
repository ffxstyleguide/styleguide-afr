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

Inside each of these folders there is an `index.html` file and several [markdown](https://daringfireball.net/projects/markdown/syntax) files. The index.html is the main section page - for example "Colours" - and for each subsection in that page there is a markdown file. The markdown file names all start with a number; this number determines the order of the subsections. Numbering starts at 00.

Each markdown file should start with [front matter](https://jekyllrb.com/docs/frontmatter/), otherwise Jekyll will not process it. For the subsections you need only add a `title` variable set to that subsection's title, and a `menu-item` variable set to `true` if you wish that subsection to be linked to in the site navigation (if this is not the case you can either not add that variable at all or set it to `false` instead). So for a subsection you would like to include in the navigation the front matter should look something like this:

{% highlight yaml %}
---
title:  brand colours
menu-item: true
---
{% endhighlight %}

### Homepage 

The homepage is generated from the `index.html` file at root level, and its sections can be found in the `_section_frontpage` folder. Whatever you add to this folder will not be linked to in the main navigation so there is no need to set `menu-item` for these sections. You will however need to set a `title`.

### Adding images in content area
{: .styleguide-heading}

Markdown image syntax is very similar to link syntax except it starts with an exclamation mark like so:

{% highlight md %}
![Vertov films oncoming train](../images/vertov.jpg)
{: .f-right .img-medium}
{% endhighlight %}

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

{% highlight bash %}
ruby 2.2.2p95 (2015-04-13 revision 50295) [x86_64-darwin14]
{% endhighlight %}

If you instead see something like

{% highlight bash %}
-bash: ruby: command not found
{% endhighlight %}

you will need to [install Ruby](https://www.ruby-lang.org/en/downloads/).

To install Jekyll, go back to the Terminal and type:

{% highlight bash %}
gem install jekyll
{% endhighlight %}

Next, check out the [Styleguide GitHub repository](https://github.com/ffxstyleguide/styleguide-afr) and make sure you're on the `gh-pages` branch. Your styleguide repo should live inside the project folder in Landmark.

Then in the Terminal navigate to the root styleguide folder - this should be `landmark/sites/[your project name]/styeguide` - and type:

{% highlight bash %}
jekyll serve --baseurl '' --watch
{% endhighlight %}

You can then make changes and Jekyll will update the site as you save. You can preview your changes locally at http://localhost:4000.

### Structural details

Each section of the styleguide, including the front page, corresponds to a [Jekyll collection](https://jekyllrb.com/docs/collections/). 

Each section can have a number of subsections, and these in turn can have several elements or components in them.


#### Adding new sections
{: .styleguide-heading}

To add a section you must create a new collection. This is a two step process:

First you must register the collection in the `_config.yml` file at root level.
Within that file you will find something like:

{% highlight yaml %}
collections:
    section_frontpage:
        output: true
    section_layout:
        output: true
        menu: 0
    section_colours:
        output: true
        menu: 1
{% endhighlight %}

Under `collections` add your section name, indented 4 spaces and followed by a colon. On the line below add `output: true`, indented 8 spaces. Be sure to indent correctly or Jekyll will not process your collection.

If you wish the section to be indexed in the main navigation, set the menu variable to the number the section should occupy in the menu order.

Then you need to create the collection folder. Add a new folder at root level and give it the section name preceded by an underscore.

Inside that folder, you will need to add an `index.html` file containing the following code:

{% highlight yaml%}
---
layout: section
title: [your section name here]
---
{% endhighlight %}
{% highlight liquid %}
{% raw %}
{% for m in site.[your section name here] %}
    {% if m.title != page.title %}

        {{ m.content }}

    {% endif %}
{% endfor %}
{% endraw %}
{% endhighlight %}

This is the loop that displays all the subsections inside the main section.

You can then add in a markdown file for each subsection, numbered 00 - 99 in the order you wish them to display. Add the subsection title in its front matter like so:

{% highlight yaml %}
---
title: intro
---
{% endhighlight %}

For all sections except the intro a level 2 heading (h2) should be added with the exact same text as the subsection title. If there is no heading or the text is not the same, in-page links from the navigation bar will not work, as they depend on automatically generated `id`s for these headings. These headings should also be given a class of `styleguide-heading`, using [Kramdown attribute notation](http://kramdown.gettalong.org/syntax.html#block-ials). Example:

{% highlight md %}
## fonts
{: .styleguide-heading}    
{% endhighlight %}

#### Landing page

The contents of the landing page are stored in the `_section_frontpage` collection but its `index.html` is located at root level instead of in the collection directory.

#### Adding new elements to a section
{: .styleguide-heading}

1. In `_includes/elements` add a new file named `[element_name].html` with the markup for your element. 
2. In the root `elements` directory add another file, also named `[element_name].html`, with the following front matter:

   ~~~ yaml
   ---
   layout: element
   ---
   ~~~

   and then `include` in it the file you created previously with the markup.

3. Add a custom stylesheet for your element (you can use one of the default stylesheets, but elements are usually pretty simple so you probably won't need all the site styles). This stylesheet should be located in the root `css` directory and it can be `.scss` or `.css`. If it is `.scss` you'll have to add at least one line of front matter for Jekyll to compile it. This front matter will usually be a comment detailing the purpose of the stylesheet.

4. To get your element to render in a section, you need to `include element.html` and pass in the following values:

    * element = element name (without file extension)
    * height = height of element in pixels
    * width = width of element in pixels
    * stylesheet = stylesheet name (without file extension)
    * code view = true or false, depending on whether you wish to show the code for the element. 

#### Adding new components to a section
{: .styleguide-heading}

Currently all three breakpoints are rendered by default for each component. This means you need to specify width and height of component for each breakpoint.

1. In `_includes/components` add a new file named `[component_name].html` with the markup for your component. If the component has different markup across breakpoints, add a file for each breakpoint named `[component_name]-[breakpoint].html`
2. In the root `component` directory add another file, also named `[component_name].html`, with the following front matter:

   ~~~ yaml
   ---
   layout: component
   ---
   ~~~

   and then `include` in it the file you created previously with the markup.

3. To get your component to render in a section, you need to `include tabs.html` and pass in the following values:

    * component = component name (without file extension)
    * [breakpoint]-height = height of component in pixels for that breakpoint (needs to be specified for all three breakpoints)
    * [breakpoint]-width = width of component in pixels for that breakpoint (needs to be specified for all three breakpoints)
    * OPTIONAL: [breakpoint] = true (if there is custom markup for that breakpoint)

### Exporting project CSS for the styleguide
{: .styleguide-heading}

A custom `styleguide` task has been added to the project's Grunt config. When run it copies desktop, tablet and mobile stylesheets into the styleguide, plus a custom typography stylesheet (styleguide-fonts.css) with all the current fonts being used on the site. 


