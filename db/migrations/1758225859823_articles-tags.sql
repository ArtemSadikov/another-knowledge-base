-- Up Migration
create table tags (
    id uuid default uuid_generate_v4()
        constraint __tags_pk primary key,

    title character varying(30) not null unique,

    created_at timestamp without time zone default now() not null,
    updated_at timestamp without time zone default now() not null,
    deleted_at timestamp without time zone
);

create table articles_tags (
    article_id  uuid not null,
    tag_id      uuid not null,

    constraint __articles_tags_pk
        primary key (article_id, tag_id),

    constraint __articles_tags_article__fk
        foreign key (article_id) references articles(id)
            on delete cascade
            on update cascade,

    constraint __articles_tags_tag__fk
        foreign key (tag_id) references tags(id)
            on delete cascade
            on update cascade
);

-- Down Migration
drop table articles_tags;
drop table tags;
