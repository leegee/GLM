Golem
=====

Prerequisites
-------------
* Java
* ElasticSearch


Install
-------
    sudo npm install --global mocha
    npm install
    npm test

Dev
---
If you do not recognise the tri-tier architecture in `.config`, please drop me a line.  If you do recognise it, `export ENV=[dev|ci|prod]`.

    mocha [$fie]
    eslint
    git commit -am $what

Roadmap
-------
1. Initial client, to fetch public page stream
1. Initial index
1. Initial term search
1. Client to reverse pps to individual
1. Search culpable individuals
1. Refactor for second client

Useful URIs
-----------

[Facebook Graph Explorer](https://developers.facebook.com/tools/explorer?method=GET&path=142326775790907&version=v2.6)

[Local ES 'postings' Indicies](http://localhost:9200/postings/_search)

