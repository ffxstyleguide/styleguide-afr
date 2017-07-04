---
layout: default
title: readme
published: true
---

# Instructions for editing and maintaining the styleguide

This styleguide is built with [Jekyll](https://jekyllrb.com/docs/home/) static site generator and is hosted on [GitHub Pages](https://pages.github.com/). Its content can be edited with [Prose](http://prose.io/), a web-based content authoring platform, and code contributions can be made through the [GitHub repo](https://github.com/ffxstyleguide/styleguide-afr).

## Designers
{: .styleguide-heading}

### Start contributing: the easy way :D
{: .styleguide-heading}

* go to [Prose](http://prose.io/) and click "authorize on github"
* new to github? click on "create an account" and go through the steps
* go back to prose.io and authorize for your new github account
* To get edit access to the styleguide via Prose you need to contact the [repo administrator](https://github.com/ffxisabel)
* once you have access the repo will appear on your prose dashboard.


### Start contributing: the hard way :P
{: .styleguide-heading}

1.Set up the styleguide locally:

* download and install [Git](https://git-scm.com/)
* download and install [Github Desktop](https://desktop.github.com/) 
* from GitHub Desktop create a GitHub account or sign in if you already have one
* clone the [styleguide repo](https://github.com/ffxstyleguide/styleguide-afr)
* contact the [repo administrator](https://github.com/ffxisabel) for edit access

2. Editing tools

* install [atom code editor](https://atom.io/)

3. Preview changes locally

* install Jekyll following [these instructions](https://ffxstyleguide.github.io/styleguide-afr/readme/#installation)


### File structure
{: .styleguide-heading}

The styleguide is organised in sections. For each of them there is a folder at root level named after the section name. All section folder names are preceded by an underscore.

Inside each of these folders there is an `index.html` file and several [markdown](https://daringfireball.net/projects/markdown/syntax) files. The index.html is the main section page - for example "Colours" - and for each subsection in that page there is a markdown file. The subsection markdown file names all start with a dash.

Each markdown file should start with [front matter](https://jekyllrb.com/docs/frontmatter/), otherwise Jekyll will not process it. For the subsections you need only add a `title` variable set to that subsection's title. Your front matter should look like this:

{% highlight yaml %}
---
title:  brand colours
---
{% endhighlight %}

If you wish to include the subsection in the navigation menu it needs to be listed, in the order it should appear, in the `menu.json` file inside the `_data` folder.

### Homepage

The homepage is generated from the `index.html` file at root level, and its sections can be found in the `_section_frontpage` folder. You will also need to set a `title` for each section. Currently sections are ordered according to file name, thus the numbers in front of each file name.

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

* [markdown 101](https://blog.ghost.org/markdown/)
* [Dillinger: online markdown editor](http://dillinger.io/)
* Jekyll uses a particular flavour of markdown called [Kramdown](http://kramdown.gettalong.org/quickref.html)
* [Intro to Git for non-programmers](http://blog.scottlowe.org/2015/01/14/non-programmer-git-intro/)


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
    section_colours:
        output: true
{% endhighlight %}

Under `collections` add your section name, indented 4 spaces and followed by a colon. On the line below add `output: true`, indented 8 spaces. Be sure to indent correctly or Jekyll will not process your collection.

If you wish the section to be indexed in the main navigation, add the collection name to the `menu.json` data file.

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
{{ site.your_section_name | where:"title", "intro" }}

{% for doc in site.data.menu.your_section_name %}
    {% assign current = site.your_section_name | where:"title", doc | first %}
    {% if current.sub-section-class %}
        <div class="{{current.sub-section-class}}">
    {% endif %}
    <h2 class="styleguide-heading" id="{{ current.title | slugify }}">{{ current.title }}</h2>
    {{ current }}
    {% if current.sub-section-class %}
        </div>
    {% endif %}
{% endfor %}
{% endraw %}
{% endhighlight %}

This is the loop that displays all the subsections inside the main section.

It is possible to add a custom stylesheet to your section by including `custom_css: [your stylesheet name here]` in the front matter of `index.html`.

You can then add in a markdown file for each subsection, prefixed with a dash to ensure it comes before `index.html` in the file order. (This is because the markdown will not be parsed if it comes later.) Add the subsection title in its front matter like so:

{% highlight yaml %}
---
title: intro
---
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

3. Add custom stylesheets for your element (you can use one of the default stylesheets, but elements are usually pretty simple so you probably won't need all the site styles). All the necessary site styles should be imported from landmark but a local stylesheet with additional styles can be added in the root `css` directory. Its extension can be `.scss` or `.css`. If it is `.scss` you'll have to add at least one line of front matter for Jekyll to compile it. This front matter will usually be a comment detailing the purpose of the stylesheet.

4. To get your element to render in a section, you need to `include element.html` and pass in the following values:

    * element = element name (without file extension)
    * height = height of element in pixels
    * width = width of element in pixels
    * stylesheet = space separated list of stylesheet paths relative to root css directory (without file extension)
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

#### Using CSS Grid layouts

CSS Grid is being used for the navigation / main section layout, attached to the `.styleguide-wrap` class. It starts as a 2 column grid on the medium breakpoint with a 220px left hand column and variable width right hand column. The left hand column becomes expansible to 300px on the extra-large breakpoint, and the right hand column becomes expansible between 940px and 1260px.

The grid layout can optionally be used inside the main content area by adding the `.styleguide-section-grid` class to the `main` element (see below for how to do that). This will produce a 2 column (variable width) grid on the large breakpoint, stretching to 4 variable width columns on the extra-large breakpoint. All headings and paragraphs inside the main content area are configured to take up the whole width of the grid as we don't want them split into columns.

Only direct descendants of the grid element will be laid out in columns, so if you want to override this behaviour for a given subsection you can wrap a div around that subsection by adding a classname to it (see below for how to do this).

#### Adding custom classes to sections and subsections

If you wish to add a custom class to a section (for the purpose of using a grid layout, for example), you should add it to the front matter of your section's `index.html` as `main-content-class`.

To add a custom class to a subsection, you can add a `sub-section-class` to the front matter of your subsection. This will wrap a div around that subsection, so, if you don't wish that to happen, the alternative is to add a class to the heading of your subsection by using`{: .my-classname}` directly under that heading, and then target its siblings using the `+` or the `~` selectors. This may affect subsections further down though.

### JavaScript workflow
{: .styleguide-heading}

The styleguide is using RequireJS to handle both FMJS plugins and any custom or third-party code that may be needed.

If a new FMJS plugin is needed:

* specify the plugin path in the Landmark build config styleguide copy task;
* add a new script with the plugin call in `_includes/scripts`;
* in the front matter of `index.html` for the page you want to use the plugin, specify the plugin name:

   ~~~ yaml
   ---
   layout: section
   title: form elements
   scripts: toggle
   ---
   ~~~

If you need to add another plugin or library:

* add it manually to the `js` folder;
* specify its path in `requirejs/require-config.js`;
* proceed as above with plugin calls.

### Exporting project CSS for the styleguide
{: .styleguide-heading}

A custom `styleguide` task has been added to the project's Grunt config. When run it copies desktop, tablet, mobile and icons stylesheets into the `imports-full` directory, and any custom stylesheets defined in `sass/styleguide` are copied into `imports-partial`. When creating a new custom stylesheet, the project build must be run in order to compile it to CSS before running the styleguide task.
