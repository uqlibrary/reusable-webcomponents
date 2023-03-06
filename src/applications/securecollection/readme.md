# secure collections

Secure collections appear at eg <https://files.library.uq.edu.au/collection/?collection=documents&file=Tincture_Journal_Issue_Thirteen_(Autumn_2016).pdf> (This can also be found by searching at <https://search.library.uq.edu.au> in Journals for "Tincture" and clicking through the result)

We supply several Web Components to this page: header, footer, etc - and the special `secure-collection` component 

This is done via the collection folder of bucket uql-assets on S3 ie go to <https://s3.console.aws.amazon.com/s3/buckets/uql-assets?region=ap-southeast-2&prefix=collection/&showversions=false> 

or

- log into AWS
- go to https://s3.console.aws.amazon.com/s3/home?region=ap-southeast-2
- in the search field 'find bucket by name', search for `asset`
- select uql-assets
- see collection and collection-staging in the list,
- click either
- click on the index.html entry
- use the Open button to preview the Web Components in action

You can use /collection-staging/ to try stuff out and /collection/ when you are ready to go to prod.

To make a change:

- download the index.html file
- make your change
- use the `Upload` button to upload your file
- go back to the list-of-files page
- select the newly uploaded file by the checkbox on the left
- click the Actions dropdown and choose "Make public using ACL" and click "Make public" on the loaded page (this step may not be needed on this public bucket, not sure)
