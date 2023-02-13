This document describes how changes can be made to various areas of the Homepage.

# General instructions:

1. Edit the file specific to the area you want to change (see below) in the correct branch and commit your change.
   The branch to use is `user-admin-manage`
   If you are using Github to edit, then your screen should look like this:
   ![Demonstrating selecting the UX Services branch](https://raw.githubusercontent.com/uqlibrary/reusable-webcomponents/user-admin-manage/docs/demo-user-edit.png?token=AEOON3OI7JAK6MIRAWFOQYDAUNEXK 'Demonstrating selecting the UX Services branch')
2. Check the build passes on Amazon by checking the `System - Deployments` channel on Teams (if you have access, you can also check it on [Amazon](https://ap-southeast-2.console.aws.amazon.com/codesuite/codepipeline/pipelines/reusable-webcomponents-user-admin-manage/view?region=ap-southeast-2))
3. Preview the change at <http://assets.library.uq.edu.au/reusable-webcomponents-development/user-admin-manage/index.html> after AWS passes.
4. Let devs know that you have a change to be merged in

- If it does not pass on first go and you do not have permissions to view the error in AWS, it is suggested you immediately get a dev to fix it for you as they can fix code layout errors very simply. Worry about getting the words right :)

## To edit the Mega menu

(This also covers the list of services in the Connect Footer that matches the headers in the mega menu)

Edit [menu.js](https://github.com/uqlibrary/reusable-webcomponents/blob/user-admin-manage/src/locale/menu.js) and then follow the General Instructions above.

Please leave the datatestid elements in place

## To edit the Footer

Edit [footer.locale.js](https://github.com/uqlibrary/reusable-webcomponents/blob/user-admin-manage/src/ConnectFooter/connectfooter.locale.js) and then follow the General Instructions above.

(Note that only the Connect Footer items are working - Minimal Footer is controlled by ITS markup)

## Viewing what each user type sees

Visit [the homepage test file](https://github.com/uqlibrary/homepage-react/blob/user-admin-manage/cypress/integration/homepage.spec.js#L9) to view what elements many user types can see on the Homepage. (Developers can add remaining types on request)

## Viewing what each external application should have

Visit [the application test file](https://github.com/uqlibrary/reusable-webcomponents/blob/user-admin-manage/cypress/integration/application.js#L123)

## To edit the Promo Panel on the homepage

See [the homepage repo](https://github.com/uqlibrary/homepage-react/blob/user-admin-manage/docs/admin-howto.md)
