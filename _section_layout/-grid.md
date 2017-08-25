---
title: Grid
---

All our layouts are based on a 16 column grid composed of 60px blocks with 20px gutters between them. Columns of varying widths can be composed from this base grid, the most common widths being 220, 300 and 460px.

### Base Grid
{: .styleguide-heading}

{% include element.html element="grid-fixed" height="60" width="1300" stylesheet="custom-layout imports-partial/grid" code-view=false %}

### Fixed Column Widths
{: .styleguide-heading}

{% include element.html element="grid-columns" height="360" width="800" stylesheet="custom-layout imports-partial/grid" code-view=false %}

### Available Column Classes
{: .styleguide-heading}

* `col-0-units` : equivalent to `display:none`. For use with CQ-generated markup.
* `col-2-units` : 140px.
* `col-3-units` : 220px.
* `col-4-units` : 300px.
* `col-6-units` : 460px.
* `col-8-units` : 620px.
* `col-9-units` : 700px.

* `col-full-width` : 100%.
* `col-half-width` : 50% - 20px/2. To be used with 2 half-width columns. The gutter unit separating them is halved and subtracted from each.
* `col-third-width` : 100%/3 - 40px/3. To be used with 3 third width columns; gutter logic same as above.

* `col-flex-units-left` : adds `flex-grow:1` and 20px right margin. To be used as left hand side responsive counterpoint to a fixed width column.
* `col-flex-units-right` : same as above but for right hand side.

