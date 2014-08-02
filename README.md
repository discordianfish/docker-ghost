# Docker
This is how you run and build Ghost on Docker. For more information how
to get started with Docker see: https://www.docker.io/gettingstarted/


## Run it with local, sqlite3 database
To start Ghost with a local sqlite3 database, point URL to your blog's domain and you're done:

    $ docker run -p 8080:8080 -e URL=http://example.com fish/ghost

To upgrade Ghost, just pull or build a new Ghost image and run it, then use `docker inspect`
to locate your old and new containers volume path and copy your old content to the new path.

A cleaner but more advanced way would be to use
[data volume containers](http://docs.docker.io/en/latest/use/working_with_volumes/#creating-and-mounting-a-data-volume-container).
Just use the `fish/ghost` as a image when creating the data volume container, otherwise the\
volume isn't preseeded with the theme and content directories.

## Run it with remote database
To run Ghost with a remote database like MySQL, point DATABASE_URL to your database and URL
to your blog's domain:

    $ sudo docker run -p 8080:8080 -e URL="http://example.com" \
      DATABASE_URL=mysql://ghost:foobar23@1.2.3.4:3306/ghost fish/ghost


Or use Docker links and set DB_CLIENT, DB_USER and DB_PASSWORD:

    $ sudo docker run -p 8080:8080 -link mysql-server:db -e DB_CLIENT=mysql \
                      -e DB_USER=ghost -e DB_PASSWORD=foobar23 \
                      -e URL=http://example.com -e DB_DATABASE=ghost <image-name>


## Mail configuration
Unfortunately Ghost doesn't support direct SMTP mailing, so you need a relay. This Docker image
will read MAIL_HOST, MAIL_SERVICE, MAIL_USER and MAIL_PASS to setup mailing.

## Using custom config
If you like to use a completely different config, you can bind mount
your own config:

    docker run -v path/to/config:config.js fish/ghost

## Building it
To build your own Ghost image, clone and cd to this repository and run:

    $ docker -t <image name> .

