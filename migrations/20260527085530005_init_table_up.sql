-- createtable
CREATE TABLE "post" (
    "id" serial NOT NULL,
    "createdat" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedat" timestamp(3) NOT NULL,
    "title" varchar(255) NOT NULL,
    "content" text,
    "published" boolean NOT NULL DEFAULT FALSE,
    "authorid" integer NOT NULL,
    CONSTRAINT "post_pkey" PRIMARY KEY ("id")
);

-- createtable
CREATE TABLE "profile" (
    "id" serial NOT NULL,
    "bio" text,
    "userid" integer NOT NULL,
    CONSTRAINT "profile_pkey" PRIMARY KEY ("id")
);

-- createtable
CREATE TABLE "user" (
    "id" serial NOT NULL,
    "email" text NOT NULL,
    "name" text,
    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- createindex
CREATE UNIQUE INDEX "profile_userid_key" ON "profile" ("userid");

-- createindex
CREATE UNIQUE INDEX "user_email_key" ON "user" ("email");

-- addforeignkey
ALTER TABLE "post"
    ADD CONSTRAINT "post_authorid_fkey" FOREIGN KEY ("authorid") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- addforeignkey
ALTER TABLE "profile"
    ADD CONSTRAINT "profile_userid_fkey" FOREIGN KEY ("userid") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

