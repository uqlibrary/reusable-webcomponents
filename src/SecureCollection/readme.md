# Secure Collection

Secure Collection provides logged in access to files stored on AWS

## Sample Urls

If these tests are run against the staging api then final links are like https://dddnk7oxlhhax.cloudfront.net/secure/secure/... and doesn't work.  If run against prod api, final links are https://files.library.uq.edu.au/secure/... and do work. If this is a problem then the env values for staging api could be updated.

A link to a non existant resource says so
* LOGIN: doesnt matter
* load: https://assets.library.uq.edu.au/reusable-webcomponents-development/master/index-secure-collection.html?collection=collection&file=doesntExist
* api response: {"response":"No such collection"}
* see: "This file does not exist or is unavailable."

A resource that requires login will redirect to auth for the public user
* LOGIN: logged out
* load: https://assets.library.uq.edu.au/reusable-webcomponents-development/master/index-secure-collection.html?collection=exams&file=2018/Semester_Two_Final_Examinations__2018_PHIL2011_281.pdf
* see: page auto redirects to auth
* then on login page auto directs to exam resource

A link that requires a Statutory Copyright statement does so
* LOGIN: should be logged in
* load: https://assets.library.uq.edu.au/reusable-webcomponents-development/master/index-secure-collection.html?collection=coursebank&file=111111111111111.pdf
* see: This material has been reproduced and communicated to you by or on behalf

A link that requires a Commercial Copyright statement does so
* LOGIN: should be logged in
* load: https://assets.library.uq.edu.au/reusable-webcomponents-development/master/index-secure-collection.html?collection=bomdata&file=ev_2012.zip
* see: This file is provided to support teaching and learning for the staff and students

A link that is missing the appropriate parameters displays a "missing" page
* LOGIN: doesnt matter
* load: https://assets.library.uq.edu.au/reusable-webcomponents-development/master/index-secure-collection.html
* see: This file does not exist or is unavailable.

A link that requires certain user types will give an error
* LOGIN: masquerade as EM user
* load: https://assets.library.uq.edu.au/reusable-webcomponents-development/master/index-secure-collection.html?collection=exams&file=0001/3e201.pdf
* see: Access to this file is only available to UQ staff and students

A resource that requires login can have the login redirect link clicked
* LOGIN: logged out
* turn down network speed to very slow (otherwise will auto redirect) and click the button promptly so it doesnt autoredirect to go straight to auth
* load: https://assets.library.uq.edu.au/reusable-webcomponents-development/master/index-secure-collection.html?collection=exams&file=2018/Semester_Two_Final_Examinations__2018_PHIL2011_281.pdf
* see:  You can [click here] if you aren't redirected, clicking it takes you to auth

A resource that requires login will redirect to the resource for a logged in user
* LOGIN: should be logged in
* load: https://assets.library.uq.edu.au/reusable-webcomponents-development/master/index-secure-collection.html?collection=exams&file=2018/Semester_Two_Final_Examinations__2018_PHIL2011_281.pdf
* see: exam page

A link that downloads can have the "download" button clicked
* LOGIN: should be logged in
* Network speed: turn down network speed to very slow (otherwise will auto redirect)
* load: https://assets.library.uq.edu.au/reusable-webcomponents-development/master/index-secure-collection.html?collection=exams&file=phil1010.pdf
* see: "You can [download the file] if the page does not redirect.", then click and land directly on resource
* You will have a second or so to click the button before it autoredirect

A link that downloads will redirect to the resource
* LOGIN: should be logged in
* Network speed: normal-fast
* load: https://assets.library.uq.edu.au/reusable-webcomponents-development/master/index-secure-collection.html?collection=exams&file=phil1010.pdf
* see: page autoredirects
* (possible flash of the  "You can [download the file] if the page does not redirect." page)

A link that does not require acknowledgement will redirect to the file
* LOGIN: should be logged in
* load: https://assets.library.uq.edu.au/reusable-webcomponents-development/master/index-secure-collection.html?collection=thomson&file=classic_legal_texts/Thynne_Accountability_And_Control.pdf
* see: resource loads
