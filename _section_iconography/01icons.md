---
title:  icons
menu-item: true
---



## icons
{: .styleguide-heading}

<div class="styleguide-iconset">
{% for icon in site.data.icons.icons %}
    <div class="styleguide-iconbox">
        <span class="icon--{{ icon }}"></span>
        <h6 class="styleguide-iconbox__class">.icon--{{ icon }}</h6>
    </div>
{% endfor %}
</div>
