---
title:  sizes
menu-item: true
icons:
  mini:
    - class: "icon--alerts"
    - class: "icon--chevron-down"
    - class: "icon--chevron-left"
    - class: "icon--chevron-right"
    - class: "icon--close"
    - class: "icon--create"
    - class: "icon--edit"
    - class: "icon--external-link"
    - class: "icon--home"
    - class: "icon--pin"
    - class: "icon--print"
    - class: "icon--switch"
  small:
    - class: "icon--comment"
    - class: "icon--data"
    - class: "icon--ellipsis"
    - class: "icon--feedback"
    - class: "icon--graph"
    - class: "icon--pdf"
    - class: "icon--photo"
    - class: "icon--search-mini"
    - class: "icon--video"
  medium:
    - class: "icon--calendar"
    - class: "icon--chrome-cog"
    - class: "icon--chrome-enlarge"
    - class: "icon--chrome-full-screen"
    - class: "icon--chrome-help"
    - class: "icon--chrome-next"
    - class: "icon--chrome-pause"
    - class: "icon--chrome-play"
    - class: "icon--chrome-replay"
    - class: "icon--chrome-star"
    - class: "icon--chrome-star-full"
    - class: "icon--chrome-volume-handle"
    - class: "icon--chrome-volume-max"
    - class: "icon--chrome-volume-min"
    - class: "icon--chrome-volume-mute"
    - class: "icon--email"
    - class: "icon--facebook"
    - class: "icon--google-plus"
    - class: "icon--linkedin"
    - class: "icon--location"
    - class: "icon--price"
    - class: "icon--reddit"
    - class: "icon--twitter"
    - class: "icon--url"
---

## icon sizes
{: .styleguide-heading}

Currently there are three size groups, mini (14x14px [sass: $icon-mn]), small (16x16px [sass: [sass: $icon-sm]) and medium (20x20px [sass: $icon-md]). An icon will fall into one of these sizes, currently and icon is only available in a specific size, however this will likely change. Below is a list of these size groups

### mini icons
{: .styleguide-heading}

{% for icon in page.icons.mini %}
<div class="grid__cell unit-3-12">
    <div class="styleguide-iconbox">
        <span class="{{ icon.class }}"></span>
        <h6 class="styleguide-iconbox__class">.{{ icon.class }}</h6>
    </div>
</div>
{% endfor %}

### small icons
{: .styleguide-heading}

{% for icon in page.icons.small %}
<div class="grid__cell unit-3-12">
    <div class="styleguide-iconbox">
        <span class="{{ icon.class }}"></span>
        <h6 class="styleguide-iconbox__class">.{{ icon.class }}</h6>
    </div>
</div>
{% endfor %}

### medium icons
{: .styleguide-heading}

{% for icon in page.icons.medium %}
<div class="grid__cell unit-3-12">
    <div class="styleguide-iconbox">
        <span class="{{ icon.class }}"></span>
        <h6 class="styleguide-iconbox__class">.{{ icon.class }}</h6>
    </div>
</div>
{% endfor %}
