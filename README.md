# Guardian API Auth Proxy #

A single proxy server to authenticate requests to multiple internal APIs.  Experimenting with using Node.js as a single point of entry to access internal APIs.  The idea being you have _a single_ entry point so APIs can remain inaccessible to the outside world and you only have to edit a single point when making security enhancements. Individual APIs are secured by having to pass a `client_id`, `username`, and `password` along with the request.  This is validated early in the request.

Added benefits include:

* A single database change to the `client_id` and you have re-secured access, if for some reason a malicious intent is discovered.  At that point, the method of entry can be addressed, and new `client_id`s can be distributed (typically in the form of an app update).
* In the use-case of mobile apps, changing the `client_id` can also be detected, and this can be the basis for forcing an app update (i.e. trigger a popup to download new version from app store).
* Logging API traffic is now made *super simple* and analytics become a natural/inherent part of this service.
* And a lot more...

An example of how this is intended to work is as follows:

* Let's say we have an API that returns a list of books when we navigate to http://example.com/api/books.
* We associate a `client_id` of `bookapiv01` to the base url above in a database (in real world use, this should be a completely random generated string so as not to be guessable).
* Our "guardian" service is setup at https://guardian.serverexample.com/.
* We send a post request to our new guardian server (including the uri string) which includes the following:
    * `https://guardian.serverexample.com/api/books` is the url
    * `client_id = booksapiv01`
    * `username = allowedusername`
    * `password = reallysecurepw`
    * `_method = GET` (optional)
    * `params = {"author":"bill"}` (optional)
* The resulting response is the list of books as if we queried the API directly.  Only we successfully authenticated the request and have all the benefits mentioned above.

* Version 0.0.1 (the alpha's alpha)

### Installation ###

* `git clone git@github.com:leothelocust/guardian-api-proxy.git`
* `npm install`
* `node` or `nodemon app.js`
* Voila! It workie.

### Contribution guidelines ###

* Write tests
* Then code
* Code review
* 4 spaces (no tabs)
* Submit pull request

### Contact ###

* Levi Olson <leothelocust> on Github
