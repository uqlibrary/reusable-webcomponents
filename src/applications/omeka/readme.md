# Omeka Customisation

Omeka is a third party CMS the Library is using for online library exhibits.

Omeka live URL: https://uqlibraryonlineexhibitions.omeka.net/

The highest profile exhibit atm is [JD Fryer](https://uqlibraryonlineexhibitions.omeka.net/exhibits/show/jd-fryer-student-and-soldier)

Login as admin [here](https://uqlibraryonlineexhibitions.omeka.net/admin/) - user email and password are in PasswordState.

There is no development environment, but there has been a test project in the past, it may still exist: [View](https://uqlibraryonlineexhibitions.omeka.net/exhibits/show/lea-s-test/sample-page) - [Admin](https://uqlibraryonlineexhibitions.omeka.net/admin/exhibits/theme-config/7).

The [load js file](https://github.com/uqlibrary/reusable-webcomponents/blob/master/src/applications/omeka/load.js") and the [the assets css file](https://github.com/uqlibrary/reusable-webcomponents/blob/master/src/applications/omeka/custom-styles.scss) are the preferred way of styling the Exhibit pages.

The Omeka homepage is updated in the [CSS Plugin](http://uqlibraryonlineexhibitions.omeka.net/admin/plugins)
which has major restrictions, eg:

* any styling of html header and footer elements are removed!!!
* any styling of the body element is removed
* any property set to a value of 'inherit' is removed
* omeka doesnt recognise rem unit values and removes the property, so supply a px default
* the following properties are removed:
** transition
** transition-delay
** max-width
** width
** min-height
* it strips :before attributes
* any styling on a child element rewrites the '>' to \3E
* doubtless more

This means the Omeka homepage cannot have a great deal of styling - I think I've wrung everything out of it that can be done. (See below for backup of css).

JS is applied in the footer, the JS Fryer Exhibit can be edited [on this page](http://uqlibraryonlineexhibitions.omeka.net/admin/exhibits/theme-config/1) (or... click on exhibits in the left hand nav, click 'edit' on the chosen exhibit, scroll down to the theme dropdown, change theme if needed and click Configure). Once on that page, scroll down to 'Footer Text', click the 'HTML' icon on the edit area, and update the html for the footer. 

Maintain the following code block as the correct inclusions for all exhibits (some may have extra markup in the footer field for display):

        <script type="text/javascript" src="//assets.library.uq.edu.au/reusable-webcomponents/applications/omeka/load.js"></script>
        <script type="text/javascript" src="//assets.library.uq.edu.au/reusable-webcomponents/uq-lib-reusable.min.js" defer></script>

If you have a specific theme that needs special styling, you can add a new class name to the body element by adding these lines to the bottom of the footer (edit the footer as described above). This function call will add a class to the body element - then you can write css to target just this theme in a .scss file. (it will affect all exhibits that have had this classname added to the body)

        <script type="text/javascript">
          AddClassNameToBody('bigtheme');
        </script>  

The UQ logo used by omeka is uq-exhibitions-logo.png and archived in this folder.

The homepage css at http://uqlibraryonlineexhibitions.omeka.net/admin/plugins/config?name=CSSEditor as at 30/10/2018:

#home {
font-family:Roboto, 'Helvetica Neue', Helvetica, Arial, sans-serif
}

#site-title {
height:100px;
background-color:#51247A;
margin-left:0;
padding-left:16px
}

#wrap {
background-color:#fff;
color:#66615D;
padding-left:1em;
padding-right:1em;
margin-left:auto;
margin-right:auto
}

@media screen and (max-width: 900px) {
#footer-text {
background-color:#51247A;
color:#d4c8de;
height:230px
}
}

a {
color:#8457AD
}